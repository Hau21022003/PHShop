import { showImage } from "@/components/image-viewer";
import { Role } from "@/enums/user.enum";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat.type";
import { formatDateWithRelative } from "@/utils/time";
import React from "react";

export default function MessageList({ messages }: { messages: Message[] }) {
  const groupedMessages = messages.reduce((groups, msg) => {
    const dateLabel = formatDateWithRelative(msg.createdAt);
    if (!groups[dateLabel]) groups[dateLabel] = [];
    groups[dateLabel].push(msg);
    return groups;
  }, {} as Record<string, typeof messages>);
  return (
    <div className="p-4">
      {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
        <div key={dateLabel} className="space-y-4">
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              {dateLabel}
            </span>
          </div>

          <div className="max-w-full">
            {msgs.map((msg, idx) => {
              const isSameRole = msg.fromRole === Role.ADMIN;
              const prevMsg = idx > 0 ? msgs[idx - 1] : null;
              const isSameAsPrev = prevMsg?.fromRole === msg.fromRole;
              return (
                <div
                  key={msg._id}
                  className={cn(
                    "w-full flex",
                    isSameRole ? "justify-end" : "justify-start",
                    isSameAsPrev ? "mt-1" : "mt-4"
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
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={idx}
                            src={url}
                            alt=""
                            className="object-cover w-30 h-30 sm:w-30 sm:h-30 cursor-pointer"
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
                          : "bg-white rounded-b-lg rounded-tr-lg rounded-tl-xs"
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
      ))}
    </div>
  );
}
