import http from "@/lib/http";
import { AddCategoryBodyType, CategoryType } from "@/schemas/category.schema";

export const categoryApiRequest = {
  findAll: () => http.get<CategoryType[]>("/category"),
  add: (body: AddCategoryBodyType) =>
    http.post<CategoryType>("/category", body),
};
