export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("access_token");
};

export const setAccessToken = (token: string): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("access_token", token);
};

 const removeAccessToken = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("access_token");
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("refresh_token");
};

export const setRefreshToken = (token: string): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("refresh_token", token);
};

 const removeRefreshToken = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("refresh_token");
};

export const clearTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
};
