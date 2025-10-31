import { putBuffer } from "../lib/minio";
import { backendStorageUrl } from "../util/backendStorageUrl";
import { compressImage } from "../util/compressImage";
import { randomUUID } from "crypto";
import path from "path";
import sharp from "sharp";
import { MessageType } from "@prisma/client";

type MulterFile = Express.Multer.File;

export async function uploadMessageAttachment(file: MulterFile): Promise<{
  url: string;
  type: MessageType;
  sizeBytes: number;
  width?: number;
  height?: number;
  durationMs?: number;
  fileName: string;
}> {
  if (!file) {
    throw new Error("No file uploaded");
  }

  const fileSize = file.size;
  const fileName = file.originalname;
  const mimeType = file.mimetype;

  // Determine message type
  let messageType: MessageType;
  if (mimeType.startsWith('image/')) {
    messageType = MessageType.IMAGE;
  } else if (mimeType.startsWith('video/')) {
    messageType = MessageType.VIDEO;
  } else if (mimeType.startsWith('audio/')) {
    messageType = MessageType.AUDIO;
  } else {
    messageType = MessageType.FILE;
  }

  let processedBuffer = file.buffer;
  let width: number | undefined;
  let height: number | undefined;

  // Process images: compress and get dimensions
  if (messageType === MessageType.IMAGE) {
    try {
      const imageInfo = await sharp(file.buffer).metadata();
      width = imageInfo.width;
      height = imageInfo.height;

      // Compress image
      processedBuffer = await compressImage(file.buffer);
    } catch (error) {
      // If image processing fails, use original buffer
      console.error("Image processing error:", error);
      processedBuffer = file.buffer;
    }
  }

  // Generate unique filename
  const ext = path.extname(fileName) || '';
  const uniqueName = `messages/${randomUUID()}${ext}`;

  // Upload to MinIO
  try {
    console.log('Uploading to MinIO:', uniqueName, 'Content-Type:', mimeType, 'Size:', processedBuffer.length);
    await putBuffer(uniqueName, processedBuffer, mimeType);
    const url = backendStorageUrl(uniqueName);
    console.log('MinIO upload successful. URL:', url);
    
    return {
      url,
      type: messageType,
      sizeBytes: processedBuffer.length,
      width,
      height,
      fileName,
    };
  } catch (error) {
    console.error('MinIO upload error:', error);
    throw new Error(`Failed to upload file to storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

