import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectActiveFriend, 
  selectMessages, 
  addMessage 
} from '../feature/chat/chatSlice';
import { Button } from './ui/button';
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
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center p-3 border-b bg-card">
        <Avatar src={activeFriend.avatar} alt={activeFriend.name} />
        <div className="ml-3">
          <h3 className="text-base font-medium text-foreground">{activeFriend.name}</h3>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === 'current-user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <p className="break-words">{message.content}</p>
                <span className="text-xs opacity-75 block text-right mt-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2 bg-card">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" disabled={!newMessage.trim()}>
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
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
