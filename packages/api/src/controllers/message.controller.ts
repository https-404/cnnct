import { Request, Response } from "express";
import * as MessageService from "../services/message.service";
import { ApiResponse } from "../util/response.util";

export const getMessages = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const otherUserId = req.params.userId;
  const { page = 1, pageSize = 20 } = req.query;
  if (!userId) return ApiResponse(res, 401, "Unauthorized");
  try {
    const messages = await MessageService.getMessages(userId, otherUserId, Number(page), Number(pageSize));
    return ApiResponse(res, 200, "Messages fetched", messages);
  } catch (error: any) {
    let message = 'Failed to fetch messages';
    if (error instanceof Error) message = error.message;
    return ApiResponse(res, 500, message);
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const messageId = req.params.messageId;
  if (!userId) return ApiResponse(res, 401, "Unauthorized");
  try {
    await MessageService.deleteMessage(userId, messageId);
    return ApiResponse(res, 200, "Message deleted");
  } catch (error: any) {
    let message = 'Failed to delete message';
    if (error instanceof Error) message = error.message;
    return ApiResponse(res, 500, message);
  }
};
