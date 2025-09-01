import { createPaginationBody } from "@/schemas/common.schema";
import z from "zod";

export const SendMessageBodySchema = z.object({
  message: z.string(),
  images: z.array(z.string()),
  toUserId: z.string().optional(),
});

export const FindByUserBodySchema = createPaginationBody(
  z.object({ userId: z.string() })
);
