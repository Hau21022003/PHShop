import http from "@/lib/http";
import {
  FindAllBodyType,
  FindAllProductType,
  ProductBodyType,
  ProductDetailType,
  ProductResType,
  ProductWithCategoryType,
  StockBodyType,
  UploadImageResType,
} from "@/schemas/product.schema";

export const productApiRequest = {
  uploadImage: (body: FormData) =>
    http.post<UploadImageResType>("/product/upload", body),
  add: (body: ProductBodyType) => http.post("/product", body),
  update: (id: string, body: ProductBodyType) =>
    http.put(`/product/${id}`, body),
  findOne: (id: string) => http.get<ProductResType>(`/product/${id}`),
  findAll: (body: FindAllBodyType) =>
    http.post<FindAllProductType>("/product/find-all", body),
  export: (body: FindAllBodyType) =>
    http.post<Blob>("/product/export", body, { responseType: "blob" }),
  updateActive: (id: string, active: boolean) =>
    http.put(`/product/${id}/active`, { active }),
  updateStock: (id: string, body: StockBodyType) =>
    http.put(`/product/${id}/stock`, body),
  getProductDetail: (id: string) =>
    http.get<ProductDetailType>(`/product/${id}/product-detail`),
};
