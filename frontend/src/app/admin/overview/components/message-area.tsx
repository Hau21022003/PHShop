import { Role } from "@/enums/user.enum";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/chat.type";
import { generateColor } from "@/utils/gen-color";
import { getInitials } from "@/utils/get-initials";
import { timeAgo } from "@/utils/time";
import Link from "next/link";
import React from "react";

export default function MessageArea({
  conversationList,
}: {
  conversationList: Conversation[];
}) {
  return (
    <div className="flex flex-col h-full px-2 py-4 rounded-3xl border-2 border-gray-200 bg-gray-50 space-y-4">
      <div className="flex justify-between items-center h-11">
        <p className="ml-2 text-lg font-stretch-200% font-medium">Messages</p>
      </div>
      <div
        className="flex-1 overflow-y-auto space-y-2"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {conversationList.map((conversation) => {
          const displayName =
            conversation.user.fullName ?? conversation.user.email;
          const message = conversation.latestMessage.images?.length
            ? "Sent image"
            : conversation.latestMessage.message;

          return (
            <Link
              href={`/admin/chat?userId=${conversation.user._id}`}
              key={conversation.user._id}
              className={cn("p-2 rounded-lg flex items-center gap-2 bg-white")}
            >
              <div
                className={cn(
                  "shrink-0 w-14 h-14 flex items-center justify-center",
                  "text-2xl font-medium rounded-md",
                  generateColor(displayName)
                )}
              >
                {getInitials(displayName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-6">
                  <p className="font-medium line-clamp-1 truncate">
                    {displayName}
                  </p>
                  <p className="text-gray-400 shrink-0">
                    {timeAgo(conversation.latestMessage.createdAt)}
                  </p>
                </div>

                <div className="flex justify-between gap-6">
                  <p className="text-gray-500 line-clamp-1 truncate break-all">
                    {conversation.latestMessage.fromRole === Role.ADMIN
                      ? `You: ${message}`
                      : message}
                  </p>
                  {conversation.unreadCount !== 0 && (
                    <div className="shrink-0 w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                      {conversation.unreadCount < 10
                        ? conversation.unreadCount
                        : "9+"}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
