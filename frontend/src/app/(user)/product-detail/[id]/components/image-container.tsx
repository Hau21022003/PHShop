/* eslint-disable @next/next/no-img-element */
"use client";
import { useProductDetailContext } from "@/app/(user)/product-detail/[id]/product-detail-provider";
import { ProductDetailType } from "@/schemas/product.schema";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface ImageContainerProps {
  product?: ProductDetailType;
}
export default function ImageContainer({ product }: ImageContainerProps) {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { selectedImage, setSelectedImage } = useProductDetailContext();
  useEffect(() => {
    if (!product) return;
    if (product.images.length > 0) setSelectedImage(product?.images[0]);
  }, [product]);

  const checkScrollPosition = () => {
    const container = scrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 1); // -1 để tránh lỗi làm tròn
    }
  };

  useEffect(() => {
    checkScrollPosition();
  }, [product?.images]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth / 4 + 4;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
    setTimeout(checkScrollPosition, 100);
  };
  return (
    <div className="space-y-4">
      <div className="w-full aspect-square overflow-hidden bg-gray-200 relative group">
        {/* Ảnh */}
        {selectedImage && (
          <img
            src={selectedImage}
            alt=""
            className="w-full h-full object-cover border-none"
          />
        )}
      </div>
      <div className="relative group">
        <div
          onScroll={checkScrollPosition}
          ref={scrollRef}
          className="flex gap-4 overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {product?.images.map((src, index) => (
            <div
              onMouseEnter={() => setSelectedImage(src)}
              onClick={() => setSelectedImage(src)}
              key={index}
              className="w-[calc(25%-12px)] cursor-pointer aspect-square overflow-hidden bg-gray-100 shrink-0"
            >
              <img
                src={src}
                alt={`Image ${index + 1}`}
                className="w-full h-full border-none object-contain bg-white hover:opacity-90"
              />
            </div>
          ))}
        </div>
        {showLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
            aria-label="Previous images"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
        )}

        {showRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
            aria-label="Next images"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
}
