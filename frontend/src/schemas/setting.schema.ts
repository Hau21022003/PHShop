import z from "zod";

export enum SettingKey {
  FREE_SHIPPING = "free_shipping",
  DEFAULT_SHIPPING_FEE = "default_shipping_fee",
}

export const SettingItemBody = z.discriminatedUnion("key", [
  z.object({
    key: z.literal(SettingKey.FREE_SHIPPING),
    value: z
      .number("Free shipping threshold must be a number")
      .min(0, { message: "Free shipping threshold cannot be negative" }),
  }),
  z.object({
    key: z.literal(SettingKey.DEFAULT_SHIPPING_FEE),
    value: z
      .number("Default shipping fee must be a number")
      .min(0, { message: "Default shipping fee cannot be negative" }),
  }),
]);
export type SettingItemType = z.TypeOf<typeof SettingItemBody>;
