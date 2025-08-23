import z from "zod";

export const ProvinceSchema = z.object({
  idProvince: z.string(),
  name: z.string(),
});
export type ProvinceType = z.TypeOf<typeof ProvinceSchema>;

export const DistrictSchema = z.object({
  idProvince: z.string(),
  idDistrict: z.string(),
  name: z.string(),
});
export type DistrictType = z.TypeOf<typeof DistrictSchema>;

export const WardSchema = z.object({
  idCommune: z.string(),
  idDistrict: z.string(),
  name: z.string(),
});
export type WardType = z.TypeOf<typeof WardSchema>;
