import http from "@/lib/http";
import { AccountResType, ContactDetailsType } from "@/schemas/account.schema";

export const userApiRequest = {
  getProfile: () => http.get<AccountResType>("/users/profile"),
  updateContactDetails: (body: ContactDetailsType) =>
    http.put<AccountResType>("/users/contact-details", body),
};
