/* eslint-disable @next/next/no-img-element */
"use client";
import { productApiRequest } from "@/api-requests/product";
import { handleErrorApi } from "@/lib/error";
import { ChevronLeft, ChevronRight, ImagePlus, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function ImageContainer({
  images = [],
  handleAddImage,
  handleRemoveImage,
  handleReplaceImage,
}: {
  images: string[];
  handleAddImage: (url: string) => void;
  handleRemoveImage: (url: string) => void;
  handleReplaceImage: (oldUrl: string, newUrl: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputReplaceImageRef = useRef<HTMLInputElement>(null);
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
  }, [images]);
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
  const [selectedImage, setSelectedImage] = useState(
    images.length ? images[0] : ""
  );
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );
      try {
        const formData = new FormData();
        formData.append("image", imageFiles[0]);
        const uploadRsp = await productApiRequest.uploadImage(formData);
        handleAddImage(uploadRsp.payload.imageUrl);
        setSelectedImage(uploadRsp.payload.imageUrl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    }
  };

  const replaceImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );
      try {
        const formData = new FormData();
        formData.append("image", imageFiles[0]);
        const uploadRsp = await productApiRequest.uploadImage(formData);
        handleReplaceImage(selectedImage, uploadRsp.payload.imageUrl);
        setSelectedImage(uploadRsp.payload.imageUrl);
        // handleAddImage(uploadRsp.payload.imageUrl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    }
  };

  return (
    <div className="p-4 border-2 bg-gray-50 border-gray-200 rounded-md space-y-4">
      <div className="w-full aspect-square overflow-hidden rounded-md bg-gray-200 relative group">
        {/* Ảnh */}
        {selectedImage !== "" && (
          <img
            src={selectedImage}
            alt=""
            className="w-full h-full object-cover border-none"
          />
        )}

        {selectedImage === "" && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <ImagePlus className="stroke-2 w-10 h-10 text-blue-500"/>
          </div>
        )}

        {/* Overlay đen mờ khi hover */}
        {selectedImage && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        )}

        {/* Nút ở giữa */}
        {selectedImage && (
          <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              type="button"
              onClick={() => fileInputReplaceImageRef.current?.click()}
              className="px-3 py-1 bg-white text-black rounded-md text-sm shadow hover:bg-gray-100"
            >
              Replace
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputReplaceImageRef}
              onChange={replaceImage}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => {
                handleRemoveImage(selectedImage);
                if (images.length <= 1) setSelectedImage("");
                else setSelectedImage(images.length ? images[0] : "");
              }}
              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm shadow hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        )}
      </div>
      <div className="relative group">
        <div
          onScroll={checkScrollPosition}
          ref={scrollRef}
          className="flex gap-4 overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {images.map((src, index) => (
            <div
              onClick={() => setSelectedImage(src)}
              key={index}
              className="w-[calc(25%-12px)] cursor-pointer aspect-square overflow-hidden rounded-md bg-gray-100 shrink-0"
            >
              <img
                src={src}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover border-none"
              />
            </div>
          ))}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-[calc(25%-12px)] cursor-pointer aspect-square overflow-hidden rounded-md bg-blue-50 border-2 border-dashed border-blue-200 shrink-0"
          >
            <div className="p-1 rounded-full bg-blue-500">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
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
