import { createBaseResp } from "@/schemas/common.schema";
import z from "zod";

export const AccountSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  avatar: z.string().nullable(),
  email: z.string(),
  role: z.enum(["admin", "user"]),
  isActive: z.boolean(),
  createdAt: z.date(),
});
export const AccountRes = createBaseResp(AccountSchema);
export type AccountResType = z.TypeOf<typeof AccountRes>;
export type AccountType = z.TypeOf<typeof AccountSchema>;

export const UpdateMeBody = z.object({
  name: z.string().trim().min(2).max(256),
});

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;
