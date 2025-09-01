import { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("bg-white rounded shadow p-4", className)}>{children}</div>
  );
}
