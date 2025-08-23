export interface CheckoutPayload {
  product: string;
  quantity: number;
  attributes?: { option: string; title: string }[];
}
