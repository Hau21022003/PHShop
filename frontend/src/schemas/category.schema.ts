import z from "zod";

export const CategorySchema = z.object({ _id: z.string(), name: z.string() });
export type CategoryType = z.TypeOf<typeof CategorySchema>;

export const AddCategoryBody = z.object({
  name: z.string().min(0, "Category name not empty"),
});
export type AddCategoryBodyType = z.TypeOf<typeof AddCategoryBody>;
