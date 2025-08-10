/* eslint-disable @next/next/no-img-element */
"use client";
import { productApiRequest } from "@/api-requests/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleErrorApi } from "@/lib/error";
import { ProductBodyType } from "@/schemas/product.schema";
import { ImagePlus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
interface AddImageVariantProps {
  form: UseFormReturn<ProductBodyType>;
  open: boolean;
  onClose: () => void;
  variantIndex: number;
}
export default function AddImageVariantDialog({
  form,
  onClose,
  open,
  variantIndex,
}: AddImageVariantProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { control, watch, setValue } = form;
  const images = useWatch({ control, name: "images" });
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  useEffect(() => {
    if (variantIndex >= 0) {
      setSelectedImage(watch(`variants.${variantIndex}.image`));
    }
  }, [variantIndex, watch]);
  const handleSelectImage = (src: string) => {
    setSelectedImage(src);
    // Nếu muốn cập nhật vào form hoặc xử lý upload thì gọi hàm ở đây
    // form.setValue(`images[${variantIndex}]`, src);
  };

  const saveVariantImage = () => {
    setValue(`variants.${variantIndex}.image`, selectedImage);
    onClose();
  };

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
        setSelectedImage(uploadRsp.payload.imageUrl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Chose variant image</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="font-medium text-sm text-gray-500">Product images</p>
          {/* Product images */}
          <div className="bg-gray-100 flex flex-wrap gap-4 p-4 rounded-lg">
            {images.map((src, index) => (
              <div
                onClick={() => handleSelectImage(src)}
                key={index}
                className={`w-[calc(25%-12px)] cursor-pointer aspect-square overflow-hidden rounded-md shrink-0 
                  ${
                    selectedImage === src
                      ? "ring-2 ring-blue-500 shadow-lg shadow-blue-300"
                      : ""
                  }`}
                // className="w-[calc(25%-12px)] cursor-pointer aspect-square overflow-hidden rounded-md bg-gray-100 shrink-0"
              >
                <img
                  src={src}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full p-1 rounded-lg object-cover"
                />
              </div>
            ))}
          </div>

          {/* Add image */}
          <p className="mt-4 font-medium text-sm text-gray-500">Upload image</p>
          <div
            className={`relative flex items-center justify-center bg-gray-50 group w-full h-40 rounded-lg overflow-hidden ${
              !selectedImage || images.includes(selectedImage)
                ? "border-2 border-dashed border-gray-300"
                : ""
            }`}
          >
            {(!selectedImage || images.includes(selectedImage)) && (
              <div className="space-y-2 text-gray-500 flex flex-col items-center">
                <ImagePlus className="w-10 h-10" />
                <p>
                  <span
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 underline underline-offset-4 cursor-pointer"
                  >
                    Click to upload
                  </span>{" "}
                  <span className="font-medium">or Drag and drop</span>
                </p>
                <p className="text-gray-400">Max. File Size: 15MB</p>
              </div>
            )}
            {selectedImage && !images.includes(selectedImage) && (
              <>
                <img
                  src={selectedImage}
                  alt=""
                  className="h-full w-full object-contain bg-black"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-transparent group-hover:bg-black/50 flex items-center justify-center cursor-pointer transition "
                >
                  <span className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition">
                    Click to change
                  </span>
                </div>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden mt-0"
          />
          <div className="mt-4 flex justify-end">
            <button
              disabled={
                !selectedImage ||
                selectedImage === watch(`variants.${variantIndex}.image`)
              }
              onClick={saveVariantImage}
              className={`px-4 py-2 rounded-lg font-medium text-sm text-white ${
                !selectedImage ||
                selectedImage === watch(`variants.${variantIndex}.image`)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
