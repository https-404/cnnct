export type ApiResponse<T> = {
  statuscode: number;
  message: string;
  data?: T;
};