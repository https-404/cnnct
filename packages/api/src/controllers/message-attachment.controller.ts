import { Request, Response } from "express";
import { uploadMessageAttachment } from "../services/message-attachment.service";
import { ApiResponse } from "../util/response.util";

export const uploadMessageAttachmentController = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    console.error('No file uploaded - req.file is:', req.file);
    console.error('req.body:', req.body);
    return ApiResponse(res, 400, "No file uploaded");
  }

  try {
    console.log('Uploading file:', file.originalname, 'Size:', file.size, 'Type:', file.mimetype);
    const attachment = await uploadMessageAttachment(file);
    console.log('File uploaded successfully:', attachment.url);
    return ApiResponse(res, 200, "Attachment uploaded successfully", attachment);
  } catch (error: any) {
    console.error('Error uploading attachment:', error);
    const message = error instanceof Error ? error.message : "Failed to upload attachment";
    return ApiResponse(res, 500, message);
  }
};

