import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IQueryEngine } from '../../interface/IQueryEngine';
import { IPaginationState } from '../../interface/IPaginationState';

export type QueryMode = 'server' | 'local';

export class HybridQueryEngine<T> {
    private sourceData: T[] = [];
    private sourceLoaded = false;
    private sourceSubscription?: Subscription;
    private querySubscription?: Subscription;

    private readonly queryState = new BehaviorSubject<IQueryEngine>({ _page: 1, _limit: 7 });
    readonly query$ = this.queryState.asObservable();

    private readonly resultSubject = new BehaviorSubject<T[]>([]);
    readonly result$ = this.resultSubject.asObservable();

    private readonly paginationSubject = new BehaviorSubject<IPaginationState>({
        currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 0,
    });
    readonly pagination$ = this.paginationSubject.asObservable();

    constructor(
        private readonly fetchFromServer: (query: IQueryEngine) => Observable<T[]>,
        private readonly localQueryStrategy: (data: T[], query: IQueryEngine) => T[],
        private readonly source$: Observable<T[]> | null = null,
        private readonly mode: QueryMode = 'local',
    ) {
        this.querySubscription = this.query$.pipe(
            switchMap(query => this.executeQuery(query))
        ).subscribe();

        if (this.mode === 'local' && this.source$) {
            this.sourceSubscription = this.source$.subscribe({
                next: (data) => {
                    this.sourceData = [...data];
                    this.sourceLoaded = true;
                    this.refresh();
                },
            });
        }
    }

    private executeQuery(query: IQueryEngine): Observable<T[]> {
        return this.mode === 'server' ? this.executeServerQuery(query) : this.executeLocalQuery(query);
    }

    private executeServerQuery(query: IQueryEngine): Observable<T[]> {
        return this.fetchFromServer(query);
    }

    private executeLocalQuery(query: IQueryEngine): Observable<T[]> {
        if (!this.sourceLoaded) {
            this.resultSubject.next([]);
            this.paginationSubject.next({
                currentPage: 1, pageSize: query._limit ?? 10, totalItems: 0, totalPages: 0,
            });
            return new Observable<T[]>(subscriber => {
                subscriber.next([]);
                subscriber.complete();
            });
        }

        return new Observable<T[]>(subscriber => {
            const result = this.buildLocalResult(query);
            subscriber.next(result);
            subscriber.complete();
        });
    }

    private buildLocalResult(query: IQueryEngine): T[] {
        const queriedData = this.localQueryStrategy([...this.sourceData], query);
        return this.paginate(queriedData, query);
    }

    private paginate(data: T[], query: IQueryEngine): T[] {
        const page = Math.max(query._page ?? 1, 1);
        const pageSize = Math.max(query._limit ?? 10, 1);
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
        const startIndex = (safePage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const result = data.slice(startIndex, endIndex);

        this.paginationSubject.next({
            currentPage: safePage, pageSize, totalItems, totalPages,
        });
        this.resultSubject.next(result);

        return result;
    }

    patchQuery(partialQuery: Partial<IQueryEngine>): void {
        const currentQuery = this.queryState.value;
        const nextQuery: IQueryEngine = { ...currentQuery, ...partialQuery };

        const isPageChange = partialQuery._page !== undefined;
        if (!isPageChange) {
            nextQuery._page = 1;
        }

        this.queryState.next(this.cleanQuery(nextQuery));
    }

    reset(): void {
        this.queryState.next({ _page: 1, _limit: 10 });
    }

    clearSearch(): void {
        this.patchQuery({ searchTerm: undefined }); // تأكد إن الـ Interface بيسمح بـ searchTerm
    }

    refresh(): void {
        this.queryState.next({ ...this.queryState.value });
    }

    refreshSource(): void {
        if (this.mode === 'server') {
            this.refresh();
            return;
        }

        this.sourceLoaded = false;
        this.resultSubject.next([]);
        this.paginationSubject.next({
            currentPage: 1, pageSize: this.queryState.value._limit ?? 10, totalItems: 0, totalPages: 0,
        });
    }

    private cleanQuery(query: IQueryEngine): IQueryEngine {
        return Object.fromEntries(
            Object.entries(query).filter(
                ([, value]) => value !== undefined && value !== null && value !== ''
            )
        ) as IQueryEngine;
    }

    destroy(): void {
        this.querySubscription?.unsubscribe();
        this.sourceSubscription?.unsubscribe();
    }
}