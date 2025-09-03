import http from "@/lib/http";
import { PaginationBodyType } from "@/schemas/common.schema";
import {
  CountUnreadMessages,
  FindByUserBody,
  Message,
  UploadImageRes,
  Conversation,
} from "@/types/chat.type";
import { PaginatedResponse } from "@/types/common.type";

const BASE_URL = "/chat";
export const chatApiRequest = {
  uploadImage: (body: FormData) =>
    http.post<UploadImageRes>(`${BASE_URL}/upload`, body),
  findMine: (body: PaginationBodyType) =>
    http.post<PaginatedResponse<Message>>(`${BASE_URL}/my`, body),
  findByUserId: (body: FindByUserBody) =>
    http.post<PaginatedResponse<Message>>(`${BASE_URL}/by-user`, body),
  markAllAdminMessagesRead: () => http.get(`${BASE_URL}/read-all/admin`),
  markAllUserMessagesRead: (userId: string) =>
    http.get(`${BASE_URL}/read-all/user/${userId}`),
  getConversations: () => http.get<Conversation[]>(`${BASE_URL}/conversations`),
  countUserUnreadMessages: () =>
    http.get<CountUnreadMessages>(`${BASE_URL}/unread-count/user`),
  countAdminUnreadMessages: () =>
    http.get<CountUnreadMessages>(`${BASE_URL}/unread-count/admin`),
};
