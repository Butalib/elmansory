export interface IQueryEngine {
    searchTerm?: string;
    _page?: number;
    _limit?: number;
    _sort?: string;
    _order?: 'asc' | 'desc';
    filters?: Record<string, unknown>;
    [key: string]: any;
    title_like?: string;
    isActive?: boolean;
    displayLocation?: string;
}
