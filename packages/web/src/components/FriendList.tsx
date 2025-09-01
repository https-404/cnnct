import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card } from "./ui/Card";
import { SearchBar } from "./ui/SearchBar";
import { Avatar } from "./ui/Avatar";
import { setActiveFriend } from "../feature/chat/chatSlice";

// Enhanced dummy data with more details
const friends = [
  { id: "1", name: "Alice Johnson", avatar: undefined, lastMessage: "Hey, how are you doing?", lastMessageTime: "10:30 AM" },
  { id: "2", name: "Bob Smith", avatar: undefined, lastMessage: "Can you send me that file?", lastMessageTime: "Yesterday" },
  { id: "3", name: "Charlie Brown", avatar: undefined, lastMessage: "Let's meet up tomorrow", lastMessageTime: "Monday" },
  { id: "4", name: "Diana Prince", avatar: undefined, lastMessage: "Thanks for your help!", lastMessageTime: "Tuesday" },
  { id: "5", name: "Ethan Hunt", avatar: undefined, lastMessage: "Mission accomplished!", lastMessageTime: "08/28" },
];

export function FriendList() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const filtered = friends.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectFriend = (friend: typeof friends[0]) => {
    dispatch(setActiveFriend(friend));
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
        {filtered.length === 0 ? (
          <div className="p-4 text-muted-foreground">No friends found.</div>
        ) : (
          filtered.map(friend => (
            <div 
              key={friend.id} 
              className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer border-b border-border/40"
              onClick={() => handleSelectFriend(friend)}
            >
              <Avatar src={friend.avatar} alt={friend.name} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-foreground truncate">{friend.name}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{friend.lastMessageTime}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">{friend.lastMessage}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
