"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, Crown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/PageTitle";
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import { useFetch } from "@/hooks/useFetch";

type Stats = {
  totalTuitions: number;
  approvedTuitions: number;
  totalApplicants: number;
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
      />
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          title='Total Tuitions Posted'
          value={data.totalTuitions}
          icon={BookOpen}
        />
        <StatCard
          title='Active / Approved Tuitions'
          value={data.approvedTuitions}
          icon={CheckCircle2}
        />
        <StatCard
          title='Total Applicants'
          value={data.totalApplicants}
          icon={Users}
        />
        <StatCard title='Current Plan' value={data.plan} icon={Crown} />
      </div>
      {data.plan === "free" && (
        <div className='mt-6 flex flex-wrap items-center gap-3'>
          <p className='text-sm text-muted-foreground'>
            Free plan: up to 2 tuition posts.
          </p>
          <Button asChild>
            <Link href='/pricing'>Upgrade to Pro</Link>
          </Button>
        </div>
      )}
    </>
  );
}
