import { Role } from "@/enums/user.enum";
import { SendMessageBodySchema } from "@/schemas/message.schema";
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
