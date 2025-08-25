export interface ChatMessagePayload {
  text?: string;
  attachments?: Array<{
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'FILE';
    sizeBytes?: number;
    width?: number;
    height?: number;
    durationMs?: number;
  }>;
  receiverId: string;
  tempId?: string; // for optimistic UI
}

export interface ChatMessage {
  id: string;
  text?: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  attachments: Array<{
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'FILE';
    sizeBytes?: number;
    width?: number;
    height?: number;
    durationMs?: number;
  }>;
}
