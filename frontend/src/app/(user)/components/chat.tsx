/* eslint-disable @next/next/no-img-element */
"use client";
import { useAppContext } from "@/app/app-provider";
import { useChat } from "@/app/hooks/use-chat";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faHeadset } from "@fortawesome/free-solid-svg-icons";
import { ArrowUp, Plus, X } from "lucide-react";
import React, { useEffect } from "react";
import { showImage } from "@/components/image-viewer";
import { formatDateWithRelative } from "@/utils/time";
import { useSendMessage } from "@/app/hooks/use-send-message";
import { useLoadMessage } from "@/app/hooks/use-load-message";
import { Role } from "@/enums/user.enum";
import { chatApiRequest } from "@/api-requests/chat";
import { useUserContext } from "@/app/(user)/user-provider";

export default function Chat({
  handleCloseChat,
}: {
  handleCloseChat: () => void;
}) {
  const { user } = useAppContext();
  const { fetchCountUnreadMessages } = useUserContext();
  const { messages, sendMessage, addMessageToTop, resetScroll, shouldScroll } =
    useChat();
  const { messageContainerRef } = useLoadMessage(Role.USER, addMessageToTop);
  const { fileInputRef, handleFileChange, removeImage, sendMessageForm } =
    useSendMessage();

  const groupedMessages = messages.reduce((groups, msg) => {
    const dateLabel = formatDateWithRelative(msg.createdAt);
    if (!groups[dateLabel]) groups[dateLabel] = [];
    groups[dateLabel].push(msg);
    return groups;
  }, {} as Record<string, typeof messages>);

  useEffect(() => {
    if (shouldScroll && messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
      resetScroll();
    }
  }, [messages, shouldScroll, resetScroll]);

  useEffect(() => {
    if (!user) return;
    const updateReadStatus = async () => {
      try {
        await chatApiRequest.markAllAdminMessagesRead();
        fetchCountUnreadMessages();
      } catch (error) {
        console.error(error);
      }
    };
    updateReadStatus();
  }, [user]);

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
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto space-y-4 p-4 flex flex-col"
      >
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
                          style={{ overflowWrap: "anywhere" }}
                          className={`max-w-full w-fit p-2 px-4 ${
                            isSameRole
                              ? "bg-black text-white rounded-b-lg rounded-tl-lg rounded-tr-xs"
                              : "bg-gray-200 rounded-b-lg rounded-tr-lg rounded-tl-xs"
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
      <Form {...sendMessageForm}>
        <form
          className="relative"
          onSubmit={sendMessageForm.handleSubmit((data) => {
            sendMessage(data);
            sendMessageForm.setValue("message", "");
            sendMessageForm.setValue("images", []);
          })}
        >
          {sendMessageForm.watch("images").length !== 0 && (
            <div className="flex gap-2 flex-wrap px-4 pb-2 bg-white/70">
              {sendMessageForm.getValues("images").map((url, idx) => (
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
            control={sendMessageForm.control}
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
