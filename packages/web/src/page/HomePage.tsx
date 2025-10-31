import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TopNavBar } from "../components/TopNavBar";
import { FriendList } from "../components/FriendList";
import { ChatPlaceholder } from "../components/ChatPlaceholder";
import { ChatBox } from "../components/ChatBox";
import { RecommendedFriends } from "../components/RecommendedFriends";
import { SearchBar } from "../components/ui/SearchBar";
import { Avatar } from "../components/ui/Avatar";
import { selectActiveFriend, setUserOnline, setUserOffline, setOnlineUsers } from "../feature/chat/chatSlice";
import { requestService, FriendRequest } from "../services/api/request.service";
import { userService } from "../services/api/user.service";
import { User } from "../types/user.type";
import { connectSocket } from "../services/socket/socket.service";
import { selectAuthUser } from "../feature/auth/auth.slice";
import { RootState } from "../store";

export default function HomePage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => selectAuthUser(state));
  const [search, setSearch] = useState("");
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(true);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [friendListRefreshTrigger, setFriendListRefreshTrigger] = useState(0);
  const activeFriend = useSelector(selectActiveFriend);

  // Close Contact Info when chat is closed
  useEffect(() => {
    if (!activeFriend && showContactInfo) {
      setShowContactInfo(false);
    }
  }, [activeFriend, showContactInfo]);

  // Initialize socket connection for online status tracking
  useEffect(() => {
    if (!currentUser?.id) return;

    // Initialize socket connection at app level for online status
    connectSocket({
      onUserOnline: (data: { userId: string }) => {
        dispatch(setUserOnline(data.userId));
      },
      onUserOffline: (data: { userId: string }) => {
        dispatch(setUserOffline(data.userId));
      },
      onFriendsOnline: (data: { userIds: string[] }) => {
        dispatch(setOnlineUsers(data.userIds));
      },
    });
  }, [currentUser?.id, dispatch]);

  // Fetch friend requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestService.getRequests();
        setFriendRequests(response.received || []);
      } catch (error) {
        console.error("Failed to fetch friend requests:", error);
      }
    };
    fetchRequests();
  }, []);

  // Handle user search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearching(true);
      const results = await userService.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Failed to search users:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Handle friend request actions
  const handleAcceptRequest = async (requestId: string) => {
    // Optimistically update UI
    const requestToAccept = friendRequests.find(r => r.id === requestId);
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    
    try {
      await requestService.acceptRequest(requestId);
      
      // Refresh friend requests
      const response = await requestService.getRequests();
      setFriendRequests(response.received || []);
      
      // Refresh friend list to show newly added friend
      setFriendListRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Failed to accept request:", error);
      // Restore request on error
      if (requestToAccept) {
        setFriendRequests(prev => [...prev, requestToAccept]);
      }
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    // Optimistically update UI
    const requestToReject = friendRequests.find(r => r.id === requestId);
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    
    try {
      await requestService.rejectRequest(requestId);
      
      // Refresh friend requests to make sure UI is in sync
      const response = await requestService.getRequests();
      setFriendRequests(response.received || []);
    } catch (error) {
      console.error("Failed to reject request:", error);
      // Restore request on error
      if (requestToReject) {
        setFriendRequests(prev => [...prev, requestToReject]);
      }
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "1d ago";
    return `${diffDays}d ago`;
  };
  
  return (
    <div className="h-screen flex flex-col bg-[#f0f2f5]">
      <TopNavBar className="h-16 shadow-sm z-10" />
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Friends/Contacts with search */}
        <aside className="w-[360px] border-r border-[#e9edef] bg-white flex flex-col min-w-0">
          <div className="p-3 bg-[#f0f2f5] border-b border-[#e9edef]">
            <SearchBar 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search or start new chat" 
              className="bg-white rounded-lg px-3 py-2 text-sm border-0 focus-visible:ring-0"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <FriendList refreshTrigger={friendListRefreshTrigger} />
          </div>
        </aside>
        
        {/* Center: Chat area (takes all available space) */}
        <main className={`flex-1 flex bg-[#efeae2] relative ${showContactInfo || showFriendRequests ? 'border-r border-[#e9edef]' : ''}`}>
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{
              backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFbSURBVDiNpdQ9S1xRFMXxHyYjDiiKGLu0FhYWgp1fQbC0sbBJY2WlYGkVJJDKwk8gBGs7ESwtRYSAYGUTECIYYsIUwcQ7FjOD49X74jzZcDh3n7XXv/c++9yhWkO4xCy+4wvmcI5pDNbkdNUoPuIPLrCFKSzjHm/w1ivrqfCIP/UHSxjAM3zCX7zCk6a4dvpQHH/8jxhMYxfHGOskZKbH2McbMZ0n7OFlvdBMYXiFu3oCdIJR/MYBxjNhywXCatUjb3ErHmg5E/ahrLCsHpnDgAiupUzYAbbL6ooL/FLN5+iLLKxKQrYLhXSrJdEHuYZdq27BapvDDO7wGNuq0akmVhO2L3Io+wvHNTh/s+NezOEGZxn7uBjVc9ziFd4V/AeFbYhn+IGPDbcZ7OMbJhsObxUE3xcLzxXWb0XEbXAqJtlxuqj//yCa1B8b2BAp/Vc2xfN9Asg1Yj5B29JpAAAAAElFTkSuQmCC")`
            }}
          ></div>
          <div className="flex-1 flex z-10">
            {activeFriend ? (
              <ChatBox onOpenContactInfo={() => {
                setShowContactInfo(true);
                setShowFriendRequests(false);
              }} />
            ) : (
              <ChatPlaceholder />
            )}
          </div>
        </main>
        
        {/* Right sidebar - Add friends, contact info */}
        {(showContactInfo || showFriendRequests) && (
          <aside className="w-[320px] bg-white flex flex-col">
            <div className="p-4 border-b border-[#e9edef] flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                {showContactInfo && activeFriend ? "Contact Info" : "Add Friends"}
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
                    <Avatar
                      src={activeFriend.avatar || undefined}
                      alt={activeFriend.name}
                      className="w-32 h-32 mb-4 border-4 border-gray-200"
                    />
                    <h2 className="text-xl font-medium text-[#111b21]">{activeFriend.name}</h2>
                    <p className="text-sm text-[#667781] mt-1">Online</p>
                  </div>
                  
                  <div className="border-t border-[#e9edef] pt-4">
                    <h4 className="text-[#008069] uppercase text-xs font-medium mb-4">About</h4>
                    <p className="text-[#111b21]">Hey there! I'm using cnnct.</p>
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full py-2 px-4 pr-10 rounded-md border border-[#e9edef] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                      />
                      <button 
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54656f]"
                      >
                        <SearchIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <button 
                      onClick={handleSearch}
                      disabled={searching}
                      className="w-full mt-3 py-2 bg-[#00a884] text-white rounded-md font-medium disabled:opacity-50"
                    >
                      {searching ? "Searching..." : "Search"}
                    </button>
                    
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {searchResults.map(user => (
                          <SearchResultItem key={user.id} user={user} />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-[#008069] uppercase text-xs font-medium mb-3">Friend Requests</h4>
                    <div className="space-y-2">
                      {friendRequests.length === 0 ? (
                        <p className="text-sm text-[#667781] py-2">No pending requests</p>
                      ) : (
                        friendRequests.map(request => (
                          <FriendRequestItem 
                            key={request.id}
                            name={request.requester?.username || "Unknown"}
                            time={formatTimeAgo(request.createdAt)}
                            avatar={request.requester?.avatar || undefined}
                            onAccept={() => handleAcceptRequest(request.id)}
                            onReject={() => handleRejectRequest(request.id)}
                          />
                        ))
                      )}
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
              {activeFriend && (
                <button 
                  onClick={() => {
                    setShowContactInfo(!showContactInfo);
                    setShowFriendRequests(!showFriendRequests);
                  }}
                  className="py-2 px-4 bg-[#f0f2f5] hover:bg-[#e9edef] rounded text-[#54656f] font-medium"
                >
                  {showContactInfo && activeFriend ? "Show Friend Requests" : "Contact Info"}
                </button>
              )}
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
function FriendRequestItem({ 
  name, 
  time, 
  avatar, 
  onAccept, 
  onReject 
}: { 
  name: string; 
  time: string; 
  avatar?: string;
  onAccept?: () => void;
  onReject?: () => void;
}) {
  return (
    <div className="flex items-center p-3 rounded-lg hover:bg-[#f0f2f5]">
      <Avatar 
        src={avatar || undefined} 
        alt={name} 
        className="w-12 h-12 mr-3" 
      />
      <div className="flex-1">
        <h4 className="font-medium text-[#111b21]">{name}</h4>
        <p className="text-sm text-[#667781]">{time}</p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={onAccept}
          className="p-2 rounded-full bg-[#00a884] text-white hover:bg-[#008069] transition-colors"
        >
          <CheckIcon className="h-5 w-5" />
        </button>
        <button 
          onClick={onReject}
          className="p-2 rounded-full bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef] transition-colors"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// Search Result Item Component
function SearchResultItem({ user }: { user: User }) {
  const handleAddFriend = async () => {
    try {
      await requestService.sendRequest(user.id);
      // Show success - you might want to add a toast notification here
      alert("Friend request sent!");
    } catch (error: any) {
      console.error("Failed to send friend request:", error);
      alert(error.message || "Failed to send friend request");
    }
  };

  return (
    <div className="flex items-center p-3 rounded-lg hover:bg-[#f0f2f5] border border-[#e9edef]">
      <Avatar 
        src={user.avatar || undefined} 
        alt={user.username} 
        className="w-10 h-10 mr-3" 
      />
      <div className="flex-1">
        <h4 className="font-medium text-[#111b21]">{user.username}</h4>
        {user.email && <p className="text-xs text-[#667781]">{user.email}</p>}
      </div>
      <button 
        onClick={handleAddFriend}
        className="px-3 py-1 bg-[#00a884] text-white rounded-md text-sm hover:bg-[#008069] transition-colors"
      >
        Add
      </button>
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
