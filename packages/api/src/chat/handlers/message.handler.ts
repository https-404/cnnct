import { Server, Socket } from "socket.io";
import { sendDirectMessage } from "../../services/socket-message.service";
import { ChatMessagePayload } from "../types/chat.types";

export function registerMessageHandlers(io: Server, socket: Socket) {
  // Send message event
  socket.on("message:send", async (payload: ChatMessagePayload, callback) => {
    try {
      // You should get senderId from socket auth/session in production
  const senderId = socket.data.userId;
  if (!senderId || !payload.receiverId) throw new Error("Missing sender or receiver");
      if (payload.attachments && payload.attachments.length > 4) throw new Error("Maximum 4 attachments allowed");

      const message = await sendDirectMessage({
        senderId,
        receiverId: payload.receiverId,
        text: payload.text,
        attachments: payload.attachments as any,
      });

      // Emit to receiver (and sender for confirmation)
      io.to(payload.receiverId).emit("message:receive", message);
      socket.emit("message:sent", message);
      callback && callback({ success: true, message });
    } catch (error: any) {
      callback && callback({ success: false, error: error.message });
    }
  });
}
