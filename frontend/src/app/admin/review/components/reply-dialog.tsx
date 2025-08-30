/* eslint-disable @next/next/no-img-element */
"use client";
import { reviewApiRequest } from "@/api-requests/review";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { handleErrorApi } from "@/lib/error";
import { ReplyBodySchema } from "@/schemas/review.schema";
import { ReplyBody, Review } from "@/types/review.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

export default function ReplyDialog({
  open,
  onClose,
  review,
}: {
  open: boolean;
  onClose: () => void;
  review: Review;
}) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(ReplyBodySchema),
    defaultValues: {},
  });
  const searchParams = useSearchParams();
  const getBaseParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("_t", Date.now().toString());
    return params.toString();
  };
  useEffect(() => {
    form.reset({ shopReply: review.shopReply });
  }, [review, form]);
  const submitReply = async (data: ReplyBody) => {
    try {
      await reviewApiRequest.reply(review._id, data);
      onClose();
      router.push(`?${getBaseParams()}`);
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Reply to Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <FontAwesomeIcon
                    key={idx}
                    icon={faStar}
                    className="w-5 h-5 text-orange-500"
                  />
                ))}
                {Array.from({ length: 5 - review.rating }).map((_, idx) => (
                  <FontAwesomeIcon
                    key={idx}
                    icon={faStar}
                    className="w-5 h-5 text-gray-300"
                  />
                ))}
              </div>
              <p className="text-gray-500">By {review.userSnapshot.fullName}</p>
            </div>
            <p>{review.content}</p>
            {review.images.length !== 0 && (
              <div className="flex gap-2 flex-wrap">
                {review.images.map((image, idx) => (
                  <img key={idx} src={image} alt="" className="w-20 h-20 object-cover" />
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-gray-400"></div>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((data) => {
                submitReply(data);
              })}
            >
              <FormField
                control={form.control}
                name="shopReply"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Category Name</FormLabel>
                    <Textarea
                      placeholder="Enter reply content"
                      className="resize-none"
                      style={{ maxHeight: "7.5rem" }}
                      rows={5}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-fit cursor-pointer px-6 py-2 bg-black text-white"
                >
                  Submit
                </button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
