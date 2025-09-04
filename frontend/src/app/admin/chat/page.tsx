"use client";
import ChatArea from "@/app/admin/chat/components/chat-area";
import ConversationContainer from "@/app/admin/chat/components/conversation-container";
import { useConversation } from "@/app/admin/chat/hooks/use-conversation";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ChatPage() {
  const { conversationList } = useConversation();
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const searchParams = useSearchParams();
  useEffect(() => {
    const userId = searchParams.get("userId");
    console.log("userId", userId);
    if (userId) setSelectedUserId(userId);
    else setSelectedUserId(undefined);
  }, [searchParams]);

  return (
    <div className="w-full flex h-full">
      <div
        className={cn(
          "lg:block flex-1 h-full bg-gray-200",
          selectedUserId ? "" : "hidden"
        )}
      >
        {selectedUserId && (
          <ChatArea key={selectedUserId} userId={selectedUserId} />
        )}
      </div>
      <div
        className={cn(
          "w-full lg:w-100 h-full overflow-y-auto",
          selectedUserId ? "hidden lg:block" : ""
        )}
      >
        <ConversationContainer conversationList={conversationList} />
      </div>
    </div>
  );
}
