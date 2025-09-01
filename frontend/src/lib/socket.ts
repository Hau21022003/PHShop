// lib/socket.ts
import envConfig from "@/config";
import { authStorage } from "@/lib/auth/auth-storage";
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      const token = authStorage.getSessionToken()?.sessionToken;
      this.socket = io(
        envConfig.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3333",
        {
          auth: { token: `Bearer ${token}` },
        }
      );

      this.socket.on("connect", () => {
        console.log("Connected:", this.socket?.id);
        this.socket?.emit("register");
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected");
      });

      // ✅ Bắt lỗi connect (token hết hạn, không hợp lệ...)
      this.socket.on("connect_error", (err: Error) => {
        console.error("Connect error:", err.message);
        if (err.message.includes("Unauthorized")) {
          this.handleUnauthorized();
        }
      });

      // 🔥 Nếu server ném WsException trong lúc dùng socket
      this.socket.on("exception", (err) => {
        console.error("WS Exception:", err);
        if (err.message === "Unauthorized") {
          this.handleUnauthorized();
        }
      });
    }
    return this.socket;
  }

  private handleUnauthorized() {
    console.log("Token expired or invalid → logout");
    this.disconnect();
    console.log("handleUnauthorized");
    window.location.href = "/logout";
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
