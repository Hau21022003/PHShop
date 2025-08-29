import {
  DateFilter,
  ReplyStatus,
  ReviewSearchStatus,
} from "@/enums/review.enum";
import z from "zod";

export const CreateReviewBody = z.object({
  product: z
    .string("Product ID is required")
    .min(1, "Product ID cannot be empty"),
  order: z.string("Order ID is required").min(1, "Order ID cannot be empty"),
  rating: z.number("Rating is required").int().min(1).max(5),
  content: z.string("Content is required").min(1, "Content cannot be empty"),
  images: z.array(z.string()).default([]),
});

export const FindByProductBody = z.object({
  status: z.enum(ReviewSearchStatus),
  productId: z.string(),
});

export const FindAllBodySchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  replyStatus: z.enum(ReplyStatus).optional(),
  search: z.string().optional(),
  dateFilter: z.enum(DateFilter).optional(),
});
