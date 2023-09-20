export interface Pagination<T> {
  pagination: {
    totalData: number,
    currentPage: number,
    totalPages: number,
    nextPage: number | null,
  }
  data: T[];
}
