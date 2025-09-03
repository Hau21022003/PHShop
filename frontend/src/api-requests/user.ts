import http from "@/lib/http";
import {
  AccountResType,
  AccountType,
  ContactDetailsType,
} from "@/schemas/account.schema";

const BASE_URL = "/users";
export const userApiRequest = {
  getProfile: () => http.get<AccountResType>("/users/profile"),
  updateContactDetails: (body: ContactDetailsType) =>
    http.put<AccountResType>("/users/contact-details", body),
  findOne: (userId: string) => http.get<AccountType>(`${BASE_URL}/${userId}`),
};
