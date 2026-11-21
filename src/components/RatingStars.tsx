import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  rating?: number;
  count?: number;
  className?: string;
  showCount?: boolean;
};

export default function RatingStars({
  rating = 0,
  count = 0,
  className,
  showCount = true,
}: Props) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className='flex items-center gap-0.5'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              "h-3.5 w-3.5",
              index < Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30",
            )}
          />
        ))}
      </div>
      <span className='text-xs font-medium text-muted-foreground'>
        {rating > 0 ? rating.toFixed(1) : "New"}
        {showCount && count > 0 ? ` (${count})` : ""}
      </span>
    </div>
  );
}
