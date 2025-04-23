export interface Pagination<T> {
  totalItems: number;
  pageSize: number;
  count: number;
  data: T[];
}
