export type ApiResponseType<T = unknown> = {
  responseCode: number | string;
  message: string;
  data?: T | null;
};
