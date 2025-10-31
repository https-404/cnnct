import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { registerMessageHandlers } from "./handlers/message.handler";
import { addOnlineUser, removeOnlineUser, isUserOnline } from "../services/online-status.service";
import { prisma } from "../lib/prisma";

export function setupChatServer(server: http.Server) {
  const io = new Server(server, {
    cors: { 
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true 
    },
  });

  // Authentication middleware for socket connections
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      socket.data.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const userId = socket.data.userId;
    
    // Join user's personal room
    socket.join(userId);
    console.log(`User ${userId} connected with socket ${socket.id}`);
    
    // Mark user as online
    addOnlineUser(userId, socket.id);
    
    // Get user's friends to notify them
    try {
      const friends = await prisma.friend.findMany({
        where: { userId },
        select: { friendId: true }
      });
      
      // Notify all friends that this user is now online
      friends.forEach(friend => {
        io.to(friend.friendId).emit("user:online", { userId });
      });
      
      // Send list of online friends to the newly connected user
      const friendIds = friends.map(f => f.friendId);
      const onlineFriends = friendIds.filter(friendId => isUserOnline(friendId));
      socket.emit("friends:online", { userIds: onlineFriends });
    } catch (error) {
      console.error("Error fetching friends for online status:", error);
    }
    
    // Register handlers
    registerMessageHandlers(io, socket);
    
    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log(`User ${userId} disconnected`);
      
      // Mark user as offline
      removeOnlineUser(userId);
      
      // Notify friends that user went offline
      try {
        const friends = await prisma.friend.findMany({
          where: { userId },
          select: { friendId: true }
        });
        
        friends.forEach(friend => {
          io.to(friend.friendId).emit("user:offline", { userId });
        });
      } catch (error) {
        console.error("Error notifying friends of offline status:", error);
      }
    });
  });

  return io;
}
