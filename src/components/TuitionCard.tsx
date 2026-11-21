import Link from "next/link";
import {
  CalendarDays,
  GraduationCap,
  MapPin,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BookmarkButton from "@/components/BookmarkButton";
import RatingStars from "@/components/RatingStars";
import type { Tuition } from "@/lib/types";

export default function TuitionCard({ tuition }: { tuition: Tuition }) {
  return (
    <Card className='group relative flex h-full flex-col gap-0 overflow-hidden pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
      <BookmarkButton
        tuitionId={tuition._id}
        className='absolute right-3 top-3 z-10'
      />

      <Link href={`/tuitions/${tuition._id}`} className='block overflow-hidden'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tuition.bannerImage}
          alt={tuition.title}
          loading='lazy'
          className='aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
      </Link>

      <CardHeader className='pb-2'>
        <div className='mb-2 flex flex-wrap gap-1.5'>
          <Badge>{tuition.subject}</Badge>
          <Badge variant='outline'>{tuition.mode}</Badge>
          {tuition.rating && tuition.rating.count > 0 ? (
            <Badge
              variant='secondary'
              className='ml-auto bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300'>
              ★ {tuition.rating.average.toFixed(1)}
            </Badge>
          ) : null}
        </div>
        <CardTitle className='line-clamp-2 text-lg leading-snug'>
          <Link
            href={`/tuitions/${tuition._id}`}
            className='transition-colors hover:text-primary'>
            {tuition.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className='flex-1 space-y-2 pb-4 text-sm text-muted-foreground'>
        <RatingStars
          rating={tuition.rating?.average}
          count={tuition.rating?.count}
        />
        <p className='flex items-center gap-2'>
          <GraduationCap className='h-4 w-4 shrink-0 text-primary' />
          {tuition.classLevel}
        </p>
        <p className='flex items-center gap-2'>
          <MapPin className='h-4 w-4 shrink-0 text-primary' />
          <span className='truncate'>{tuition.location}</span>
        </p>
        <p className='flex items-center gap-2'>
          <CalendarDays className='h-4 w-4 shrink-0 text-primary' />
          {tuition.daysPerWeek} days / week
        </p>
        <p className='flex items-center gap-2'>
          <UserRound className='h-4 w-4 shrink-0 text-primary' />
          <span className='truncate'>{tuition.tutorName}</span>
        </p>
      </CardContent>

      <CardFooter className='flex items-center justify-between gap-2 border-t bg-muted/30 py-4'>
        <div>
          <span className='text-xl font-bold text-foreground'>
            ৳{tuition.monthlyFee.toLocaleString("en-US")}
          </span>
          <span className='text-xs text-muted-foreground'> / month</span>
        </div>
        <Link
          href={`/tuitions/${tuition._id}`}
          className={buttonVariants({ size: "sm" })}>
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
