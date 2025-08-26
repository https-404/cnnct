import { getRefreshToken, setAccessToken, setRefreshToken } from "../token";
import api from "./baseAxios.service";

const refreshToken = async (): Promise<string> => {
  const response = await api.post("/auth/refresh", {
    token: getRefreshToken(),
  });
   if(response.data?.token) {
    setAccessToken(response.data.access_token);
    setRefreshToken(response.data.refresh_token);
   }
   throw new Error("Failed to refresh token");
};

export default refreshToken;