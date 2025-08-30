import { ReplyStatus } from "@/enums/review.enum";
import { ProductResType } from "@/schemas/product.schema";
import {
  CreateReviewBody,
  FindAllBodySchema,
  FindByProductBody,
  ReplyBodySchema,
} from "@/schemas/review.schema";
import z from "zod";

export type CreateReviewBodyType = z.TypeOf<typeof CreateReviewBody>;

export type Review = {
  _id: string;
  product: string;
  order: string;
  user: string;
  rating: number;
  content: string;
  images: string[];
  shopReply?: string;
  shopReplyAt?: string;
  createdAt: string;
  userSnapshot: { fullName: string };
};

export type UploadImageResType = {
  imageUrl: string;
};

export type FindByProductBodyType = z.TypeOf<typeof FindByProductBody>;
export type SummaryReviewType = Record<number, number>;
export type FindByProductRes = {
  items: Review[];
  summary: SummaryReviewType;
};

export type ReviewWithProduct = Review & {
  product: ProductResType;
};

export type FindAllBody = z.TypeOf<typeof FindAllBodySchema>;
export type ReplyStatusSummary = Record<ReplyStatus, number>;
export type FindAllRes = {
  items: ReviewWithProduct[];
  replyStatusSummary: ReplyStatusSummary;
  total: number;
};

export type ReplyBody = z.TypeOf<typeof ReplyBodySchema>;
