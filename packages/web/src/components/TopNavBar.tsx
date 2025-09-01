import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/ThemeToggle";

export function TopNavBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-card">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl text-primary">ChatApp</span>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Avatar className="w-8 h-8 cursor-pointer" />
        <Button variant="ghost">Edit Profile</Button>
        <Button variant="ghost">Logout</Button>
      </div>
    </nav>
  );
}
