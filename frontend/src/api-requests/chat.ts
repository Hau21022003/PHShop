import http from "@/lib/http";
import { PaginationBodyType } from "@/schemas/common.schema";
import { FindByUserBody, Message, UploadImageRes } from "@/types/chat.type";
import { PaginatedResponse } from "@/types/common.type";

const BASE_URL = "/chat";
export const chatApiRequest = {
  uploadImage: (body: FormData) =>
    http.post<UploadImageRes>(`${BASE_URL}/upload`, body),
  findMine: (body: PaginationBodyType) =>
    http.post<PaginatedResponse<Message>>(`${BASE_URL}/my`, body),
  findByUserId: (body: FindByUserBody) =>
    http.post<PaginatedResponse<Message>>(`${BASE_URL}/by-user`, body),
};
