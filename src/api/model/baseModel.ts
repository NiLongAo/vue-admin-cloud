export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
}

export interface BasicFetchResult<T extends any> {
  data: T[];
  total: number;
}
