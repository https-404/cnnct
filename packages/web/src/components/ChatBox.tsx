import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectActiveFriend, 
  selectMessages, 
  addMessage 
} from '../feature/chat/chatSlice';
import { Avatar } from './ui/Avatar';
import { Input } from './ui/Input';
import { RootState } from '../store';
import { v4 as uuidv4 } from 'uuid';

export function ChatBox() {
  const dispatch = useDispatch();
  const activeFriend = useSelector(selectActiveFriend);
  const messages = useSelector((state: RootState) => 
    selectMessages(state, activeFriend?.id)
  );
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!activeFriend) {
    return null;
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      id: uuidv4(),
      senderId: 'current-user', // This would be the actual user ID in a real app
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage({ 
      friendId: activeFriend.id, 
      message 
    }));
    
    setNewMessage('');
    
    // Scroll to bottom after sending message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you would upload the file to a server here
      // For now, we'll just create a message with the file name
      const file = files[0];
      const fileMessage = {
        id: uuidv4(),
        senderId: 'current-user',
        content: `📎 File: ${file.name}`,
        timestamp: new Date().toISOString(),
        fileType: file.type,
        fileName: file.name
      };
      
      dispatch(addMessage({
        friendId: activeFriend.id,
        message: fileMessage
      }));
      
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f0f2f5]">
      {/* Chat header */}
      <div className="flex items-center p-3 px-4 bg-[#f0f2f5] border-b border-[#e9edef] shadow-sm h-[60px]">
        <div className="flex items-center flex-1">
          <Avatar src={activeFriend.avatar || undefined} alt={activeFriend.name} className="h-10 w-10" />
          <div className="ml-4">
            <h3 className="text-base font-medium text-[#111b21]">{activeFriend.name}</h3>
            <p className="text-xs text-[#667781]">Online</p>
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
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[65%] rounded-lg p-2 pt-1 shadow-sm ${
                  message.senderId === 'current-user' 
                    ? 'bg-[#d9fdd3] text-[#111b21]' 
                    : 'bg-white text-[#111b21]'
                }`}
              >
                {message.fileType && message.fileType.startsWith('image/') ? (
                  <div className="mb-1">
                    <div className="bg-[#f0f2f5] rounded p-1 inline-block">
                      <ImageIcon className="h-32 w-32 text-[#8696a0]" />
                    </div>
                    <p className="text-xs text-[#8696a0] mt-1">{message.fileName}</p>
                  </div>
                ) : message.fileType ? (
                  <div className="flex items-center gap-2 mb-1">
                    <DocumentIcon className="h-5 w-5 text-[#8696a0]" />
                    <span className="text-sm text-[#111b21]">{message.fileName}</span>
                  </div>
                ) : (
                  <p className="break-words text-[15px]">{message.content}</p>
                )}
                <span className="text-[11px] text-[#8696a0] block text-right mt-1">
                  {formatTime(message.timestamp)}
                  {message.senderId === 'current-user' && (
                    <CheckIcon className="h-3 w-3 inline ml-1 text-[#53bdeb]" />
                  )}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 bg-[#f0f2f5] border-t border-[#e9edef] flex items-center gap-2">
        <button 
          onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
          className="p-2 text-[#54656f] rounded-full hover:bg-[#e9edef]"
        >
          <EmojiIcon className="h-6 w-6" />
        </button>
        
        <button 
          onClick={handleFileUpload} 
          className="p-2 text-[#54656f] rounded-full hover:bg-[#e9edef]"
        >
          <AttachmentIcon className="h-6 w-6" />
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
        </button>
        
        <form onSubmit={handleSendMessage} className="flex-1 flex">
          <Input
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-lg bg-white border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </form>
        
        <button 
          onClick={handleSendMessage} 
          disabled={!newMessage.trim()} 
          className={`p-2 rounded-full ${
            newMessage.trim() ? 'text-[#54656f] hover:bg-[#e9edef]' : 'text-[#8696a0]'
          }`}
        >
          {newMessage.trim() ? (
            <SendIcon className="h-6 w-6" />
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
