import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export function Avatar({ src, alt, className }: { src?: string; alt?: string; className?: string }) {
  const [imageError, setImageError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);

  // Generate a placeholder avatar with initials
  const getInitials = (name?: string): string => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getPlaceholderColor = (name?: string): string => {
    if (!name) return "bg-gray-400";
    // Generate a consistent color based on name
    const colors = [
      "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-red-500",
      "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-teal-500",
      "bg-cyan-500", "bg-indigo-500"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Show placeholder if no src, or if image failed to load
  if (!src || imageError) {
    return (
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold border border-gray-200",
        getPlaceholderColor(alt),
        className
      )}>
        {getInitials(alt)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "User avatar"}
      className={cn("w-10 h-10 rounded-full object-cover border border-gray-200", className)}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
  );
}
