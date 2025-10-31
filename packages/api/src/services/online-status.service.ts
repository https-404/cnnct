// In-memory store for online users
// In production, you might want to use Redis or a database
const onlineUsers = new Map<string, { socketId: string; connectedAt: Date }>();

export function addOnlineUser(userId: string, socketId: string) {
  onlineUsers.set(userId, { socketId, connectedAt: new Date() });
}

export function removeOnlineUser(userId: string) {
  onlineUsers.delete(userId);
}

export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId);
}

export function getOnlineUsers(): string[] {
  return Array.from(onlineUsers.keys());
}

export function getUserSocketId(userId: string): string | undefined {
  return onlineUsers.get(userId)?.socketId;
}

