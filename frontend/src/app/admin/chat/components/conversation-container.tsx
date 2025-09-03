import SearchInput from "@/app/admin/chat/components/search-input";
import { Role } from "@/enums/user.enum";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/chat.type";
import { generateColor } from "@/utils/gen-color";
import { getInitials } from "@/utils/get-initials";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

enum MessageFilter {
  ALL = "All",
  UNREAD = "Unread",
  TODAY = "Today",
}

export default function ConversationContainer({
  conversationList,
}: {
  conversationList: Conversation[];
}) {
  const searchParams = useSearchParams();
  const getBaseParams = (
    ...excludes: ("messageFilter" | "search" | "userId")[]
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (excludes) {
      excludes.forEach((exclude) => params.delete(exclude));
    }
    return params.toString();
  };

  const isToday = (date: string | Date) => {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  const messageFilter = searchParams.get("messageFilter") as MessageFilter;
  const search = searchParams.get("search") || "";
  const filteredConversation = conversationList
    .filter((conversation) =>
      messageFilter === MessageFilter.UNREAD
        ? conversation.unreadCount !== 0
        : true
    )
    .filter((conversation) =>
      messageFilter === MessageFilter.TODAY
        ? isToday(conversation.latestMessage.createdAt)
        : true
    )
    .filter((conversation) =>
      search
        ? conversation.user.email
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (conversation.user.fullName || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          conversation.latestMessage.message
            ?.toLowerCase()
            .includes(search.toLowerCase())
        : true
    );

  return (
    <div className="w-full">
      <div className="px-6 pt-4 lg:pt-6 sticky top-0 space-y-4 pb-4 bg-white">
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold">Messages</p>
          <button className="w-8 h-8 bg-gray-100 rounded-sm flex items-center justify-center">
            <FontAwesomeIcon icon={faPen} className="text-black w-5 h-5" />
          </button>
        </div>
        <SearchInput />
        <div className="flex gap-0">
          {Object.entries(MessageFilter).map(([_, messageFilterLabel]) => (
            <Link
              href={`/admin/chat?${getBaseParams(
                "messageFilter"
              )}&messageFilter=${messageFilterLabel}`}
              key={messageFilterLabel}
              className={cn(
                "py-2 px-4 rounded-lg font-medium cursor-pointer",
                messageFilter === messageFilterLabel ? "bg-gray-100" : "",
                !messageFilter && messageFilterLabel === MessageFilter.ALL
                  ? "bg-gray-100"
                  : ""
              )}
            >
              {messageFilterLabel}
            </Link>
          ))}
        </div>
      </div>
      <div className="px-4 space-y-4">
        {filteredConversation.map((conversation) => {
          const displayName =
            conversation.user.fullName ?? conversation.user.email;
          const message = conversation.latestMessage.images?.length
            ? "Sent image"
            : conversation.latestMessage.message;

          return (
            <Link
              href={`/admin/chat?${getBaseParams("userId")}&userId=${
                conversation.user._id
              }`}
              key={conversation.user._id}
              className={cn(
                "p-2 rounded-lg flex items-center gap-2",
                searchParams.get("userId") === conversation.user._id
                  ? "bg-gray-100"
                  : ""
              )}
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
                <p className="font-medium line-clamp-1">{displayName}</p>

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
