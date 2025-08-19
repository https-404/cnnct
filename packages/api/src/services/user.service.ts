import { serializeUserResponse } from "../util/userResponse.util";
import { prisma } from "../lib/prisma";
import { putBuffer } from "../lib/minio";
import { compressImage } from "../util/compressImage";

type MulterFile = Express.Multer.File;

export const uploadProfilePicture = async (userId: string, file: MulterFile) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!file) {
    throw new Error("No file uploaded");
  }

  const compressedBuffer = await compressImage(file.buffer);

  const imageUrl = await putBuffer(file.originalname, compressedBuffer, file.mimetype);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { profilePicture: imageUrl },
  });

  return serializeUserResponse(user);
};
