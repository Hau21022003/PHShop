import { ProductRes } from "@/schemas/product.schema";
import { z } from "zod";

// const AttributeVariantSchema = z.object({})

export const CartItemBody = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product id"), // MongoId
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  attributeVariant: z
    .array(
      z.object({
        title: z.string().min(1, "Variant title is required"),
        option: z.string().min(1, "Variant option is required"),
      })
    )
    .optional(),
  snapshot: z.object({
    name: z.string().min(1, "Product name is required"),
    image: z.string(),
    price: z.number().positive("Price must be greater than 0"),
    discount: z.number().optional(),
  }),
});
export type CartItemBodyType = z.TypeOf<typeof CartItemBody>;

export const CartItemRes = CartItemBody.extend({
  _id: z.string(),
  product: ProductRes.optional(),
});
export type CartItemResType = z.TypeOf<typeof CartItemRes>;

export type UpdateCartItemType = Partial<CartItemBodyType>;
