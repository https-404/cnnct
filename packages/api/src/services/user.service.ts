import { serializeUserResponse } from "../util/userResponse.util";
import { prisma } from "../lib/prisma";
import { putBuffer } from "../lib/minio";
import { backendStorageUrl } from "../util/backendStorageUrl";
import { compressImage } from "../util/compressImage";
import { randomUUID } from "crypto";
import path from "path";

type MulterFile = Express.Multer.File;

export const uploadProfilePicture = async (userId: string, file: MulterFile) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!file) {
    throw new Error("No file uploaded");
  }


  const compressedBuffer = await compressImage(file.buffer);

  // Extract extension from original filename
  const ext = path.extname(file.originalname) || '';
  // Generate a new unique filename with the original extension
  const uniqueName = randomUUID() + ext;

  await putBuffer(uniqueName, compressedBuffer, file.mimetype);
  const imageUrl = backendStorageUrl(uniqueName);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { profilePicture: imageUrl },
  });

  // Optionally, return the extension as well
  return {
    ...serializeUserResponse(user),
    profilePictureExtension: ext
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  return serializeUserResponse(user);
};

export const updateCurrentUser = async (userId: string, data: Partial<{ username: string; email: string; phoneNumber: string; profilePicture: string; }>) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      username: data.username,
      email: data.email,
      phoneNumber: data.phoneNumber,
      profilePicture: data.profilePicture,
    },
  });
  return serializeUserResponse(user);
};

export const searchUsers = async (userId: string, query: string, limit: number = 20) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.trim().toLowerCase();

  // Get current user's friend IDs to exclude them
  const userFriends = await prisma.friend.findMany({
    where: { userId },
    select: { friendId: true },
  });
  const friendIds = userFriends.map(f => f.friendId);

  // Search users by username or email (excluding current user and friends)
  const users = await prisma.user.findMany({
    where: {
      AND: [
        {
          NOT: { id: userId },
        },
        {
          NOT: { id: { in: friendIds } },
        },
        {
          OR: [
            { username: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      ],
    },
    take: limit,
    orderBy: { username: 'asc' },
  });

  return users.map(user => serializeUserResponse(user));
};