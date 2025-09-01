import z from "zod";

export const SendMessageBodySchema = z.object({
  message: z.string(),
  images: z.array(z.string()),
  toUserId: z.string().optional(),
});
