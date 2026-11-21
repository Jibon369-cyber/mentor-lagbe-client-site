"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Crown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/PageTitle";
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import { useFetch } from "@/hooks/useFetch";

type Stats = {
  totalApplied: number;
  accepted: number;
  pending: number;
  plan: string;
};

export default function StudentOverviewPage() {
  const { data, loading, error } = useFetch<Stats>("/student/stats");

  if (loading) return <Loader />;
  if (error || !data) return <p className='text-red-600'>{error}</p>;

  return (
    <>
      <PageTitle
        title='Student Overview'
        description='A quick look at your applications.'
      />
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
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
        <StatCard title='Current Plan' value={data.plan} icon={Crown} />
      </div>
      {data.plan === "free" && (
        <Button asChild className='mt-6'>
          <Link href='/pricing'>Upgrade to Pro</Link>
        </Button>
      )}
    </>
  );
}
