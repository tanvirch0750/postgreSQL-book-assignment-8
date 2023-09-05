export type IGenericPaginationResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericPaginationResponseSize<T> = {
  meta: {
    page: number;
    size: number;
    total: number;
  };
  data: T;
};
