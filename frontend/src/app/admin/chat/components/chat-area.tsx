/* eslint-disable @next/next/no-img-element */
"use client";
import { chatApiRequest } from "@/api-requests/chat";
import { userApiRequest } from "@/api-requests/user";
import MessageList from "@/app/admin/chat/components/message-list";
import { useChat } from "@/app/hooks/use-chat";
import { useLoadMessage } from "@/app/hooks/use-load-message";
import { useSendMessage } from "@/app/hooks/use-send-message";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Role } from "@/enums/user.enum";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import { AccountType } from "@/schemas/account.schema";
import { generateColor } from "@/utils/gen-color";
import { getInitials } from "@/utils/get-initials";
import {
  faPaperclip,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ChatAreaProps {
  userId: string;
}
export default function ChatArea({ userId }: ChatAreaProps) {
  const router = useRouter();
  const [user, setUser] = useState<AccountType>();
  const { messages, sendMessage, addMessageToTop, resetScroll, shouldScroll } =
    useChat();
  const { messageContainerRef } = useLoadMessage(
    Role.ADMIN,
    addMessageToTop,
    userId
  );
  const { fileInputRef, handleFileChange, removeImage, sendMessageForm } =
    useSendMessage();

  useEffect(() => {
    const updateReadStatus = async () => {
      try {
        await chatApiRequest.markAllUserMessagesRead(userId);
      } catch (error) {
        console.error(error);
      }
    };
    sendMessageForm.setValue("toUserId", userId);
    updateReadStatus();
  }, [userId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = (await userApiRequest.findOne(userId)).payload;
        setUser(user);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (shouldScroll && messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
      resetScroll();
    }
  }, [messages, shouldScroll, resetScroll]);

  const searchParams = useSearchParams();
  const getBaseParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("userId");
    return params.toString();
  };

  return (
    <div className="h-full flex flex-col">
      <div
        className="flex-1 space-y-4 overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        ref={messageContainerRef}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-100/95 p-4 flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "shrink-0 w-10 h-10 flex items-center justify-center",
                "text-xl font-medium rounded-md",
                generateColor(user?.contactDetails?.fullName ?? user?.email)
              )}
            >
              {getInitials(user?.contactDetails?.fullName ?? user?.email)}
            </div>
            <p className="leading-none">
              {user?.contactDetails?.fullName ?? user?.email}
            </p>
          </div>
          <button
            onClick={() => {
              router.push(`/admin/chat?${getBaseParams()}}`);
            }}
            className="lg:hidden cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" className="w-6 h-6" />
          </button>
        </div>
        <MessageList messages={messages} />
      </div>

      {/* Ô nhập tin nhắn */}
      <div className="px-4 pb-4 bg-gray-200">
        {/* <div className="px-4 pb-4 bg-gradient-to-b from-transparent from-50% to-gray-200 to-50%"> */}
        <Form {...sendMessageForm}>
          <form
            className="bg-white rounded-lg p-4"
            onSubmit={sendMessageForm.handleSubmit((data) => {
              sendMessage(data);
              sendMessageForm.setValue("message", "");
              sendMessageForm.setValue("images", []);
            })}
          >
            {sendMessageForm.watch("images").length !== 0 && (
              <div className="flex gap-2 flex-wrap pb-2 bg-white/70">
                {sendMessageForm.getValues("images").map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-30 aspect-square overflow-hidden bg-gray-100 shrink-0"
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
                <FormItem className="flex items-center gap-2">
                  <FontAwesomeIcon
                    onClick={() => fileInputRef.current?.click()}
                    icon={faPaperclip}
                    size="lg"
                    className="w-5 h-5 cursor-pointer"
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
                    disabled={
                      !!formState.errors.message || !field.value?.trim()
                    }
                    className="disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon
                      icon={faPaperPlane}
                      size="lg"
                      className="w-5 h-5 cursor-pointer"
                    />
                  </button>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
