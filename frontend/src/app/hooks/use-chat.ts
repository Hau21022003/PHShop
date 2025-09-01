import { socketService } from "@/lib/socket";
import { Message, SendMessageBody } from "@/types/message.type";
import { useEffect, useState } from "react";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const addMessage = (message: Message) => {
    setMessages((prev) => [message, ...prev]);
  };
  useEffect(() => {
    const socket = socketService.connect();

    socket.on("receive_message", (data: Message) => {
      addMessage(data);
    });

    socket.on("admin_message", (data) => {
      addMessage(data);
    });

    socket.on("message_confirmed", (data) => {
      addMessage(data);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const sendMessage = (message: SendMessageBody) => {
    const socket = socketService.getSocket();
    socket?.emit("send_message", message);
    console.log("send", message);
  };

  return { messages, sendMessage };
}
