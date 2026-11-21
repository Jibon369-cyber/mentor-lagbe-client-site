import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  href?: string;
};

/**
 * The single logo used by the navbar, footer and dashboard so the brand
 * keeps exactly the same style and size everywhere.
 */
export default function Logo({
  className,
  textClassName,
  iconClassName,
  href = "/",
}: Props) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label='MentorLagbe home'>
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-6",
          iconClassName,
        )}>
        <GraduationCap className='h-5 w-5' />
      </span>
      <span
        className={cn(
          "text-xl font-bold tracking-tight text-foreground",
          textClassName,
        )}>
        Mentor<span className='text-primary'>Lagbe</span>
      </span>
    </Link>
  );
}
