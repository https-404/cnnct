import { Request, Response } from 'express';
import { ApiResponse } from '../util/response.util';

export const healthCheck = (req: Request, res: Response) => {
    ApiResponse(res, 200, 'Server is healthy!', { uptime: process.uptime() });
};