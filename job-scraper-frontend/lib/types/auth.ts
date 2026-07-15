export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: string;
};

export type User = {
  email: string;
  role: string;
};