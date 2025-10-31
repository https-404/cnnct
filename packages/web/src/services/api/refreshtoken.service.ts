import { getRefreshToken, setAccessToken, setRefreshToken } from "../token";
import api from "./baseAxios.service";
import { ApiResponse } from "@/types/api-response.type";

type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

const refreshToken = async (): Promise<void> => {
  const refreshTokenValue = getRefreshToken();
  if (!refreshTokenValue) {
    throw new Error("No refresh token available");
  }

  const response = await api.post<ApiResponse<RefreshTokenResponse>>("/auth/refresh", {
    refreshToken: refreshTokenValue,
  });
  
  if (response.data?.data) {
    setAccessToken(response.data.data.accessToken);
    setRefreshToken(response.data.data.refreshToken);
    return;
  }
  
  throw new Error("Failed to refresh token");
};

export default refreshToken;