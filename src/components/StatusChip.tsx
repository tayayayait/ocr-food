import { cn } from "@/lib/utils";
import type { StatusLevel } from "@/types/domain";
import { X } from "lucide-react";

const levelStyles: Record<StatusLevel, string> = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-mint-100 text-mint-700",
  high: "bg-destructive/10 text-destructive",
};

interface StatusChipProps {
  level: StatusLevel;
  label: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function StatusChip({ level, label, dismissible, onDismiss, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 h-7 text-[0.8125rem] font-semibold leading-tight",
        levelStyles[level],
        className
      )}
    >
      {label}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="키워드 제거"
          className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
