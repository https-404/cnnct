import { prisma } from "../lib/prisma";
import { serializeUserResponse } from "../util/userResponse.util";

export const listFriends = async (userId: string) => {
  const friends = await prisma.friend.findMany({
    where: { userId },
    include: { friend: true },
    orderBy: { createdAt: 'desc' },
  });
  return friends.map(f => serializeUserResponse(f.friend));
};

export const removeFriend = async (userId: string, friendId: string) => {
  // Remove both directions
  await prisma.friend.deleteMany({
    where: {
      OR: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    },
  });
  return { success: true };
};
