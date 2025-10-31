import { Request, Response } from "express";
import { uploadMessageAttachment } from "../services/message-attachment.service";
import { ApiResponse } from "../util/response.util";

export const uploadMessageAttachmentController = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    return ApiResponse(res, 400, "No file uploaded");
  }

  try {
    const attachment = await uploadMessageAttachment(file);
    return ApiResponse(res, 200, "Attachment uploaded successfully", attachment);
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Failed to upload attachment";
    return ApiResponse(res, 500, message);
  }
};

