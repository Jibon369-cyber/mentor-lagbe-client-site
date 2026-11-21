"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Crown,
  Plus,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import { useFetch } from "@/hooks/useFetch";

type Stats = {
  totalTuitions: number;
  approvedTuitions: number;
  totalApplicants: number;
  pendingApplicants: number;
  acceptedApplicants: number;
  plan: string;
};

export default function TutorOverviewPage() {
  const { data, loading, error } = useFetch<Stats>("/tutor/stats");

  if (loading) return <Loader />;
  if (error || !data) return <p className='text-red-600'>{error}</p>;

  return (
    <>
      <PageTitle
        title='Tutor Overview'
        description='Your tuitions and applicants at a glance.'
        action={
          <Link href='/dashboard/tutor/post-tuition' className={buttonVariants()}>
            <Plus className='mr-1.5 h-4 w-4' /> Post a Tuition
          </Link>
        }
      />
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
        <StatCard
          title='Total Tuitions Posted'
          value={data.totalTuitions}
          icon={BookOpen}
        />
        <StatCard
          title='Active / Approved'
          value={data.approvedTuitions}
          icon={CheckCircle2}
        />
        <StatCard
          title='Total Applicants'
          value={data.totalApplicants}
          icon={Users}
        />
        <StatCard
          title='Pending Applicants'
          value={data.pendingApplicants}
          icon={Clock}
        />
        <StatCard title='Current Plan' value={data.plan} icon={Crown} />
      </div>

      <div className='mt-6 grid gap-4 md:grid-cols-2'>
        <Card>
          <CardContent className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
            <div>
              <p className='font-semibold'>
                {data.acceptedApplicants} accepted application
                {data.acceptedApplicants === 1 ? "" : "s"}
              </p>
              <p className='text-sm text-muted-foreground'>
                Review new applicants and keep your batches full.
              </p>
            </div>
            <Link
              href='/dashboard/tutor/applicants'
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "shrink-0",
              })}>
              View Applicants
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
                  ? "You can post unlimited tuitions."
                  : "Free plan allows up to 2 tuition posts."}
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
