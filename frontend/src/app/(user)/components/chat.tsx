/* eslint-disable @next/next/no-img-element */
"use client";
import { useAppContext } from "@/app/app-provider";
import { useChat } from "@/app/hooks/use-chat";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faHeadset } from "@fortawesome/free-solid-svg-icons";
import { SendMessageBodySchema } from "@/schemas/message.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp, Plus, X } from "lucide-react";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { handleErrorApi } from "@/lib/error";
import { chatApiRequest } from "@/api-requests/chat";
import { toast } from "sonner";
import { showImage } from "@/components/image-viewer";
import { formatDateWithRelative } from "@/utils/time";

export default function Chat({
  handleCloseChat,
}: {
  handleCloseChat: () => void;
}) {
  const { user } = useAppContext();
  const { messages, sendMessage } = useChat();
  const form = useForm({
    resolver: zodResolver(SendMessageBodySchema),
    defaultValues: {
      message: "",
      images: [],
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    const images = form.getValues("images") || [];
    if (images.length >= 4) {
      toast.error("Error", {
        duration: 2000,
        description: "You can only upload up to 4 images.",
      });
      return;
    }
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );
      try {
        const formData = new FormData();
        formData.append("image", imageFiles[0]);
        const uploadRsp = await chatApiRequest.uploadImage(formData);
        form.setValue("images", [
          ...(form.getValues("images") || []),
          uploadRsp.payload.imageUrl,
        ]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    }
  };

  const removeImage = (url: string) => {
    form.setValue(
      "images",
      (form.watch("images") || []).filter((imageUrl) => imageUrl !== url),
      { shouldValidate: true }
    );
  };

  const groupedMessages = messages
    .slice()
    .reverse()
    .reduce((groups, msg) => {
      const dateLabel = formatDateWithRelative(msg.createdAt);
      if (!groups[dateLabel]) groups[dateLabel] = [];
      groups[dateLabel].push(msg);
      return groups;
    }, {} as Record<string, typeof messages>);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-2 flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faHeadset}
            size="lg"
            className="text-black w-5 h-5"
          />
          <p>Customer Care</p>
        </div>
        <X onClick={handleCloseChat} className="w-5 h-5 cursor-pointer" />
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 p-4 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-400">
            <FontAwesomeIcon icon={faComments} size="2x" className="mb-2" />
            <p className="text-sm">Hi there! We&apos;re here to help</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
            <div key={dateLabel} className="space-y-4">
              {/* Divider hiển thị ngày */}
              <div className="flex items-center justify-center">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {dateLabel}
                </span>
              </div>

              <div className="space-y-2">
                {msgs.map((msg) => {
                  const isSameRole = user?.role === msg.fromRole;
                  return (
                    <div
                      key={msg._id}
                      className={cn(
                        "w-full flex",
                        isSameRole ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={`space-y-2 max-w-[70%] flex flex-col ${
                          isSameRole ? "items-end" : "items-start"
                        }`}
                      >
                        {msg.images.length !== 0 && (
                          <div
                            className={`flex ${
                              isSameRole ? "justify-end" : "justify-start"
                            } gap-2 flex-wrap`}
                          >
                            {msg.images.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt=""
                                className="object-cover w-20 h-20 sm:w-16 sm:h-16 cursor-pointer"
                                onClick={() => showImage(url)}
                              />
                            ))}
                          </div>
                        )}
                        <p
                          className={`w-fit p-2 px-4 rounded-md ${
                            isSameRole ? "bg-black text-white" : "bg-gray-200"
                          }`}
                        >
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ô nhập tin nhắn */}
      <Form {...form}>
        <form
          className="relative"
          onSubmit={form.handleSubmit((data) => {
            sendMessage(data);
            form.setValue("message", "");
            form.setValue("images", []);
          })}
        >
          {form.watch("images").length !== 0 && (
            <div className="flex gap-2 flex-wrap px-4 pb-2 bg-white/70">
              {form.getValues("images").map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-[calc(25%-6px)] aspect-square overflow-hidden bg-gray-100 shrink-0"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover border-none"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="cursor-pointer absolute top-0 right-0 bg-black/50 text-white w-6 h-6 flex items-center justify-center text-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <FormField
            control={form.control}
            name="message"
            render={({ field, formState }) => (
              <FormItem className="border-t border-gray-200 p-2 flex items-center gap-2">
                <Plus
                  onClick={() => fileInputRef.current?.click()}
                  className="w-5 h-5 text-black cursor-pointer"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  {...field}
                  type="text"
                  placeholder="Type something"
                  className="outline-none flex-1"
                />
                <button
                  type="submit"
                  disabled={!!formState.errors.message || !field.value?.trim()}
                  className="p-2 bg-gray-300 text-black disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
