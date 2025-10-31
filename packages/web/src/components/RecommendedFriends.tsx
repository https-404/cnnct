import { useState, useEffect } from "react";
import { Card } from "./ui/Card";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/button";
import { userService } from "../services/api/user.service";
import { friendService } from "../services/api/friend.service";
import { requestService } from "../services/api/request.service";
import { User } from "../types/user.type";

export function RecommendedFriends() {
  const [recommended, setRecommended] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        // Get current friends to exclude them
        const friends = await friendService.getFriends();
        const friendIds = new Set(friends.map(f => f.id));
        
        // Search for users with common usernames (you can make this smarter)
        // For now, we'll try to find users that aren't friends
        // This is a simple approach - in production, you'd want a proper recommendation endpoint
        const searchQueries = ['a', 'b', 'c', 'd', 'e']; // Try common letters
        const allUsers: User[] = [];
        
        for (const query of searchQueries) {
          try {
            const results = await userService.searchUsers(query);
            allUsers.push(...results.filter(user => !friendIds.has(user.id)));
            if (allUsers.length >= 3) break;
          } catch (error) {
            // Continue if search fails
          }
        }
        
        // Remove duplicates and take first 3
        const uniqueUsers = Array.from(
          new Map(allUsers.map(user => [user.id, user])).values()
        ).slice(0, 3);
        
        setRecommended(uniqueUsers);
      } catch (error) {
        console.error("Failed to fetch recommended friends:", error);
        setRecommended([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  const handleAddFriend = async (userId: string) => {
    try {
      await requestService.sendRequest(userId);
      setRecommended(prev => prev.filter(f => f.id !== userId));
    } catch (error: any) {
      console.error("Failed to send friend request:", error);
      alert(error.message || "Failed to send friend request");
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-4">People You May Know</h3>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </Card>
    );
  }

  if (recommended.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-4">People You May Know</h3>
        <p className="text-sm text-muted-foreground">No recommendations at this time</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-foreground mb-4">People You May Know</h3>
      <div className="flex flex-col gap-4">
        {recommended.map(friend => (
          <div key={friend.id} className="flex items-center gap-3">
            <Avatar src={friend.avatar || undefined} alt={friend.username} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{friend.username}</p>
              <p className="text-xs text-muted-foreground">{friend.email || "Member"}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="whitespace-nowrap"
              onClick={() => handleAddFriend(friend.id)}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
