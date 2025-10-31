import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { registerMessageHandlers } from "./handlers/message.handler";

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

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    
    // Join user's personal room
    socket.join(userId);
    console.log(`User ${userId} connected with socket ${socket.id}`);
    
    // Register handlers
    registerMessageHandlers(io, socket);
    
    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
}
