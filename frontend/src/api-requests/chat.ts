import http from "@/lib/http";
import { UploadImageRes } from "@/types/chat.type";

const BASE_URL = "/chat";
export const chatApiRequest = {
  uploadImage: (body: FormData) =>
    http.post<UploadImageRes>(`${BASE_URL}/upload`, body),
};
