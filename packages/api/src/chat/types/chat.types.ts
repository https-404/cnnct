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
  receiverId?: string; // For one-to-one chat
  groupId?: string; // For group chat
  tempId?: string; // for optimistic UI
}

export interface ChatMessage {
  id: string;
  text?: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';
  createdAt: string;
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
