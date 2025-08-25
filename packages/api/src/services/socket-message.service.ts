import { prisma } from "../lib/prisma";
import { MessageType } from "@prisma/client";

export async function sendDirectMessage({
  senderId,
  receiverId,
  text,
  attachments
}: {
  senderId: string;
  receiverId: string;
  text?: string;
  attachments?: Array<{
    url: string;
    type: MessageType;
    sizeBytes?: number;
    width?: number;
    height?: number;
    durationMs?: number;
  }>;
}) {
  // Only allow up to 4 attachments
  if (attachments && attachments.length > 4) {
    throw new Error("Maximum 4 attachments allowed");
  }

  // Save message
  const message = await prisma.message.create({
    data: {
      text,
      messageType: attachments && attachments.length > 0 ? attachments[0].type : MessageType.TEXT,
      senderId,
      receiverId,
      attachments: attachments && attachments.length > 0 ? {
        create: attachments.map(a => ({
          url: a.url,
          type: a.type,
          sizeBytes: a.sizeBytes,
          width: a.width,
          height: a.height,
          durationMs: a.durationMs,
        }))
      } : undefined,
    },
    include: {
      attachments: true,
    },
  });
  return message;
}
