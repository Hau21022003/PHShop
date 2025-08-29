import { createPaginationBody } from "@/schemas/common.schema";
import z from "zod";

export enum StatusOrders {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCEL = "CANCEL",
}

export const ContactDetailsSchema = z.object({
  fullName: z.string().min(1, "fullName is required"),
  phoneNumber: z.string().min(1, "phoneNumber is required"),
  province: z.string().min(1, "province is required"),
  district: z.string().min(1, "district is required"),
  ward: z.string().min(1, "ward is required"),
  address: z.string().min(1, "address is required"),
});

export const CartItemVariantSchema = z.object({
  title: z.string().min(1, "title is required"),
  option: z.string().min(1, "option is required"),
});

export const OrderItemSchema = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  attributeVariant: z.array(CartItemVariantSchema).optional(),
  quantity: z.number().int().min(1, "quantity must be >= 1"),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema),
  contactDetails: ContactDetailsSchema,
  note: z.string().optional(),
  user: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
});

export type CreateOrderType = z.TypeOf<typeof CreateOrderSchema>;
export type OrderItemType = z.TypeOf<typeof OrderItemSchema>;

export const ShippingFeeSchema = z.object({
  items: z.array(OrderItemSchema),
  wardId: z.string().optional(),
  provinceId: z.string(),
  districtId: z.string(),
});
export type ShippingFeeType = z.TypeOf<typeof ShippingFeeSchema>;

export interface ShippingFeeResType {
  shippingFee: number;
}

export enum DateFilter {
  TODAY = "Today",
  YESTERDAY = "Yesterday",
  LAST_7_DAYS = "Last 7 days",
  LAST_30_DAYS = "Last 30 days",
  THIS_MONTH = "This month",
  LAST_MONTH = "Last month",
  THIS_YEAR = "This year",
  LAST_YEAR = "Last year",
  ALL_TIME = "All time",
}

export const FindAllBody = createPaginationBody(
  z.object({
    dateFilter: z.enum(DateFilter),
    search: z.string().optional(),
    status: z.enum(StatusOrders).optional(),
  })
);
export type FindAllBodyType = z.TypeOf<typeof FindAllBody>;

export const OrderRes = z.object({
  _id: z.string(),
  code: z.string(),
  items: z.array(
    z.object({
      product: z.string(),
      attributeVariant: z.array(CartItemVariantSchema).optional(),
      quantity: z.number().int(),
      productSnapshot: z.object({
        name: z.string(),
        image: z.string(),
        price: z.number(),
        discount: z.number().optional(),
      }),
      isReviewed: z.boolean().optional(),
    })
  ),
  contactDetails: ContactDetailsSchema,
  note: z.string().optional(),
  status: z.enum(StatusOrders),
  deliveryPrice: z.number(),
  totalAmount: z.number(),
  user: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  statusHistory: z
    .array(z.object({ status: StatusOrders, changedAt: z.string() }))
    .optional(),
  // isReviewed: z.boolean().optional(),
});
export type OrderResType = z.TypeOf<typeof OrderRes>;

export const SummaryRes = z.record(z.enum(StatusOrders), z.number());
export type SummaryResType = z.TypeOf<typeof SummaryRes>;

export const FindAllRes = z.object({
  total: z.number(),
  items: z.array(OrderRes),
  summary: SummaryRes,
});
export type FindAllResType = z.TypeOf<typeof FindAllRes>;

export const searchOrderBody = z.object({
  code: z.string().min(1, {
    message: "Code cannot be empty",
  }),
  phoneNumber: z.string().min(1, {
    message: "Phone number cannot be empty",
  }),
});
