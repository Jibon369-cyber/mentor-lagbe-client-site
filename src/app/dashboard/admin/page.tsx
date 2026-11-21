"use client";

import Link from "next/link";
import {
  BookOpen,
  Clock,
  DollarSign,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PageTitle from "@/components/PageTitle";
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import { useFetch } from "@/hooks/useFetch";

type Stats = {
  totalUsers: number;
  totalTutors: number;
  totalStudents: number;
  totalTuitions: number;
  pendingTuitions: number;
  approvedTuitions: number;
  totalApplications: number;
  totalPayments: number;
  totalRevenue: number;
};

export default function AdminOverviewPage() {
  const { data, loading, error } = useFetch<Stats>("/admin/stats");

  if (loading) return <Loader />;
  if (error || !data) return <p className='text-red-600'>{error}</p>;

  return (
    <>
      <PageTitle
        title='Admin Overview'
        description='Platform health, moderation queue and Stripe revenue.'
        action={
          data.pendingTuitions > 0 ? (
            <Link
              href='/dashboard/admin/tuitions'
              className={buttonVariants({ size: "sm" })}>
              Review {data.pendingTuitions} pending
            </Link>
          ) : undefined
        }
      />
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard title='Total Users' value={data.totalUsers} icon={Users} />
        <StatCard
          title='Total Tutors'
          value={data.totalTutors}
          icon={GraduationCap}
        />
        <StatCard
          title='Total Students'
          value={data.totalStudents}
          icon={Users}
        />
        <StatCard
          title='Total Tuitions'
          value={data.totalTuitions}
          icon={BookOpen}
        />
        <StatCard
          title='Pending Tuitions'
          value={data.pendingTuitions}
          icon={Clock}
        />
        <StatCard
          title='Approved Tuitions'
          value={data.approvedTuitions}
          icon={BookOpen}
        />
        <StatCard
          title='Applications'
          value={data.totalApplications}
          icon={FileText}
        />
        <StatCard
          title='Stripe Revenue'
          value={`$${data.totalRevenue}`}
          icon={DollarSign}
        />
      </div>

      <div className='mt-6 grid gap-4 md:grid-cols-2'>
        <div className='rounded-xl border bg-card p-5'>
          <p className='text-sm text-muted-foreground'>Paid transactions</p>
          <p className='mt-1 text-2xl font-bold'>{data.totalPayments}</p>
          <Link
            href='/dashboard/admin/transactions'
            className='mt-2 inline-block text-sm font-medium text-primary hover:underline'>
            View transactions →
          </Link>
        </div>
        <div className='rounded-xl border bg-card p-5'>
          <p className='text-sm text-muted-foreground'>Moderation queue</p>
          <p className='mt-1 text-2xl font-bold'>
            {data.pendingTuitions} pending
          </p>
          <Link
            href='/dashboard/admin/tuitions'
            className='mt-2 inline-block text-sm font-medium text-primary hover:underline'>
            Open approval flow →
          </Link>
        </div>
      </div>
    </>
  );
}
