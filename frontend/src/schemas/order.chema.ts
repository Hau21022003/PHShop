import z from "zod";

export enum StatusOrders {
  PENDING = "PENDING",
  IN_PROCESS = "IN_PROCESS",
  CANCEL = "CANCEL",
  SUCCESS = "SUCCESS",
}

export const ContactDetailsSchema = z.object({
  fullName: z.string().min(1, "fullName is required"),
  phoneNumber: z.string().min(1, "phoneNumber is required"),
  province: z.string().min(1, "province is required"),
  district: z.string().min(1, "district is required"),
  ward: z.string().min(1, "ward is required"),
  address: z.string().min(1, "address is required"),
});

// export const ProductSnapshotSchema = z.object({
//   name: z.string().min(1, "name is required"),
//   image: z.string().optional(),
//   price: z.number().min(0, "price must be >= 0"),
//   discount: z.number().min(0, "discount must be >= 0").optional(),
// });

export const CartItemVariantSchema = z.object({
  title: z.string().min(1, "title is required"),
  option: z.string().min(1, "option is required"),
});

export const OrderItemSchema = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  attributeVariant: z.array(CartItemVariantSchema).optional(),
  quantity: z.number().int().min(1, "quantity must be >= 1"),
  // productSnapshot: ProductSnapshotSchema,
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema),
  // status: z.enum(StatusOrders).optional(),
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
