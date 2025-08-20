import { Request, Response } from "express";
import { uploadProfilePicture, getCurrentUser, updateCurrentUser } from "../services/user.service";
import { ApiResponse } from "../util/response.util";

export const uploadProfilePictureController = async (req: Request, res: Response) => {
   const userId = req.user?.userId;
  const file = req.file;

  if (!file) return ApiResponse(res, 400, "No file uploaded");

  try {
    const updatedUser = await uploadProfilePicture(userId, file);
    return ApiResponse(res, 200, "Profile picture uploaded successfully", updatedUser);
  } catch (error: any) {
    let message = 'Failed to upload profile picture';
    if (error?.code === 'P2002' && error?.meta?.target?.includes('username')) {
      message = 'Username already exists';
    } else if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
      message = 'Email already exists';
    } else if (error instanceof Error) {
      message = error.message;
    }
    return ApiResponse(res, 500, message);
  }

}


export const getCurrentUserController = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse(res, 401, "Unauthorized");
  try {
    const user = await getCurrentUser(userId);
    return ApiResponse(res, 200, "User profile fetched", user);
  } catch (error: any) {
    let message = 'Failed to fetch user profile';
    if (error instanceof Error) {
      message = error.message;
    }
    return ApiResponse(res, 500, message);
  }
};

export const updateCurrentUserController = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse(res, 401, "Unauthorized");
  try {
    const user = await updateCurrentUser(userId, req.body);
    return ApiResponse(res, 200, "User profile updated", user);
  } catch (error: any) {
    let message = 'Failed to update user profile';
    if (error?.code === 'P2002' && error?.meta?.target?.includes('username')) {
      message = 'Username already exists';
    } else if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
      message = 'Email already exists';
    } else if (error instanceof Error) {
      message = error.message;
    }
    return ApiResponse(res, 500, message);
  }
};