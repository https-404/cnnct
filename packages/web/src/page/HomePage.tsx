import { useState } from "react";
import { useSelector } from "react-redux";
import { TopNavBar } from "../components/TopNavBar";
import { FriendList } from "../components/FriendList";
import { ChatPlaceholder } from "../components/ChatPlaceholder";
import { ChatBox } from "../components/ChatBox";
import { RecommendedFriends } from "../components/RecommendedFriends";
import { SearchBar } from "../components/ui/SearchBar";
import { selectActiveFriend } from "../feature/chat/chatSlice";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const activeFriend = useSelector(selectActiveFriend);
  
  return (
    <div className="h-screen flex flex-col bg-background">
      <TopNavBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Friends/Contacts */}
        <aside className="w-80 border-r border-border bg-card flex flex-col">
          <FriendList />
        </aside>
        
        {/* Center: Chat area */}
        <main className="flex-1 flex items-center justify-center p-4 bg-background">
          {activeFriend ? <ChatBox /> : <ChatPlaceholder />}
        </main>
        
        {/* Right: Search + Recommended Friends */}
        <aside className="w-80 border-l border-border bg-card flex flex-col p-4 gap-4">
          <SearchBar 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search users..." 
          />
          <RecommendedFriends />
        </aside>
      </div>
    </div>
  );
}
