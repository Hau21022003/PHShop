import { socketService } from "@/lib/socket";
import { Message, SendMessageBody } from "@/types/chat.type";
import { useEffect, useState } from "react";

export function useChat() {
  // Mới nhất xếp cuối
  const [messages, setMessages] = useState<Message[]>([]);
  const [shouldScroll, setShouldScroll] = useState(false);

  const addMessage = (message: Message, position: "top" | "bottom") => {
    setMessages((prev) => {
      const exists = prev.some((oldMsg) => oldMsg._id === message._id);
      if (exists) return prev;

      if (position === "top") {
        return [message, ...prev];
      } else {
        return [...prev, message];
      }
    });
  };

  const addMessageToTop = (message: Message) => addMessage(message, "top");
  const addMessageToBottom = (message: Message) => {
    addMessage(message, "bottom");
    setShouldScroll(true); // báo cần scroll
  };

  useEffect(() => {
    const socket = socketService.connect();

    socket.on("receive_message", (data: Message) => {
      const match =
        messages.length !== 0 ? messages[0].user === data.user : true;
      if (match) {
        addMessageToBottom(data);
      }
    });

    socket.on("admin_message", (data: Message) => {
      // addMessageToBottom(data);
      const match =
        messages.length !== 0 ? messages[0].user === data.user : true;
      if (match) {
        addMessageToBottom(data);
      }
    });

    socket.on("message_confirmed", (data) => {
      addMessageToBottom(data);
    });

    // return () => {
    //   socketService.disconnect();
    // };
    // Ham dọn dẹp
  }, []);

  const sendMessage = (message: SendMessageBody) => {
    const socket = socketService.getSocket();
    socket?.emit("send_message", message);
  };

  const resetScroll = () => setShouldScroll(false);

  return { messages, sendMessage, addMessageToTop, shouldScroll, resetScroll };
}
