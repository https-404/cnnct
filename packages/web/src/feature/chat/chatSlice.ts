import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface Message {
  id: string;
  senderId: string | number;
  content: string;
  timestamp: string;
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
      state.messages[friendId].push(message);
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
  setLoading,
  setError
} = chatSlice.actions;

export const selectActiveFriend = (state: RootState) => state.chat.activeFriend;
export const selectMessages = (state: RootState, friendId?: string | number) => 
  friendId && state.chat.messages[friendId] ? state.chat.messages[friendId] : [];
export const selectChatLoading = (state: RootState) => state.chat.isLoading;
export const selectChatError = (state: RootState) => state.chat.error;

export default chatSlice.reducer;
