import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { IQueryEngine } from '../../interface/IQueryEngine';
export class HybridQueryEngine<T> {
    private queryState$ = new BehaviorSubject<IQueryEngine>({});
    public data$: Observable<T[]>;
    constructor(
        private fetchFromServer: (query: IQueryEngine) => Observable<T[]>,
        private localFilterStrategy: (data: T[], query: IQueryEngine) => T[],
        public mode: 'server' | 'local' = 'server'
    ) {
        this.data$ = this.queryState$.pipe(
            switchMap((query) => {
                if (this.mode === 'server') {
                    return this.fetchFromServer(query).pipe(
                        catchError((err) => {
                            console.error('[Engine] Server Error:', err);
                            return of([]);
                        })
                    );
                } else {
                    return this.fetchFromServer({}).pipe(
                        map((allData) => this.localFilterStrategy(allData, query)),
                        catchError((err) => {
                            console.error('[Engine] Local Error:', err);
                            return of([]);
                        })
                    );
                }
            })
        );
    }
    patchQuery(partialQuery: Partial<IQueryEngine>): void {
        const current = this.queryState$.getValue();

        const newQuery = { ...current, ...partialQuery };
        Object.keys(newQuery).forEach(key => {
            if (newQuery[key] === undefined || newQuery[key] === '') {
                delete newQuery[key];
            }
        });

        this.queryState$.next(newQuery);
    }
    switchMode(newMode: 'server' | 'local'): void {
        this.mode = newMode;
        this.queryState$.next(this.queryState$.getValue());
    }
}