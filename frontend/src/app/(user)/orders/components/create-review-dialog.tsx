/* eslint-disable @next/next/no-img-element */
"use client";
import { orderApiRequest } from "@/api-requests/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as regularFaStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidFaStar } from "@fortawesome/free-solid-svg-icons";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import { OrderResType } from "@/schemas/order.schema";
import { CreateReviewBody } from "@/schemas/review.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateReviewBodyType } from "@/types/review.type";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X } from "lucide-react";
import { reviewApiRequest } from "@/api-requests/review";
// import { Textarea } from "@/components/ui/textarea";
interface CreateReviewDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
}
type ReviewStep = "SELECT_PRODUCT" | "WRITE_REVIEW";

export default function CreateReviewDialog({
  onClose,
  open,
  orderId,
}: CreateReviewDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<ReviewStep>("SELECT_PRODUCT");
  const [order, setOrder] = useState<OrderResType>();
  const form = useForm({
    resolver: zodResolver(CreateReviewBody),
    defaultValues: {},
  });

  const fetchOrder = async () => {
    try {
      const order = (await orderApiRequest.findOne(orderId)).payload;
      setOrder(order);
      form.reset({
        order: orderId,
        product: undefined,
        images: [],
        rating: undefined,
        content: "",
      });
      setStep("SELECT_PRODUCT");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

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
        const uploadRsp = await reviewApiRequest.uploadImage(formData);
        form.setValue(
          "images",
          [...(form.getValues("images") || []), uploadRsp.payload.imageUrl],
          {
            shouldValidate: true,
          }
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    }
  };

  const saveReview = async (data: CreateReviewBodyType) => {
    try {
      setLoading(true);
      await reviewApiRequest.create(data);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Review</DialogTitle>
        </DialogHeader>
        {order && step === "SELECT_PRODUCT" && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-500">
              Choose product to review
            </p>
            <div className="flex gap-4 flex-wrap">
              {order.items.map((orderItem, idx) => (
                <button
                  key={idx}
                  disabled={orderItem.isReviewed}
                  onClick={() => form.setValue("product", orderItem.product)}
                  className={cn(
                    "border-white w-30 h-30 overflow-hidden",
                    "rounded-sm relative disabled:cursor-not-allowed cursor-pointer",
                    form.watch("product") === orderItem.product
                      ? "outline-2 outline-blue-400 outline-offset-3"
                      : ""
                  )}
                >
                  <img
                    src={orderItem.productSnapshot.image}
                    alt=""
                    className="w-full h-full rounded-sm object-cover"
                  />
                  {orderItem.isReviewed && (
                    <div
                      className={cn(
                        "absolute inset-0 w-full aspect-square bg-black/70 ",
                        "text-white flex items-center justify-center",
                        "text-lg font-bold tracking-wider"
                      )}
                    >
                      Reviewed
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep("WRITE_REVIEW")}
              disabled={!form.watch("product")}
              className="cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed p-3 w-full text-center font-medium text-white bg-black"
            >
              Review Product
            </button>
          </div>
        )}
        {order && step === "WRITE_REVIEW" && (
          <Form {...form}>
            <form
              // className="p-4 rounded-lg bg-gray-100"
              onSubmit={form.handleSubmit((data) => {
                saveReview(data);
              })}
            >
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <img
                    src={
                      order.items.find(
                        (item) => item.product === form.watch("product")
                      )?.productSnapshot.image
                    }
                    alt=""
                    className="w-14 h-14 object-cover shrink-0"
                  />
                  <p className="line-clamp-1 text-gray-400">
                    {
                      order.items.find(
                        (item) => item.product === form.watch("product")
                      )?.productSnapshot.name
                    }
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <div
                            key={idx}
                            onClick={() => field.onChange(idx + 1)}
                            className={cn(
                              "cursor-pointer border-2 border-gray-300 rounded-sm w-10 h-10 flex items-center justify-center"
                            )}
                          >
                            {form.watch("rating") >= idx + 1 ? (
                              <FontAwesomeIcon
                                icon={solidFaStar}
                                size="xl"
                                className="text-yellow-500 w-8 h-8"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={regularFaStar}
                                size="xl"
                                className="text-yellow-500 w-8 h-8"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm">Click to rate</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Product Review</FormLabel>
                      <Textarea
                        placeholder="Share your experience with this product (quality, delivery, packaging, etc.)"
                        className="resize-none"
                        style={{ maxHeight: "7.5rem" }}
                        rows={5}
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="images"
                  render={({}) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Upload Images</FormLabel>
                      <div className="flex gap-4 flex-wrap">
                        {(form.watch("images") || []).map((src, index) => (
                          <div
                            key={src}
                            className="relative w-[calc(25%-12px)] aspect-square overflow-hidden bg-gray-100 shrink-0"
                          >
                            <img
                              src={src}
                              alt={`Image ${index + 1}`}
                              className="w-full h-full object-cover border-none"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                form.setValue(
                                  "images",
                                  (form.watch("images") || []).filter(
                                    (imageUrl) => imageUrl !== src
                                  ),
                                  { shouldValidate: true }
                                );
                              }}
                              className="cursor-pointer absolute top-0 right-0 bg-black/50 text-white w-6 h-6 flex items-center justify-center text-sm"
                            >
                              <X className="w-4 h-4" />
                            </button>
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
                          className="hidden mt-0"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-stretch sm:h-10">
                  <button
                    onClick={onClose}
                    type="button"
                    className="p-2 cursor-pointer h-full border-2 border-black text-black text-center w-full sm:w-30 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-2 cursor-pointer h-full bg-black text-white text-center w-full sm:w-30 font-medium text-sm flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                    <p>Submit</p>
                  </button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
