"use client";

import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { api, errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

type Props = {
  tuitionId: string;
  className?: string;
  showLabel?: boolean;
};

export default function BookmarkButton({
  tuitionId,
  className,
  showLabel = false,
}: Props) {
  const { user, refreshUser } = useAuth();

  if (!user || user.role !== "student") return null;

  const saved = user.savedTuitions?.includes(tuitionId) ?? false;

  async function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    try {
      await api(`/student/bookmarks/${tuitionId}`, {
        method: saved ? "DELETE" : "POST",
      });
      await refreshUser();
      toast.success(saved ? "Removed from saved tuitions" : "Saved for later");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  if (showLabel) {
    return (
      <button
        type='button'
        onClick={toggle}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
          saved && "border-primary/40 bg-primary/10 text-primary",
          className,
        )}>
        <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
        {saved ? "Saved" : "Save for later"}
      </button>
    );
  }

  return (
    <button
      type='button'
      onClick={toggle}
      aria-label={saved ? "Remove bookmark" : "Bookmark this tuition"}
      title={saved ? "Remove bookmark" : "Bookmark this tuition"}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-muted",
        saved && "border-primary/40 bg-primary/10 text-primary",
        className,
      )}>
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
    </button>
  );
}
