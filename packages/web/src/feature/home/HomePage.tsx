import { TopNavBar } from "../../components/TopNavBar";
import { FriendList } from "../../components/FriendList";
import { ChatPlaceholder } from "../../components/ChatPlaceholder";
import { RecommendedFriends } from "../../components/RecommendedFriends";
import { SearchBar } from "../../components/ui/SearchBar";
import { useState } from "react";

export default function HomePage() {
  const [search, setSearch] = useState("");
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopNavBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Friends/Contacts */}
        <aside className="w-72 border-r bg-white flex flex-col">
          <FriendList />
        </aside>
        {/* Center: Chat placeholder */}
        <main className="flex-1 flex items-center justify-center">
          <ChatPlaceholder />
        </main>
        {/* Right: Search + Recommended Friends */}
        <aside className="w-80 border-l bg-white flex flex-col p-4 gap-4">
          <SearchBar value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." />
          <RecommendedFriends />
        </aside>
      </div>
    </div>
  );
}
