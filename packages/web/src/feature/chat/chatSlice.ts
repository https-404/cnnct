import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface Message {
  id: string;
  senderId: string | number;
  content?: string;
  text?: string;
  timestamp: string;
  createdAt?: string;
  messageType?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';
  fileType?: string;
  fileName?: string;
  attachments?: Array<{
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';
    sizeBytes?: number;
    width?: number;
    height?: number;
    durationMs?: number;
    fileName?: string;
  }>;
  tempId?: string;
}

interface Friend {
  id: string | number;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface ChatState {
  activeFriend: Friend | null;
  messages: Record<string | number, Message[]>;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  activeFriend: null,
  messages: {},
  isLoading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveFriend: (state, action: PayloadAction<Friend>) => {
      state.activeFriend = action.payload;
    },
    clearActiveFriend: (state) => {
      state.activeFriend = null;
    },
    setMessages: (state, action: PayloadAction<{ friendId: string | number, messages: Message[] }>) => {
      const { friendId, messages } = action.payload;
      state.messages[friendId] = messages;
    },
    addMessage: (state, action: PayloadAction<{ friendId: string | number, message: Message }>) => {
      const { friendId, message } = action.payload;
      if (!state.messages[friendId]) {
        state.messages[friendId] = [];
      }
      // Check if message already exists (by id or tempId)
      const exists = state.messages[friendId].some(m => m.id === message.id || (message.tempId && m.tempId === message.tempId));
      if (!exists) {
        state.messages[friendId].push(message);
        // Sort by timestamp
        state.messages[friendId].sort((a, b) => {
          const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
          const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
          return timeA - timeB;
        });
      }
    },
    updateMessage: (state, action: PayloadAction<{ friendId: string | number, tempId: string, message: Message }>) => {
      const { friendId, tempId, message } = action.payload;
      if (state.messages[friendId]) {
        const index = state.messages[friendId].findIndex(m => m.tempId === tempId);
        if (index !== -1) {
          state.messages[friendId][index] = { ...state.messages[friendId][index], ...message, tempId: undefined };
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setActiveFriend, 
  clearActiveFriend, 
  setMessages, 
  addMessage,
  updateMessage,
  setLoading,
  setError
} = chatSlice.actions;

export const selectActiveFriend = (state: RootState) => state.chat.activeFriend;
export const selectMessages = (state: RootState, friendId?: string | number) => 
  friendId && state.chat.messages[friendId] ? state.chat.messages[friendId] : [];
export const selectChatLoading = (state: RootState) => state.chat.isLoading;
export const selectChatError = (state: RootState) => state.chat.error;

export default chatSlice.reducer;
