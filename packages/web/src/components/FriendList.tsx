import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "./ui/Avatar";
import { 
  setActiveFriend, 
  selectIsUserOnline,
  selectUnreadCount,
  selectLastMessage,
  selectMessages
} from "../feature/chat/chatSlice";
import { selectAuthUser } from "../feature/auth/auth.slice";
import { friendService } from "../services/api/friend.service";
import { messageService } from "../services/api/message.service";
import { User } from "../types/user.type";
import { Message } from "../services/api/message.service";
import { RootState } from "../store";

type FriendWithLastMessage = User & {
  lastMessage?: string;
  lastMessageTime?: string;
};

export function FriendList({ refreshTrigger }: { refreshTrigger?: number }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => selectAuthUser(state));
  const onlineUsersSet = new Set(useSelector((state: RootState) => state.chat.onlineUsers));
  const messages = useSelector((state: RootState) => state.chat.messages);
  const lastMessages = useSelector((state: RootState) => state.chat.lastMessages);
  const activeFriend = useSelector((state: RootState) => state.chat.activeFriend);
  const unreadCounts = useSelector((state: RootState) => state.chat.unreadCounts);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState<FriendWithLastMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const friendsList = await friendService.getFriends();
      
      // Fetch last message for each friend
      const friendsWithMessages = await Promise.all(
        friendsList.map(async (friend) => {
          try {
            const messages = await messageService.getMessages(friend.id, 1, 1);
            const lastMessage = messages[0];
            if (lastMessage) {
              const date = new Date(lastMessage.createdAt);
              const now = new Date();
              const diffTime = now.getTime() - date.getTime();
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              
              let lastMessageTime = "";
              if (diffDays === 0) {
                lastMessageTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
              } else if (diffDays === 1) {
                lastMessageTime = "Yesterday";
              } else if (diffDays < 7) {
                lastMessageTime = date.toLocaleDateString('en-US', { weekday: 'short' });
              } else {
                lastMessageTime = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
              }
              
              return {
                ...friend,
                lastMessage: lastMessage.text || "Media",
                lastMessageTime,
              };
            }
            return friend;
          } catch (error) {
            // If no messages, just return friend without last message
            return friend;
          }
        })
      );
      
      setFriends(friendsWithMessages);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [refreshTrigger]);

  // Update last messages from Redux state when new messages arrive
  useEffect(() => {
    setFriends(prevFriends => {
      return prevFriends.map(friend => {
        const friendId = String(friend.id);
        const lastMsg = lastMessages[friendId];
        
        if (lastMsg) {
          const date = new Date(lastMsg.timestamp);
          const now = new Date();
          const diffTime = now.getTime() - date.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          let lastMessageTime = "";
          if (diffDays === 0) {
            lastMessageTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          } else if (diffDays === 1) {
            lastMessageTime = "Yesterday";
          } else if (diffDays < 7) {
            lastMessageTime = date.toLocaleDateString('en-US', { weekday: 'short' });
          } else {
            lastMessageTime = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
          }

          return {
            ...friend,
            lastMessage: lastMsg.text || "Media",
            lastMessageTime,
          };
        }
        return friend;
      });
    });
  }, [lastMessages]);

  const filtered = friends.filter(f => 
    f.username.toLowerCase().includes(search.toLowerCase()) ||
    (f.email && f.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectFriend = (friend: FriendWithLastMessage) => {
    dispatch(setActiveFriend({
      id: friend.id,
      name: friend.username,
      avatar: friend.avatar || undefined,
    }));
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
    }
  };

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

  return (
    <div className="p-0 h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-[#667781] text-sm">Loading friends...</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-[#667781] text-sm">No friends found.</div>
        ) : (
          filtered.map(friend => {
            const isFriendOnline = onlineUsersSet.has(String(friend.id));
            const unreadCount = unreadCounts[friend.id] || 0;
            const lastMsg = lastMessages[friend.id];
            const isActiveChat = activeFriend?.id === friend.id;
            const hasUnread = unreadCount > 0 && !isActiveChat;
            
            // Use Redux last message if available, otherwise use local state
            const displayLastMessage = lastMsg?.text || friend.lastMessage;
            const displayLastMessageTime = lastMsg?.timestamp 
              ? formatLastMessageTime(lastMsg.timestamp) 
              : friend.lastMessageTime;
            
            return (
              <div 
                key={friend.id} 
                className={`flex items-center gap-3 px-4 py-2.5 hover:bg-[#f5f6f6] transition-colors cursor-pointer border-b border-[#e9edef] ${
                  isActiveChat ? 'bg-[#f0f2f5]' : ''
                }`}
                onClick={() => handleSelectFriend(friend)}
              >
                <div className="relative flex-shrink-0">
                  <Avatar src={friend.avatar || undefined} alt={friend.username} className="w-12 h-12" />
                  {isFriendOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#53bdeb] border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-[17px] truncate ${hasUnread ? 'text-[#111b21] font-semibold' : 'text-[#111b21] font-medium'}`}>
                      {friend.username}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {displayLastMessageTime && (
                        <span className={`text-xs whitespace-nowrap ${hasUnread ? 'text-[#111b21] font-medium' : 'text-[#667781]'}`}>
                          {displayLastMessageTime}
                        </span>
                      )}
                      {hasUnread && (
                        <span className="bg-[#25d366] text-white text-xs font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  {displayLastMessage && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {lastMsg?.senderId && String(lastMsg.senderId) === String(currentUser?.id) && (
                        <CheckIcon className="h-4 w-4 text-[#8696a0] flex-shrink-0" />
                      )}
                      <p className={`text-sm truncate flex-1 ${hasUnread ? 'text-[#111b21] font-medium' : 'text-[#667781]'}`}>
                        {displayLastMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
