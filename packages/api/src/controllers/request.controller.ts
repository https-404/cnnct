import { Request, Response } from "express";
import * as RequestService from "../services/request.service";
import { ApiResponse } from "../util/response.util";

export const listRequests = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse(res, 401, "Unauthorized");
  try {
    const requests = await RequestService.listRequests(userId);
    return ApiResponse(res, 200, "Requests fetched", requests);
  } catch (error) {
    return ApiResponse(res, 500, "Failed to fetch requests");
  }
};

export const sendRequest = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const recipientId = req.params.userId;
  if (!userId) return ApiResponse(res, 401, "Unauthorized");
  try {
    const request = await RequestService.sendRequest(userId, recipientId);
    return ApiResponse(res, 201, "Request sent", request);
  } catch (error: any) {
    let message = 'Failed to send request';
    if (error?.code === 'P2002') {
      message = 'Request already exists';
    } else if (error instanceof Error) {
      message = error.message;
    }
    return ApiResponse(res, 400, message);
  }
};

export const acceptRequest = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const requestId = req.params.requestId;
  if (!userId) return ApiResponse(res, 401, "Unauthorized");
  try {
    const result = await RequestService.acceptRequest(userId, requestId);
    return ApiResponse(res, 200, "Request accepted", result);
  } catch (error: any) {
    let message = 'Failed to accept request';
    if (error instanceof Error) {
      message = error.message;
    }
    return ApiResponse(res, 400, message);
  }
};

export const rejectRequest = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const requestId = req.params.requestId;
  if (!userId) return ApiResponse(res, 401, "Unauthorized");
  try {
    const result = await RequestService.rejectRequest(userId, requestId);
    return ApiResponse(res, 200, "Request rejected", result);
  } catch (error: any) {
    let message = 'Failed to reject request';
    if (error instanceof Error) {
      message = error.message;
    }
    return ApiResponse(res, 400, message);
  }
};

export const cancelRequest = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const requestId = req.params.requestId;
  if (!userId) return ApiResponse(res, 401, "Unauthorized");
  try {
    const result = await RequestService.cancelRequest(userId, requestId);
    return ApiResponse(res, 200, "Request canceled", result);
  } catch (error: any) {
    let message = 'Failed to cancel request';
    if (error instanceof Error) {
      message = error.message;
    }
    return ApiResponse(res, 400, message);
  }
};
