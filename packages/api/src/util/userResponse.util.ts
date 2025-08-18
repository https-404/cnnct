import { User } from "@prisma/client";

export const serializeUserResponse = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture || null,
    phoneNumber: user.phoneNumber || null,
  };
};