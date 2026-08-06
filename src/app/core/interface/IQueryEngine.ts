export interface IQueryEngine {
    q?: string;
    _page?: number;
    _limit?: number;
    _sort?: string;
    _order?: 'asc' | 'desc';
    [key: string]: any;
    title_like?: string;
    isActive?: boolean;
    displayLocation?: string;
}
