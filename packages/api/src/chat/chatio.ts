import { Server } from "socket.io";
import http from "http";
import { registerMessageHandlers } from "./handlers/message.handler";

export function setupChatServer(server: http.Server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    registerMessageHandlers(io, socket);
    // Add more handler registrations as needed
  });

  return io;
}
