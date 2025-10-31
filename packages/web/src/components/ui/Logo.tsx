import { cn } from "../../lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
}

export function Logo({ className, showText = true, size = "md", variant = "default" }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const isWhite = variant === "white";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo Icon - Chat bubble with connection lines */}
      <div className={cn("relative flex-shrink-0", sizeClasses[size])}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Main chat bubble */}
          <path
            d="M20 4C10.59 4 3 9.59 3 17c0 3.18 1.23 6.12 3.32 8.35L4 36l10.65-2.32C17.88 36.77 20.82 38 24 38c9.41 0 17-5.59 17-13S33.41 4 24 4H20z"
            fill={isWhite ? "#ffffff" : "#00a884"}
          />
          {/* Connection dots inside bubble */}
          <circle cx="14" cy="17" r="2" fill={isWhite ? "#00a884" : "white"} />
          <circle cx="20" cy="17" r="2" fill={isWhite ? "#00a884" : "white"} />
          <circle cx="26" cy="17" r="2" fill={isWhite ? "#00a884" : "white"} />
          {/* Small connecting lines between dots */}
          <path
            d="M16 17h8"
            stroke={isWhite ? "#00a884" : "white"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight",
            isWhite ? "text-white" : "text-[#00a884]",
            textSizeClasses[size]
          )}
        >
          cnnct
        </span>
      )}
    </div>
  );
}

