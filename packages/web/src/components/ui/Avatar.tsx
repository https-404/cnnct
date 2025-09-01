import { cn } from "../../lib/utils";

export function Avatar({ src, alt, className }: { src?: string; alt?: string; className?: string }) {
  return (
    <img
      src={src || "/default-avatar.png"}
      alt={alt || "User avatar"}
      className={cn("w-10 h-10 rounded-full object-cover", className)}
    />
  );
}
