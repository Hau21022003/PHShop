import z from "zod";

export const CategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  productQuantity: z.number(),
  active: z.boolean(),
  createdAt: z.string(),
});
export type CategoryType = z.TypeOf<typeof CategorySchema>;

export const AddCategoryBody = z.object({
  name: z.string().min(0, "Category name not empty"),
  active: z.boolean().default(true),
});
export type AddCategoryBodyType = z.TypeOf<typeof AddCategoryBody>;

export const EditCategoryBody = AddCategoryBody;
export type UpdateCategoryBodyType = z.TypeOf<typeof EditCategoryBody>;

export const FindAllBody = z.object({
  search: z.string(),
  status: z.enum(["all", "active", "deactive"]).default("all"),
});
export type FindAllBodyType = z.TypeOf<typeof FindAllBody>;
