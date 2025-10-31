import { Server, Socket } from "socket.io";
import { sendDirectMessage, sendGroupMessage } from "../../services/socket-message.service";
import { ChatMessagePayload } from "../types/chat.types";

export function registerMessageHandlers(io: Server, socket: Socket) {
  const userId = socket.data.userId;

  // Join group room when user joins a group
  socket.on("group:join", async (groupId: string, callback) => {
    try {
      // Verify user is member of group
      const { prisma } = await import("../../lib/prisma");
      const membership = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId,
            groupId,
          }
        }
      });

      if (!membership) {
        callback && callback({ success: false, error: "Not a member of this group" });
        return;
      }

      socket.join(`group:${groupId}`);
      callback && callback({ success: true });
    } catch (error: any) {
      callback && callback({ success: false, error: error.message });
    }
  });

  // Leave group room
  socket.on("group:leave", (groupId: string) => {
    socket.leave(`group:${groupId}`);
  });

  // Send message event (one-to-one or group)
  socket.on("message:send", async (payload: ChatMessagePayload, callback) => {
    try {
      if (!userId) throw new Error("User not authenticated");
      
      if (payload.attachments && payload.attachments.length > 4) {
        throw new Error("Maximum 4 attachments allowed");
      }

      let message;
      let recipientIds: string[] = [];

      if (payload.groupId) {
        // Group message
        const result = await sendGroupMessage({
          senderId: userId,
          groupId: payload.groupId,
          text: payload.text,
          attachments: payload.attachments as any,
        });
        message = result.message;
        recipientIds = result.groupMemberIds.filter(id => id !== userId); // Exclude sender
        
        // Emit to all group members
        io.to(`group:${payload.groupId}`).emit("message:receive", message);
      } else if (payload.receiverId) {
        // One-to-one message
        message = await sendDirectMessage({
          senderId: userId,
          receiverId: payload.receiverId,
          text: payload.text,
          attachments: payload.attachments as any,
        });
        recipientIds = [payload.receiverId];
        
        // Emit to receiver
        io.to(payload.receiverId).emit("message:receive", message);
      } else {
        throw new Error("Either receiverId or groupId must be provided");
      }

      // Send confirmation to sender
      socket.emit("message:sent", { ...message, tempId: payload.tempId });
      callback && callback({ success: true, message });
    } catch (error: any) {
      callback && callback({ success: false, error: error.message });
      socket.emit("message:error", { tempId: payload.tempId, error: error.message });
    }
  });

  // Typing indicator
  socket.on("typing:start", (data: { receiverId?: string; groupId?: string }) => {
    if (data.groupId) {
      socket.to(`group:${data.groupId}`).emit("typing:start", { userId, username: socket.data.username });
    } else if (data.receiverId) {
      io.to(data.receiverId).emit("typing:start", { userId, username: socket.data.username });
    }
  });

  socket.on("typing:stop", (data: { receiverId?: string; groupId?: string }) => {
    if (data.groupId) {
      socket.to(`group:${data.groupId}`).emit("typing:stop", { userId });
    } else if (data.receiverId) {
      io.to(data.receiverId).emit("typing:stop", { userId });
    }
  });
}
