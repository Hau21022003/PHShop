import { chatApiRequest } from "@/api-requests/chat";
import { handleErrorApi } from "@/lib/error";
import { Conversation } from "@/types/chat.type";
import { useEffect, useState } from "react";

export function useConversation() {
  const [conversationList, setConversationList] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversationList = (await chatApiRequest.getConversations())
          .payload;
        setConversationList(conversationList);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    };
    fetchConversations();
  }, []);

  return { conversationList };
}
