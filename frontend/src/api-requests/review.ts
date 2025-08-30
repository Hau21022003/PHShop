import http from "@/lib/http";
import {
  CreateReviewBodyType,
  FindAllBody,
  FindAllRes,
  FindByProductBodyType,
  FindByProductRes,
  ReplyBody,
  Review,
  SummaryReviewType,
  UploadImageResType,
} from "@/types/review.type";

const BASE_URL = "/review";
export const reviewApiRequest = {
  create: (body: CreateReviewBodyType) =>
    http.post<Review>(`${BASE_URL}/`, body),
  uploadImage: (body: FormData) =>
    http.post<UploadImageResType>(`${BASE_URL}/upload`, body),
  findByProduct: (body: FindByProductBodyType) =>
    http.post<FindByProductRes>(`${BASE_URL}/find-by-product`, body),
  findSummaryByProduct: (productId: string) =>
    http.get<{ summary: SummaryReviewType }>(
      `${BASE_URL}/${productId}/find-summary`
    ),
  findAll: (body: FindAllBody) =>
    http.post<FindAllRes>(`${BASE_URL}/find-all`, body),
  reply: (reviewId: string, body: ReplyBody) =>
    http.put<Review>(`${BASE_URL}/${reviewId}/reply`, body),
};
