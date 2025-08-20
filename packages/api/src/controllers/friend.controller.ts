import { Request, Response } from "express";
import * as FriendService from "../services/friend.service";
import { ApiResponse } from "../util/response.util";

export const listFriends = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse(res, 401, "Unauthorized");
  try {
    const friends = await FriendService.listFriends(userId);
    return ApiResponse(res, 200, "Friends fetched", friends);
  } catch (error: any) {
    let message = 'Failed to fetch friends';
    if (error instanceof Error) message = error.message;
    return ApiResponse(res, 500, message);
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const friendId = req.params.userId;
  if (!userId) return ApiResponse(res, 401, "Unauthorized");
  try {
    await FriendService.removeFriend(userId, friendId);
    return ApiResponse(res, 200, "Friend removed");
  } catch (error: any) {
    let message = 'Failed to remove friend';
    if (error instanceof Error) message = error.message;
    return ApiResponse(res, 500, message);
  }
};
