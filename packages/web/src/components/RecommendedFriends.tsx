import { Card } from "./ui/Card";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/button";

// Enhanced dummy data
const recommended = [
  { id: "6", name: "Daisy Miller", avatar: undefined, mutualFriends: 3 },
  { id: "7", name: "Eve Wilson", avatar: undefined, mutualFriends: 5 },
  { id: "8", name: "Frank Castle", avatar: undefined, mutualFriends: 2 },
];

export function RecommendedFriends() {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-foreground mb-4">People You May Know</h3>
      <div className="flex flex-col gap-4">
        {recommended.map(friend => (
          <div key={friend.id} className="flex items-center gap-3">
            <Avatar src={friend.avatar} alt={friend.name} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{friend.name}</p>
              <p className="text-xs text-muted-foreground">{friend.mutualFriends} mutual friends</p>
            </div>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
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
