"use client";

import Link from "next/link";
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Crown,
  FileText,
  Search,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import { useFetch } from "@/hooks/useFetch";

type Stats = {
  totalApplied: number;
  accepted: number;
  pending: number;
  plan: string;
  savedCount: number;
};

export default function StudentOverviewPage() {
  const { data, loading, error } = useFetch<Stats>("/student/stats");

  if (loading) return <Loader />;
  if (error || !data) return <p className='text-red-600'>{error}</p>;

  return (
    <>
      <PageTitle
        title='Student Overview'
        description='A quick look at your applications and saved tuitions.'
      />
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
        <StatCard
          title='Total Applied Tuitions'
          value={data.totalApplied}
          icon={FileText}
        />
        <StatCard
          title='Accepted Applications'
          value={data.accepted}
          icon={CheckCircle2}
        />
        <StatCard
          title='Pending Applications'
          value={data.pending}
          icon={Clock}
        />
        <StatCard title='Saved Tuitions' value={data.savedCount} icon={Bookmark} />
        <StatCard title='Current Plan' value={data.plan} icon={Crown} />
      </div>

      <div className='mt-6 grid gap-4 md:grid-cols-2'>
        <Card>
          <CardContent className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
            <div>
              <p className='font-semibold'>Find your next batch</p>
              <p className='text-sm text-muted-foreground'>
                Browse admin-approved tuitions by subject, level and mode.
              </p>
            </div>
            <Link
              href='/tuitions'
              className={buttonVariants({ size: "sm", className: "shrink-0" })}>
              <Search className='mr-1.5 h-3.5 w-3.5' /> Browse
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
            <div>
              <p className='font-semibold'>
                {data.plan === "pro" ? "Pro plan active" : "Upgrade to Pro"}
              </p>
              <p className='text-sm text-muted-foreground'>
                {data.plan === "pro"
                  ? "You have priority booking and priority support."
                  : "Get priority booking for just $10 one-time."}
              </p>
            </div>
            {data.plan === "free" ? (
              <Link
                href='/pricing'
                className={buttonVariants({ size: "sm", className: "shrink-0" })}>
                Upgrade
              </Link>
            ) : (
              <Crown className='h-8 w-8 text-amber-500' />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
