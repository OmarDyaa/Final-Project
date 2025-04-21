export interface Pagination<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
}
