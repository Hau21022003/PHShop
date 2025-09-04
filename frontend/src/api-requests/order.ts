import http from "@/lib/http";
import {
  CreateOrderType,
  FindAllBodyType,
  FindAllResType,
  OrderResType,
  ShippingFeeResType,
  ShippingFeeType,
} from "@/schemas/order.schema";
import {
  CheckStockResType,
  CountOrders,
  OrderDayStat,
  SearchOrderBodyType,
} from "@/types/order.type";

const BASE_URL = "/orders";
export const orderApiRequest = {
  calcShippingFee: (body: ShippingFeeType) =>
    http.post<ShippingFeeResType>(`${BASE_URL}/shipping-fee`, body),
  createOrder: (body: CreateOrderType) =>
    http.post<OrderResType>(`${BASE_URL}`, body),
  findOne: (orderId: string) =>
    http.get<OrderResType>(`${BASE_URL}/${orderId}`),
  findAll: (body: FindAllBodyType) =>
    http.post<FindAllResType>(`${BASE_URL}/find-all`, body),
  checkStock: (orderId: string) =>
    http.get<CheckStockResType>(`${BASE_URL}/${orderId}/check-stock`),
  confirmOrder: (orderId: string) => http.get(`${BASE_URL}/${orderId}/confirm`),
  shipOrder: (orderId: string) => http.get(`${BASE_URL}/${orderId}/ship`),
  deliverOrder: (orderId: string) => http.get(`${BASE_URL}/${orderId}/deliver`),
  cancelOrder: (orderId: string) => http.get(`${BASE_URL}/${orderId}/cancel`),
  remove: (orderId: string) => http.delete(`${BASE_URL}/${orderId}`),
  export: (body: FindAllBodyType) =>
    http.post<Blob>(`${BASE_URL}/export`, body, { responseType: "blob" }),
  downloadInvoice: (orderId: string) =>
    http.get<Blob>(`${BASE_URL}/${orderId}/pdf`, { responseType: "blob" }),
  searchOrder: (body: SearchOrderBodyType) =>
    http.post<OrderResType>(`${BASE_URL}/search-order`, body),
  cancelOrderByUser: (orderId: string) =>
    http.get(`${BASE_URL}/${orderId}/cancel-by-user`),
  getRecentOrderDays: () =>
    http.get<OrderDayStat[]>(`${BASE_URL}/recent-order-days`),
  countOrders: () => http.get<CountOrders>(`${BASE_URL}/count`),
};
