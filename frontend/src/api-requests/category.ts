import http from "@/lib/http";
import {
  AddCategoryBodyType,
  CategoryType,
  FindAllBodyType,
  UpdateCategoryBodyType,
} from "@/schemas/category.schema";

export const categoryApiRequest = {
  findAll: (body?: FindAllBodyType) =>
    http.post<CategoryType[]>("/category/find-all", body || {}),
  add: (body: AddCategoryBodyType) =>
    http.post<CategoryType>("/category", body),
  update: (id: string, body: UpdateCategoryBodyType) =>
    http.put<CategoryType>(`/category/${id}`, body),
  delete: (id: string) => http.delete(`/category/${id}`),
};
