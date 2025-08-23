import { AccountSchema } from "@/schemas/account.schema";
import z from "zod";

export const RegisterBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(1, {
      message: "Password cannot be empty",
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm password cannot be empty",
    }),
  })
  .superRefine((data, ctx) => {
    const pwd = data.password;

    if (pwd.length < 8) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Must be at least 8 characters",
      });
    }

    if (!/[A-Z]/.test(pwd)) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one uppercase letter",
      });
    }

    if (!/[0-9]/.test(pwd)) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one number",
      });
    }

    if (!/[^A-Za-z0-9]/.test(pwd)) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one special character",
      });
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
      });
    }
  });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
  accessToken: z.string(),
  accessTokenExpiresAt: z.string(),
  refreshToken: z.string(),
  refreshTokenExpiresAt: z.string(),
  account: AccountSchema,
});
export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(1, {
      message: "Password cannot be empty",
    }),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = RegisterRes;

export type LoginResType = z.TypeOf<typeof LoginRes>;
export const SlideSessionBody = z.object({}).strict();

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;
export const SlideSessionRes = RegisterRes;

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;
