import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map, catchError, shareReplay, tap } from 'rxjs/operators';
import { IQueryEngine } from '../../interface/IQueryEngine';

export interface EngineConfig<T> {
    mode: 'server' | 'local';
    searchKeys?: (keyof T)[]; // بنبعتله هنا الـ keys اللي هيبحث فيها لو المود local
}

export class HybridQueryEngine<T> {
    public queryState$ = new BehaviorSubject<IQueryEngine>({ _page: 1, _limit: 10 });
    public data$: Observable<T[]>;

    // ضفنا دول عشان الـ Pagination في الـ UI يشتغل أوتوماتيك
    public totalItems$ = new BehaviorSubject<number>(0);
    public totalPages$ = new BehaviorSubject<number>(0);

    public localDataCache$: Observable<T[]> | null = null;
    private config: EngineConfig<T>;

    constructor(
        private fetchFromServer: (query: IQueryEngine) => Observable<T[]>,
        config: Partial<EngineConfig<T>> = {}
    ) {
        // Default Config
        this.config = { mode: 'server', searchKeys: [], ...config };

        this.data$ = this.queryState$.pipe(
            switchMap((query) => {
                if (this.config.mode === 'server') {
                    // في حالة السيرفر: الباك إند هو اللي بيحسب وبيرجع كل حاجة
                    return this.fetchFromServer(query).pipe(
                        // هنا مفروض الباك إند بيرجع TotalPages بس هنفترض إنه بيرجع الداتا حالياً
                        catchError((err) => {
                            console.error('[Engine] Server Error:', err);
                            return of([]);
                        })
                    );
                } else {
                    // Local Mode Pipeline
                    if (!this.localDataCache$) {
                        this.localDataCache$ = this.fetchFromServer({}).pipe(
                            shareReplay(1),
                            catchError((err) => {
                                console.error('[Engine] Local Error:', err);
                                return of([]);
                            })
                        );
                    }

                    return this.localDataCache$.pipe(
                        map((allData) => this.processLocalData(allData, query))
                    );
                }
            })
        );
    }
    patchQuery(partialQuery: Partial<IQueryEngine>): void {
        const current = this.queryState$.getValue();
        const newQuery = { ...current, ...partialQuery };

        Object.keys(newQuery).forEach(key => {
            if (newQuery[key as keyof IQueryEngine] === undefined || newQuery[key as keyof IQueryEngine] === '') {
                delete newQuery[key as keyof IQueryEngine];
            }
        });
        this.queryState$.next(newQuery);
    }

    // الـ Core Logic: هنا الـ Engine بيعمل كل حاجة لوحده بناءً على الكونفيجريشن
    private processLocalData(data: T[], query: IQueryEngine): T[] {
        let result = [...data];

        // 1. Generic Search Strategy
        if (query.searchTerm && this.config.searchKeys?.length) {
            const term = query.searchTerm.toLowerCase();
            result = result.filter(item =>
                this.config.searchKeys!.some(key =>
                    String(item[key] ?? '').toLowerCase().includes(term)
                )
            );
        }

        // 2. Generic Sort Strategy
        if (query._sort) {
            result.sort((a, b) => {
                const valA = String(a[query._sort as keyof T] ?? '').toLowerCase();
                const valB = String(b[query._sort as keyof T] ?? '').toLowerCase();
                const comparison = valA.localeCompare(valB);
                return query._order === 'desc' ? -comparison : comparison;
            });
        }

        // 3. Update Pagination State (عشان الـ UI يعرف احنا عندنا كام صفحة بعد الفلترة)
        const totalItems = result.length;
        const limit = query._limit || 10;
        const totalPages = Math.ceil(totalItems / limit);

        this.totalItems$.next(totalItems);
        this.totalPages$.next(totalPages);

        // 4. Pagination (Slicing) Strategy
        const page = query._page || 1;
        const startIndex = (page - 1) * limit;
        return result.slice(startIndex, startIndex + limit);
    }
    // ضيف الميثود دي عشان تفرمت الكاش وتجبر السيرفر يبعت الداتا الجديدة
    invalidateCache(): void {
        if (this.config.mode === 'local') {
            this.localDataCache$ = null;
        }
        this.queryState$.next(this.queryState$.getValue());
    }
}
