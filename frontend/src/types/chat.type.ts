import { Role } from "@/enums/user.enum";
import {
  FindByUserBodySchema,
  SendMessageBodySchema,
} from "@/schemas/chat.schema";
import z from "zod";

export type Message = {
  _id: string;
  user: string;
  message: string;
  images: string[];
  fromRole: Role;
  isRead: boolean;
  createdAt: string;
};
export type SendMessageBody = z.TypeOf<typeof SendMessageBodySchema>;

export type UploadImageRes = {
  imageUrl: string;
};

export type FindByUserBody = z.TypeOf<typeof FindByUserBodySchema>;
