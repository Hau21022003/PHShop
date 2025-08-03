import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  SlideSessionResType,
} from "@/schemas/auth.schema";
import { BaseResType } from "@/schemas/common.schema";

const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>("/auth/signin", body),
  register: (body: RegisterBodyType) =>
    http.post("/auth/signup", body),
  forgotPassword: (email: string) =>
    http.get<BaseResType>(`/auth/forgot-password/${email}`),
  verifyEmail: (token: string) =>
    http.get(`/auth/verify-email/${token}`),
  auth: (body: {
    sessionToken: string;
    expiresAt: string;
    role: "admin" | "user";
  }) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post<BaseResType>(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    http.post<BaseResType>(
      "/api/auth/logout",
      {
        force,
      },
      {
        baseUrl: "",
        signal,
      }
    ),
  slideSessionFromNextServerToServer: (sessionToken: string) =>
    http.post<SlideSessionResType>(
      "/auth/slide-session",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  slideSessionFromNextClientToNextServer: () =>
    http.post<SlideSessionResType>(
      "/api/auth/slide-session",
      {},
      { baseUrl: "" }
    ),
};

export default authApiRequest;
