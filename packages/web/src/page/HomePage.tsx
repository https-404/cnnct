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
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(true);
  const activeFriend = useSelector(selectActiveFriend);
  
  return (
    <div className="h-screen flex flex-col bg-[#f0f2f5]">
      <TopNavBar className="h-16 shadow-sm z-10" />
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Friends/Contacts with search */}
        <aside className="w-[350px] border-r border-[#e9edef] bg-white flex flex-col">
          <div className="p-3 bg-[#f0f2f5] border-b border-[#e9edef]">
            <SearchBar 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search or start new chat" 
              className="bg-white rounded-lg"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <FriendList />
          </div>
        </aside>
        
        {/* Center: Chat area (takes all available space) */}
        <main className={`flex-1 flex bg-[#efeae2] relative ${showContactInfo || showFriendRequests ? 'border-r border-[#e9edef]' : ''}`}>
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{
              backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFbSURBVDiNpdQ9S1xRFMXxHyYjDiiKGLu0FhYWgp1fQbC0sbBJY2WlYGkVJJDKwk8gBGs7ESwtRYSAYGUTECIYYsIUwcQ7FjOD49X74jzZcDh3n7XXv/c++9yhWkO4xCy+4wvmcI5pDNbkdNUoPuIPLrCFKSzjHm/w1ivrqfCIP/UHSxjAM3zCX7zCk6a4dvpQHH/8jxhMYxfHGOskZKbH2McbMZ0n7OFlvdBMYXiFu3oCdIJR/MYBxjNhywXCatUjb3ErHmg5E/ahrLCsHpnDgAiupUzYAbbL6ooL/FLN5+iLLKxKQrYLhXSrJdEHuYZdq27BapvDDO7wGNuq0akmVhO2L3Io+wvHNTh/s+NezOEGZxn7uBjVc9ziFd4V/AeFbYhn+IGPDbcZ7OMbJhsObxUE3xcLzxXWb0XEbXAqJtlxuqj//yCa1B8b2BAp/Vc2xfN9Asg1Yj5B29JpAAAAAElFTkSuQmCC")`
            }}
          ></div>
          <div className="flex-1 flex">
            {activeFriend ? <ChatBox /> : <ChatPlaceholder />}
          </div>
        </main>
        
        {/* Right sidebar - Add friends, contact info */}
        {(showContactInfo || showFriendRequests) && (
          <aside className="w-[320px] bg-white flex flex-col">
            <div className="p-4 border-b border-[#e9edef] flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                {showContactInfo ? "Contact Info" : "Add Friends"}
              </h3>
              <button 
                onClick={() => {
                  if (showContactInfo) setShowContactInfo(false);
                  else setShowFriendRequests(false);
                }}
                className="p-2 rounded-full hover:bg-[#f0f2f5] text-[#54656f]"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {showContactInfo && activeFriend ? (
                <div className="p-4">
                  <div className="flex flex-col items-center mb-6 pt-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                      <img 
                        src={activeFriend.avatar || "https://via.placeholder.com/150"} 
                        alt={activeFriend.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-medium text-[#111b21]">{activeFriend.name}</h2>
                    <p className="text-sm text-[#667781] mt-1">Online</p>
                  </div>
                  
                  <div className="border-t border-[#e9edef] pt-4">
                    <h4 className="text-[#008069] uppercase text-xs font-medium mb-4">About</h4>
                    <p className="text-[#111b21]">Hey there! I'm using ChatApp.</p>
                  </div>
                  
                  <div className="border-t border-[#e9edef] mt-6 pt-4">
                    <h4 className="text-[#008069] uppercase text-xs font-medium mb-4">Media, Links and Docs</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="aspect-square bg-[#f0f2f5] rounded-md"></div>
                      <div className="aspect-square bg-[#f0f2f5] rounded-md"></div>
                      <div className="aspect-square bg-[#f0f2f5] rounded-md"></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-[#e9edef] pt-4">
                    <button className="flex items-center gap-4 py-3 w-full hover:bg-[#f0f2f5] rounded-md px-2 text-[#ef4444]">
                      <BlockIcon className="h-5 w-5" />
                      <span>Block {activeFriend.name}</span>
                    </button>
                    <button className="flex items-center gap-4 py-3 w-full hover:bg-[#f0f2f5] rounded-md px-2 text-[#ef4444]">
                      <ThumbDownIcon className="h-5 w-5" />
                      <span>Report {activeFriend.name}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {/* Add friends section */}
                  <div className="mb-6">
                    <h4 className="text-[#008069] uppercase text-xs font-medium mb-3">Add Friends</h4>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search by username or email" 
                        className="w-full py-2 px-4 pr-10 rounded-md border border-[#e9edef] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54656f]">
                        <SearchIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <button className="w-full mt-3 py-2 bg-[#00a884] text-white rounded-md font-medium">
                      Search
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-[#008069] uppercase text-xs font-medium mb-3">Friend Requests</h4>
                    <div className="space-y-2">
                      <FriendRequestItem 
                        name="Alex Johnson" 
                        time="2h ago" 
                        avatar="https://via.placeholder.com/150"
                      />
                      <FriendRequestItem 
                        name="Emma Wilson" 
                        time="1d ago" 
                        avatar="https://via.placeholder.com/150"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-[#008069] uppercase text-xs font-medium mb-3">Recommended Friends</h4>
                    <RecommendedFriends />
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom actions */}
            <div className="p-4 border-t border-[#e9edef] flex justify-between">
              <button 
                onClick={() => {
                  setShowContactInfo(!showContactInfo);
                  setShowFriendRequests(!showFriendRequests);
                }}
                className="py-2 px-4 bg-[#f0f2f5] hover:bg-[#e9edef] rounded text-[#54656f] font-medium"
              >
                {showContactInfo ? "Show Friend Requests" : "Contact Info"}
              </button>
            </div>
          </aside>
        )}
        
        {/* Toggle button for sidebar when hidden */}
        {!showContactInfo && !showFriendRequests && (
          <button 
            onClick={() => setShowFriendRequests(true)}
            className="absolute right-4 bottom-4 w-14 h-14 rounded-full bg-[#00a884] text-white shadow-lg flex items-center justify-center hover:bg-[#008069] transition-colors z-10"
          >
            <UserPlusIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}

// Friend Request Item Component
function FriendRequestItem({ name, time, avatar }: { name: string; time: string; avatar: string }) {
  return (
    <div className="flex items-center p-3 rounded-lg hover:bg-[#f0f2f5]">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full mr-3" />
      <div className="flex-1">
        <h4 className="font-medium text-[#111b21]">{name}</h4>
        <p className="text-sm text-[#667781]">{time}</p>
      </div>
      <div className="flex gap-2">
        <button className="p-2 rounded-full bg-[#00a884] text-white">
          <CheckIcon className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full bg-[#f0f2f5] text-[#54656f]">
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// Icons
function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function BlockIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

function ThumbDownIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
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
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function UserPlusIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}
