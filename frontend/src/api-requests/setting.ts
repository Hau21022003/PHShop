import http from "@/lib/http";
import { SettingItemType, SettingKey } from "@/schemas/setting.schema";

export const settingApiRequest = {
  set: (body: SettingItemType) => http.post("/settings", body),
  // get: (key: string) => http.get<SettingItemType>(`/settings/${key}`),
  get: async <K extends SettingKey>(key: K) => {
    return http.get<Extract<SettingItemType, { key: K }>>(`/settings/${key}`);
  },
};
