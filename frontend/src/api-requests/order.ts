import http from "@/lib/http";
import {
  CreateOrderType,
  ShippingFeeResType,
  ShippingFeeType,
} from "@/schemas/order.chema";

const BASE_URL = "/orders";
export const orderApiRequest = {
  calcShippingFee: (body: ShippingFeeType) =>
    http.post<ShippingFeeResType>(`${BASE_URL}/shipping-fee`, body),
  createOrder: (body: CreateOrderType) => http.post(`${BASE_URL}`, body),
};
