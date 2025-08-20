import { prisma } from "../lib/prisma";

export const getMessages = async (userId: string, otherUserId: string, page: number, pageSize: number) => {
  // Only fetch messages between userId and otherUserId (DMs)
  const skip = (page - 1) * pageSize;
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
    include: {
      attachments: true,
    },
  });
  return messages;
};

export const deleteMessage = async (userId: string, messageId: string) => {
  // Only allow deleting if user is sender
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) throw new Error("Message not found");
  if (message.senderId !== userId) throw new Error("Not authorized to delete this message");
  await prisma.message.delete({ where: { id: messageId } });
  return { success: true };
};
