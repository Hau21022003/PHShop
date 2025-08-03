import http from "@/lib/http";
import { AccountResType } from "@/schemas/account.schema";

export const userApiRequest = {
  getProfile: () => http.get<AccountResType>("/users/profile"),
};
