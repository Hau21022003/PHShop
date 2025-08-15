import { CategorySchema } from "@/schemas/category.schema";
import {
  createPaginationBody,
  createPaginationRes,
} from "@/schemas/common.schema";
import z from "zod";
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNISEX = "UNISEX",
}
export const ProductBody = z.object({
  name: z.string().min(1, "Product name not empty"),
  description: z.string().optional(),
  gender: z.enum(Gender),
  images: z.array(z.string()),
  price: z
    .number("Price must be a number")
    .int()
    .min(0, "Price must be at least 0"),
  discount: z
    .number("Discount must be a number")
    .min(0, "Discount must be at least 0%")
    .max(100, "Discount cannot exceed 100%")
    .optional(),
  quantity: z
    .number("Quantity must be a number")
    .int("Quantity must be an integer")
    .min(0, "Quantity must be at least 0"),
  category: z.string().optional(),
  variantStructure: z.array(
    z.object({
      title: z.string().min(1, "Title not empty"),
      enableImage: z.boolean().optional(),
      options: z.array(
        z.object({
          option: z.string().min(1, "Option not empty"),
          image: z.string().optional(),
        })
      ),
    })
  ),
  variants: z
    .array(
      z.object({
        attributes: z.array(
          z.object({
            title: z.string(),
            option: z.string(),
          })
        ),
        image: z.string().optional(),
        price: z
          .number("Price must be a number")
          .int("Price must be an integer")
          .min(0, "Price must be at least 0"),
        quantity: z
          .number("Quantity must be a number")
          .int("Quantity must be an integer")
          .min(0, "Quantity must be at least 0"),
      })
    )
    .optional(),
});

export const StockBody = z.object({ variants: ProductBody.shape.variants });
export type StockBodyType = z.TypeOf<typeof StockBody>;

export type ProductBodyType = z.TypeOf<typeof ProductBody>;

export const UploadImageRes = z.object({ imageUrl: z.string() });
export type UploadImageResType = z.TypeOf<typeof UploadImageRes>;

export const ProductRes = ProductBody.extend({ _id: z.string() });
export type ProductResType = z.TypeOf<typeof ProductRes>;

export const ProductWithCategory = ProductBody.extend({
  _id: z.string(),
  category: CategorySchema.optional(),
  sold: z.number(),
  active: z.boolean(),
});

export type ProductWithCategoryType = z.TypeOf<typeof ProductWithCategory>;
export const FindAllProduct = createPaginationRes(ProductWithCategory);
export type FindAllProductType = z.TypeOf<typeof FindAllProduct>;

export enum PriceFilter {
  BELOW_200K = "BELOW_200K",
  FROM_200K_TO_400K = "FROM_200K_TO_400K",
  FROM_400K_TO_600K = "FROM_400K_TO_600K",
  FROM_600K_TO_800K = "FROM_600K_TO_800K",
  ABOVE_800K = "ABOVE_800K",
}

export enum SortBy {
  FEATURED = "FEATURED",
  NEWEST = "NEWEST",
  PRICE_LOW_TO_HIGH = "PRICE_LOW_TO_HIGH",
  PRICE_HIGH_TO_LOW = "PRICE_HIGH_TO_LOW",
}

export const Filter = z.object({
  gender: z.enum(Gender).optional(),
  categoryIds: z.array(z.string()),
  price: z.array(z.enum(PriceFilter)),
  sortBy: z.enum(SortBy).optional(),
  sale: z.boolean().optional(),
});
export type FilterType = z.TypeOf<typeof Filter>;

export const FindAllBody = createPaginationBody(
  z.object({ search: z.string().optional(), filter: Filter.optional() })
);
export type FindAllBodyType = z.TypeOf<typeof FindAllBody>;

export const ProductDetail = ProductWithCategory;
export type ProductDetailType = z.TypeOf<typeof ProductDetail>;
