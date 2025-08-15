import { ProductDetailType } from "@/schemas/product.schema";
import React from "react";
interface DescriptionContainerProps {
  product?: ProductDetailType;
}
export default function DescriptionContainer({
  product,
}: DescriptionContainerProps) {
  return (
    <div>
      <div
        className="prose prose-sm max-w-none
        [&_p]:my-2
        [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-2
        [&_strong]:font-bold
        [&_em]:italic
        [&_ul]:list-disc [&_ul]:pl-6
        [&_ol]:list-decimal [&_ol]:pl-6
        [&_li]:my-1"
        dangerouslySetInnerHTML={{ __html: product?.description || "" }}
      />
    </div>
  );
}
