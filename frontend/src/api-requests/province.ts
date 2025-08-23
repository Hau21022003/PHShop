import http from "@/lib/http";
import {
  DistrictType,
  ProvinceType,
  WardType,
} from "@/schemas/province.schema";

const PROVINCE_BASE = "/province";
export const provinceApiRequest = {
  getProvinces: () => http.get<ProvinceType[]>(`${PROVINCE_BASE}`),
  getDistrict: (provinceId: string) =>
    http.get<DistrictType[]>(`${PROVINCE_BASE}/${provinceId}/districts`),
  getWards: (districtId: string) =>
    http.get<WardType[]>(`${PROVINCE_BASE}/district/${districtId}/wards`),
};
