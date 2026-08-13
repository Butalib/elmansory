export interface IPagedResponse<T> {
    data: T[];

    page: number;

    pageSize: number;

    totalItems: number;

    totalPages: number;
}