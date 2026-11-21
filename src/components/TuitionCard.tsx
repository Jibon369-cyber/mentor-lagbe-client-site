import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Tuition } from "@/lib/types";

export default function TuitionCard({ tuition }: { tuition: Tuition }) {
  return (
    <Card className='flex h-full flex-col overflow-hidden pt-0'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tuition.bannerImage}
        alt={tuition.title}
        className='aspect-video w-full object-cover'
      />

      <CardHeader>
        <div className='mb-2 flex gap-2'>
          <Badge>{tuition.subject}</Badge>
          <Badge variant='outline'>{tuition.mode}</Badge>
        </div>
        <CardTitle className='line-clamp-1 text-lg'>{tuition.title}</CardTitle>
      </CardHeader>

      <CardContent className='flex-1 space-y-1 text-sm text-muted-foreground'>
        <p>Class Level: {tuition.classLevel}</p>
        <p>Tutor: {tuition.tutorName}</p>
        <p className='pt-2 text-lg font-semibold text-foreground'>
          ৳{tuition.monthlyFee}
          <span className='text-sm font-normal text-muted-foreground'>
            {" "}
            / month
          </span>
        </p>
      </CardContent>

      <CardFooter>
        <Button asChild className='w-full'>
          <Link href={`/tuitions/${tuition._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
