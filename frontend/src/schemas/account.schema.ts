import { Role } from "@/enums/user.enum";
import z from "zod";

export const ContactDetailsSchema = z.object({
  fullName: z.string().min(1, "fullName is required"),
  phoneNumber: z.string().min(1, "phoneNumber is required"),
  province: z.string().min(1, "province is required"),
  district: z.string().min(1, "district is required"),
  ward: z.string().min(1, "ward is required"),
  address: z.string().min(1, "address is required"),
});

export type ContactDetailsType = z.TypeOf<typeof ContactDetailsSchema>;

export const AccountSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  avatar: z.string().nullable(),
  email: z.string(),
  role: z.enum(Role),
  isActive: z.boolean(),
  createdAt: z.date(),
  contactDetails: ContactDetailsSchema.optional(),
});
export const AccountRes = AccountSchema;
export type AccountResType = z.TypeOf<typeof AccountRes>;
export type AccountType = z.TypeOf<typeof AccountSchema>;

export const UpdateMeBody = z.object({
  name: z.string().trim().min(2).max(256),
});

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;
