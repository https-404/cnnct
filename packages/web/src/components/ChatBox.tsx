import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectActiveFriend, 
  selectMessages, 
  addMessage,
  setMessages,
  updateMessage 
} from '../feature/chat/chatSlice';
import { selectAuthUser } from '../feature/auth/auth.slice';
import { Avatar } from './ui/Avatar';
import { Input } from './ui/Input';
import { RootState } from '../store';
import { v4 as uuidv4 } from 'uuid';
import { connectSocket, sendMessage, startTyping, stopTyping, ChatMessage } from '../services/socket/socket.service';
import { messageService } from '../services/api/message.service';
import { ChatMessagePayload } from '../services/socket/socket.service';

export function ChatBox() {
  const dispatch = useDispatch();
  const activeFriend = useSelector(selectActiveFriend);
  const currentUser = useSelector((state: RootState) => selectAuthUser(state));
  const messages = useSelector((state: RootState) => 
    selectMessages(state, activeFriend?.id)
  );
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<Array<{ url: string; type: string; fileName: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize socket connection (only once)
  useEffect(() => {
    if (!currentUser?.id) return;

    // Update socket callbacks when activeFriend changes
    const socketCallbacks = {
      onMessage: (message: ChatMessage) => {
        // Handle received message - only for messages where current user is the receiver
        // Don't handle messages where current user is the sender (those are handled via message:sent)
        const isReceivedMessage = message.receiverId === currentUser.id;
        const isFromActiveFriend = message.senderId === activeFriend?.id;
        
        // Only add if we received it (not sent by us) and it's from active friend
        if (isReceivedMessage && isFromActiveFriend && activeFriend?.id) {
          const chatId = activeFriend.id;
          
          dispatch(addMessage({
            friendId: chatId as string,
            message: {
              id: message.id,
              senderId: message.senderId,
              text: message.text,
              content: message.text,
              timestamp: message.createdAt,
              createdAt: message.createdAt,
              messageType: message.messageType,
              attachments: message.attachments?.map(att => ({
                id: att.id,
                url: att.url,
                type: att.type as any,
                sizeBytes: att.sizeBytes,
                width: att.width,
                height: att.height,
                durationMs: att.durationMs,
                fileName: att.fileName,
              })) || [],
            }
          }));
          
          // Scroll to bottom
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      },
      onMessageSent: (message: ChatMessage) => {
        // Update optimistic message with real message
        // This happens when we send a message - update the temp message with real data
        if (message.tempId && activeFriend?.id) {
          const chatId = activeFriend.id;
          
          // Check if message already exists by id (avoid duplicates)
          dispatch(updateMessage({
            friendId: chatId as string,
            tempId: message.tempId,
            message: {
              id: message.id,
              senderId: message.senderId,
              text: message.text,
              content: message.text,
              timestamp: message.createdAt,
              createdAt: message.createdAt,
              messageType: message.messageType,
              attachments: message.attachments?.map(att => ({
                id: att.id,
                url: att.url,
                type: att.type as any,
                sizeBytes: att.sizeBytes,
                width: att.width,
                height: att.height,
                durationMs: att.durationMs,
                fileName: att.fileName,
              })) || [],
            }
          }));
        }
      },
      onMessageError: (error: { tempId?: string; error: string }) => {
        console.error('Message error:', error);
        // Could show error notification here
      },
      onTypingStart: (data: { userId: string; username?: string }) => {
        setTypingUsers(prev => new Set(prev).add(data.userId));
      },
      onTypingStop: (data: { userId: string }) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      },
      onConnect: () => {
        console.log('Socket connected for chat');
      },
      onDisconnect: () => {
        console.log('Socket disconnected');
      },
    };

    // Connect socket and update callbacks if already connected
    connectSocket(socketCallbacks);

    // Don't disconnect on unmount - keep connection alive
    // return () => {
    //   disconnectSocket();
    // };
  }, [currentUser?.id, activeFriend?.id, dispatch]); // Include activeFriend to update callbacks when chat changes

  // Load messages when active friend changes
  useEffect(() => {
    if (!activeFriend?.id || !currentUser?.id) return;

    const loadMessages = async () => {
      try {
        const loadedMessages = await messageService.getMessages(activeFriend.id as string);
        // Sort messages before setting
        const sortedMessages = loadedMessages
          .map(msg => ({
            id: msg.id,
            senderId: msg.senderId,
            text: msg.text,
            content: msg.text || msg.messageType,
            timestamp: msg.createdAt,
            createdAt: msg.createdAt,
            messageType: msg.messageType,
            attachments: msg.attachments?.map(att => ({
              id: att.id,
              url: att.url,
              type: att.type as any,
              sizeBytes: att.sizeBytes,
              width: att.width,
              height: att.height,
              durationMs: att.durationMs,
              fileName: att.fileName,
            })) || [],
          }))
          .sort((a, b) => {
            const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
            const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
            return timeA - timeB;
          });
        
        dispatch(setMessages({
          friendId: activeFriend.id,
          messages: sortedMessages
        }));

        // Scroll to bottom after loading
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
  }, [activeFriend?.id, currentUser?.id, dispatch]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeFriend) {
    return null;
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeFriend?.id || !currentUser?.id) return;
    
    const text = newMessage.trim();
    const hasAttachments = attachments.length > 0;
    
    if (!text && !hasAttachments) return;

    const tempId = uuidv4();
    const tempMessage = {
      id: tempId,
      tempId,
      senderId: currentUser.id,
      text: text || undefined,
      content: text || 'Attachment',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      messageType: hasAttachments ? attachments[0].type.toUpperCase() as any : 'TEXT' as any,
      attachments: hasAttachments ? attachments.map(att => ({
        id: uuidv4(),
        url: att.url,
        type: att.type.toUpperCase() as any,
        fileName: att.fileName,
      })) : undefined,
    };

    // Optimistically add message
    dispatch(addMessage({ 
      friendId: activeFriend.id, 
      message: tempMessage
    }));

    // Send via socket
    const payload: ChatMessagePayload = {
      text: text || undefined,
      receiverId: activeFriend.id as string,
      attachments: hasAttachments ? attachments.map(att => ({
        url: att.url,
        type: att.type.toUpperCase() as any,
        fileName: att.fileName,
      })) : undefined,
      tempId,
    };

    try {
      sendMessage(payload, (response) => {
        if (!response.success) {
          // Remove optimistic message on error
          // You might want to add a removeMessage action here
          console.error('Failed to send message:', response.error);
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }

    // Clear inputs
    setNewMessage('');
    setAttachments([]);
    
    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const fileArray = Array.from(files).slice(0, 4); // Max 4 attachments
      const uploadPromises = fileArray.map(async (file) => {
        const attachment = await messageService.uploadAttachment(file);
        return {
          url: attachment.url,
          type: attachment.type.toLowerCase(),
          fileName: attachment.fileName,
        };
      });

      const uploadedAttachments = await Promise.all(uploadPromises);
      setAttachments(prev => [...prev, ...uploadedAttachments]);
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `audio-${Date.now()}.webm`, { type: 'audio/webm' });
        
        setUploading(true);
        try {
          const attachment = await messageService.uploadAttachment(audioFile);
          setAttachments(prev => [...prev, {
            url: attachment.url,
            type: 'audio',
            fileName: attachment.fileName,
          }]);
        } catch (error) {
          console.error('Failed to upload audio:', error);
          alert('Failed to upload audio. Please try again.');
        } finally {
          setUploading(false);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = chunks;
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTyping = () => {
    if (!activeFriend?.id) return;
    
    startTyping({ receiverId: activeFriend.id as string });
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping({ receiverId: activeFriend.id as string });
    }, 3000);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f0f2f5]">
      {/* Chat header */}
      <div className="flex items-center p-3 px-4 bg-[#f0f2f5] border-b border-[#e9edef] shadow-sm h-[60px]">
        <div className="flex items-center flex-1">
          <Avatar src={activeFriend.avatar || undefined} alt={activeFriend.name} className="h-10 w-10" />
          <div className="ml-4">
            <h3 className="text-base font-medium text-[#111b21]">{activeFriend.name}</h3>
            <p className="text-xs text-[#667781]">
              {typingUsers.size > 0 ? 'typing...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#54656f]">
          <button className="p-2 rounded-full hover:bg-[#e9edef]">
            <SearchIcon className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-[#e9edef]">
            <MoreVerticalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div 
        className="flex-grow overflow-y-auto p-4 space-y-2"
        style={{
          backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFbSURBVDiNpdQ9S1xRFMXxHyYjDiiKGLu0FhYWgp1fQbC0sbBJY2WlYGkVJJDKwk8gBGs7ESwtRYSAYGUTECIYYsIUwcQ7FjOD49X74jzZcDh3n7XXv/c++9yhWkO4xCy+4wvmcI5pDNbkdNUoPuIPLrCFKSzjHm/w1ivrqfCIP/UHSxjAM3zCX7zCk6a4dvpQHH/8jxhMYxfHGOskZKbH2McbMZ0n7OFlvdBMYXiFu3oCdIJR/MYBxjNhywXCatUjb3ErHmg5E/ahrLCsHpnDgAiupUzYAbbL6ooL/FLN5+iLLKxKQrYLhXSrJdEHuYZdq27BapvDDO7wGNuq0akmVhO2L3Io+wvHNTh/s+NezOEGZxn7uBjVc9ziFd4V/AeFbYhn+IGPDbcZ7OMbJhsObxUE3xcLzxXWb0XEbXAqJtlxuqj//yCa1B8b2BAp/Vc2xfN9Asg1Yj5B29JpAAAAAElFTkSuQmCC")`
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-[#54656f] mb-2">No messages yet</p>
              <p className="text-[#8696a0] text-sm">Start the conversation with {activeFriend.name}</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isSent = message.senderId === currentUser?.id;
            return (
              <div 
                key={message.id || message.tempId} 
                className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-1 px-2`}
              >
                <div 
                  className={`flex items-end gap-2 ${isSent ? 'flex-row' : 'flex-row'} max-w-[65%]`}
                >
                  {/* Avatar for received messages (on left) */}
                  {!isSent && (
                    <Avatar 
                      src={activeFriend?.avatar || undefined} 
                      alt={activeFriend?.name || 'User'} 
                      className="w-8 h-8 mb-1 flex-shrink-0"
                    />
                  )}
                  
                  <div 
                    className={`rounded-lg p-2 pt-1 pb-1 shadow-sm ${
                      isSent 
                        ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none' 
                        : 'bg-white text-[#111b21] rounded-tl-none'
                    }`}
                  >
                {/* Render attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mb-2 space-y-2">
                    {message.attachments.map((att) => (
                      <div key={att.id}>
                        {att.type === 'IMAGE' && att.url ? (
                          <img 
                            src={att.url} 
                            alt={att.fileName || 'Image'} 
                            className="max-w-full max-h-64 rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ccc" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EFailed to load%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        ) : att.type === 'VIDEO' && att.url ? (
                          <video 
                            src={att.url} 
                            controls 
                            className="max-w-full max-h-64 rounded-lg"
                          />
                        ) : att.type === 'AUDIO' && att.url ? (
                          <div className="flex items-center gap-2 p-2 bg-[#f0f2f5] rounded">
                            <audio src={att.url} controls className="flex-1" />
                            <span className="text-xs text-[#8696a0]">{att.fileName || 'Audio'}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-[#f0f2f5] rounded">
                            <DocumentIcon className="h-5 w-5 text-[#8696a0]" />
                            <a 
                              href={att.url} 
                              download={att.fileName}
                              className="text-sm text-[#111b21] hover:underline"
                            >
                              {att.fileName || 'File'}
                            </a>
                            <span className="text-xs text-[#8696a0]">
                              {att.sizeBytes ? `${(att.sizeBytes / 1024).toFixed(1)} KB` : ''}
                            </span>
                    </div>
                        )}
                  </div>
                    ))}
                  </div>
                )}
                    {/* Render text content */}
                    {(message.text || message.content) && (
                      <p className="break-words text-[15px] leading-relaxed">{message.text || message.content}</p>
                    )}
                    <div className={`flex items-center gap-1 mt-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[11px] text-[#8696a0]">
                        {formatTime(message.timestamp || message.createdAt || new Date().toISOString())}
                      </span>
                      {isSent && (
                        <CheckIcon className="h-3 w-3 text-[#8696a0]" />
                      )}
                    </div>
                  </div>
                  
                  {/* Avatar for sent messages (on right side) */}
                  {isSent && (
                    <Avatar 
                      src={currentUser?.avatar || undefined} 
                      alt={currentUser?.username || 'You'} 
                      className="w-8 h-8 mb-1 flex-shrink-0"
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 bg-white border-t border-[#e9edef] flex gap-2 flex-wrap">
          {attachments.map((att, index) => (
            <div key={index} className="relative">
              {att.type === 'image' && att.url ? (
                <div className="relative">
                  <img src={att.url} alt={att.fileName} className="w-20 h-20 object-cover rounded" />
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="relative bg-[#f0f2f5] rounded p-2 w-20 h-20 flex items-center justify-center">
                  <DocumentIcon className="h-8 w-8 text-[#8696a0]" />
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                  <p className="text-xs text-[#8696a0] truncate w-full absolute bottom-1 px-1">{att.fileName}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Message input */}
      <div className="p-3 bg-[#f0f2f5] border-t border-[#e9edef] flex items-center gap-2">
        <button 
          onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
          className="p-2 text-[#54656f] rounded-full hover:bg-[#e9edef]"
        >
          <EmojiIcon className="h-6 w-6" />
        </button>
        
        <div className="relative">
        <button 
          onClick={handleFileUpload} 
            disabled={uploading || attachments.length >= 4}
            className="p-2 text-[#54656f] rounded-full hover:bg-[#e9edef] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach file (max 4)"
        >
          <AttachmentIcon className="h-6 w-6" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            multiple
            disabled={uploading || attachments.length >= 4}
          />
        </div>

        <button
          onMouseDown={handleStartRecording}
          onMouseUp={handleStopRecording}
          onTouchStart={handleStartRecording}
          onTouchEnd={handleStopRecording}
          disabled={uploading || isRecording}
          className={`p-2 rounded-full ${
            isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'text-[#54656f] hover:bg-[#e9edef]'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Hold to record audio"
        >
          <MicrophoneIcon className="h-6 w-6" />
        </button>
        
        <form onSubmit={handleSendMessage} className="flex-1 flex">
          <Input
            type="text"
            placeholder={uploading ? "Uploading..." : "Type a message"}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={uploading}
            className="flex-1 rounded-lg bg-white border-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50"
          />
        </form>
        
        <button 
          onClick={() => handleSendMessage()} 
          disabled={(!newMessage.trim() && attachments.length === 0) || uploading} 
          className={`p-2 rounded-full ${
            (newMessage.trim() || attachments.length > 0) && !uploading
              ? 'text-[#54656f] hover:bg-[#e9edef]' 
              : 'text-[#8696a0] cursor-not-allowed'
          }`}
        >
          {(newMessage.trim() || attachments.length > 0) && !uploading ? (
            <SendIcon className="h-6 w-6" />
          ) : uploading ? (
            <div className="h-6 w-6 border-2 border-[#8696a0] border-t-transparent rounded-full animate-spin" />
          ) : (
            <MicrophoneIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function EmojiIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function AttachmentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function MicrophoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function MoreVerticalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
