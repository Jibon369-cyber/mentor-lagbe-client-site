import { cn } from "@/lib/utils";

// Same heading style for every section of the site
export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}>
      <h2 className='text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
        {title}
      </h2>
      {subtitle && (
        <p className='mt-3 text-base leading-relaxed text-muted-foreground'>
          {subtitle}
        </p>
      )}
    </div>
  );
}
