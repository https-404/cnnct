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
      sender: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        }
      }
    },
  });
  return message;
}

export async function sendGroupMessage({
  senderId,
  groupId,
  text,
  attachments
}: {
  senderId: string;
  groupId: string;
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
  // Check if user is member of the group
  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: senderId,
        groupId: groupId,
      }
    }
  });

  if (!membership) {
    throw new Error("You are not a member of this group");
  }

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
      groupId,
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
      sender: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        }
      }
    },
  });

  // Get all group members to emit to
  const groupMembers = await prisma.groupMember.findMany({
    where: { groupId },
    select: { userId: true }
  });

  return {
    message,
    groupMemberIds: groupMembers.map(m => m.userId)
  };
}
