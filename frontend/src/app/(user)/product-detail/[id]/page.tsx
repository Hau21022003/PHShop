"use client";
import { productApiRequest } from "@/api-requests/product";
import DescriptionContainer from "@/app/(user)/product-detail/[id]/components/description-container";
import ImageContainer from "@/app/(user)/product-detail/[id]/components/image-container";
import ProductDetail from "@/app/(user)/product-detail/[id]/components/product-detail";
import ReviewsContainer from "@/app/(user)/product-detail/[id]/components/reviews-container";
import ProductDetailProvider from "@/app/(user)/product-detail/[id]/product-detail-provider";
import { showLoading, closeLoading } from "@/components/loading-overlay";
import { handleErrorApi } from "@/lib/error";
import { ProductDetailType } from "@/schemas/product.schema";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams<{ id: string | undefined }>();
  const [product, setProduct] = useState<ProductDetailType>();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const loadProduct = async () => {
    showLoading();
    const productId = params.id;
    try {
      const findOneRsp = await productApiRequest.getProductDetail(
        productId || ""
      );
      const product = findOneRsp.payload;
      setProduct(product);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    loadProduct();
  }, [params]);
  return (
    <div className="container max-w-[1200px] mx-auto px-6 py-6">
      <div className="flex items-start flex-col gap-2 lg:flex-row lg:gap-10">
        <ProductDetailProvider>
          <div className="w-full lg:flex-2">
            <ImageContainer product={product} />
          </div>
          <div className="w-full lg:flex-3">
            <ProductDetail product={product} />
          </div>
        </ProductDetailProvider>
      </div>
      {/* Reviews - Details Buttons*/}
      <div className="mt-8 flex gap-10 items-center">
        <div
          onClick={() => {
            setIsDescriptionOpen(true);
            setIsReviewsOpen(false);
          }}
          className={`${
            isDescriptionOpen ? "text-black" : "text-gray-400"
          } cursor-pointer font-medium text-2xl hover:underline hover:underline-offset-4`}
        >
          Details
        </div>
        <div
          onClick={() => {
            setIsDescriptionOpen(false);
            setIsReviewsOpen(true);
          }}
          className={`${
            isReviewsOpen ? "text-black" : "text-gray-400"
          } cursor-pointer font-medium text-2xl hover:underline hover:underline-offset-4`}
        >
          Reviews
        </div>
      </div>

      {/*  */}
      <div className="mt-8">
        {isDescriptionOpen && <DescriptionContainer product={product} />}
        {isReviewsOpen && (
          <ReviewsContainer open={isReviewsOpen} product={product} />
        )}
      </div>
    </div>
  );
}
