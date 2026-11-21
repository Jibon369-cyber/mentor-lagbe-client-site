"use client";

import {
  BookOpen,
  Clock,
  DollarSign,
  GraduationCap,
  Users,
} from "lucide-react";
import PageTitle from "@/components/PageTitle";
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import { useFetch } from "@/hooks/useFetch";

type Stats = {
  totalUsers: number;
  totalTutors: number;
  pendingTuitions: number;
  approvedTuitions: number;
  totalRevenue: number;
};

export default function AdminOverviewPage() {
  const { data, loading, error } = useFetch<Stats>("/admin/stats");

  if (loading) return <Loader />;
  if (error || !data) return <p className='text-red-600'>{error}</p>;

  return (
    <>
      <PageTitle title='Admin Overview' description='Platform statistics.' />
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        <StatCard title='Total Users' value={data.totalUsers} icon={Users} />
        <StatCard
          title='Total Tutors'
          value={data.totalTutors}
          icon={GraduationCap}
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
          title='Total Stripe Revenue'
          value={`$${data.totalRevenue}`}
          icon={DollarSign}
        />
      </div>
    </>
  );
}
