import { productApiRequest } from "@/api-requests/product";
import { handleErrorApi } from "@/lib/error";
import { ProductResType } from "@/schemas/product.schema";
import { useEffect, useState } from "react";

export function useTopSaleProduct() {
  const [topSaleProduct, setTopSaleProduct] = useState<ProductResType>();
  useEffect(() => {
    const fetTopSaleProduct = async () => {
      try {
        const product = (await productApiRequest.getTopSale()).payload;
        setTopSaleProduct(product);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    };
    fetTopSaleProduct();
  }, []);
  return { topSaleProduct };
}
