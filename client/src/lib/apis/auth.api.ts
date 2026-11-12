import { httpClient } from "../axios/httpClinet";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  image?: string;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  status?: string;
  emailVerified?: boolean;
}

export interface AuthResponseData {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUserResponse;
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await httpClient.post<{
      success: boolean;
      message: string;
      data: AuthResponseData;
    }>("/auth/login", payload);
    return res;
  },

  register: async (payload: RegisterPayload) => {
    const res = await httpClient.post<{
      success: boolean;
      message: string;
      data: AuthResponseData;
    }>("/auth/register", payload);
    return res;
  },

  getMe: async () => {
    const res = await httpClient.get<{
      success: boolean;
      message: string;
      data: AuthUserResponse;
    }>("/auth/me");
    return res;
  },

  logout: async () => {
    const res = await httpClient.post<{
      success: boolean;
      message: string;
    }>("/auth/logout");
    return res;
  },

  getGoogleLoginUrl: (redirectPath = "/dashboard") => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5007";
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");
    return `${cleanBaseUrl}/api/v1/auth/login/google?redirect=${encodeURIComponent(redirectPath)}`;
  },
};
