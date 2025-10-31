import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '../token';

let socket: Socket | null = null;

export interface ChatMessagePayload {
  text?: string;
  attachments?: Array<{
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';
    sizeBytes?: number;
    width?: number;
    height?: number;
    durationMs?: number;
    fileName?: string;
  }>;
  receiverId?: string;
  groupId?: string;
  tempId?: string;
}

export interface ChatMessage {
  id: string;
  text?: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';
  createdAt: string;
  tempId?: string;
  attachments: Array<{
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';
    sizeBytes?: number;
    width?: number;
    height?: number;
    durationMs?: number;
    fileName?: string;
  }>;
}

export interface SocketCallbacks {
  onMessage?: (message: ChatMessage) => void;
  onMessageSent?: (message: ChatMessage) => void;
  onMessageError?: (error: { tempId?: string; error: string }) => void;
  onTypingStart?: (data: { userId: string; username?: string }) => void;
  onTypingStop?: (data: { userId: string }) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export function connectSocket(callbacks: SocketCallbacks = {}): Socket {
  if (socket?.connected) {
    return socket;
  }

  const token = getAccessToken();
  if (!token) {
    throw new Error('No access token available');
  }

  const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  socket = io(serverUrl, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  // Connection events
  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
    callbacks.onConnect?.();
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    callbacks.onDisconnect?.();
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    callbacks.onError?.(error);
  });

  // Message events
  socket.on('message:receive', (message: ChatMessage) => {
    callbacks.onMessage?.(message);
  });

  socket.on('message:sent', (message: ChatMessage) => {
    callbacks.onMessageSent?.(message);
  });

  socket.on('message:error', (error: { tempId?: string; error: string }) => {
    callbacks.onMessageError?.(error);
  });

  // Typing events
  socket.on('typing:start', (data: { userId: string; username?: string }) => {
    callbacks.onTypingStart?.(data);
  });

  socket.on('typing:stop', (data: { userId: string }) => {
    callbacks.onTypingStop?.(data);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

export function sendMessage(payload: ChatMessagePayload, callback?: (response: { success: boolean; message?: ChatMessage; error?: string }) => void) {
  if (!socket || !socket.connected) {
    throw new Error('Socket not connected');
  }
  
  socket.emit('message:send', payload, callback);
}

export function joinGroup(groupId: string, callback?: (response: { success: boolean; error?: string }) => void) {
  if (!socket || !socket.connected) {
    throw new Error('Socket not connected');
  }
  
  socket.emit('group:join', groupId, callback);
}

export function leaveGroup(groupId: string) {
  if (!socket || !socket.connected) {
    return;
  }
  
  socket.emit('group:leave', groupId);
}

export function startTyping(data: { receiverId?: string; groupId?: string }) {
  if (!socket || !socket.connected) {
    return;
  }
  
  socket.emit('typing:start', data);
}

export function stopTyping(data: { receiverId?: string; groupId?: string }) {
  if (!socket || !socket.connected) {
    return;
  }
  
  socket.emit('typing:stop', data);
}

