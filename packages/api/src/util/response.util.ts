import { Response } from 'express';
import { ApiResponseType } from '../types/api-response.type';

export function ApiResponse<T>(
  res: Response,
  status: number,
  message: string,
  data?: T,
  responseCode?: number | string
) {
  const body: ApiResponseType<T> = {
    responseCode: responseCode ?? status,
    message,
    ...(data !== undefined ? { data } : {}),
  };
  return res.status(status).json(body);
}
