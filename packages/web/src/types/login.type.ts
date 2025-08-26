import { User } from "./user.type";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  token: string;
  refreshToken: string;
};