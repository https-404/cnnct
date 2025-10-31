import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card } from "./ui/Card";
import { SearchBar } from "./ui/SearchBar";
import { Avatar } from "./ui/Avatar";
import { setActiveFriend } from "../feature/chat/chatSlice";
import { friendService } from "../services/api/friend.service";
import { messageService } from "../services/api/message.service";
import { User } from "../types/user.type";
import { Message } from "../services/api/message.service";

type FriendWithLastMessage = User & {
  lastMessage?: string;
  lastMessageTime?: string;
};

export function FriendList({ refreshTrigger }: { refreshTrigger?: number }) {
  const dispatch = useDispatch();
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

  return (
    <Card className="p-0 h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-3 text-foreground">Chats</h2>
        <SearchBar 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search chats..." 
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-muted-foreground">Loading friends...</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-muted-foreground">No friends found.</div>
        ) : (
          filtered.map(friend => (
            <div 
              key={friend.id} 
              className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer border-b border-border/40"
              onClick={() => handleSelectFriend(friend)}
            >
              <Avatar src={friend.avatar || undefined} alt={friend.username} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-foreground truncate">{friend.username}</span>
                  {friend.lastMessageTime && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{friend.lastMessageTime}</span>
                  )}
                </div>
                {friend.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate mt-1">{friend.lastMessage}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
