import { User } from "@/types/user.type";

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};

