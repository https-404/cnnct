import { Request, Response } from "express";
import { uploadProfilePicture } from "../services/user.service";
import { ApiResponse } from "../util/response.util";

export const uploadProfilePictureController = async (req: Request, res: Response) => {
   const userId = req.user?.userId;
  const file = req.file;

  if (!file) return ApiResponse(res, 400, "No file uploaded");

  try {
    const updatedUser = await uploadProfilePicture(userId, file);
    return ApiResponse(res, 200, "Profile picture uploaded successfully", updatedUser);
  } catch (error) {
    return ApiResponse(res, 500, "Failed to upload profile picture");
  }

}