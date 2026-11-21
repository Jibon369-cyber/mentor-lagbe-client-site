"use client";

import Link from "next/link";
import { Bookmark, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PageTitle from "@/components/PageTitle";
import TuitionCard from "@/components/TuitionCard";
import Loader from "@/components/Loader";
import { useFetch } from "@/hooks/useFetch";
import type { Tuition } from "@/lib/types";

export default function SavedTuitionsPage() {
  const { data, loading, error } = useFetch<Tuition[]>("/student/bookmarks");

  if (loading) return <Loader />;
  if (error) return <p className='text-red-600'>{error}</p>;

  return (
    <>
      <PageTitle
        title='Saved Tuitions'
        description='Your bookmarked batches. Open one to apply when you are ready.'
        action={
          <Link
            href='/tuitions'
            className={buttonVariants({ variant: "outline", size: "sm" })}>
            <Search className='mr-1.5 h-3.5 w-3.5' /> Find more
          </Link>
        }
      />

      {data?.length === 0 ? (
        <div className='rounded-2xl border border-dashed bg-card p-12 text-center'>
          <Bookmark className='mx-auto h-10 w-10 text-muted-foreground/60' />
          <p className='mt-3 font-semibold'>No saved tuitions yet</p>
          <p className='mt-1 text-sm text-muted-foreground'>
            Tap the bookmark icon on any tuition card to save it here.
          </p>
          <Link
            href='/tuitions'
            className={buttonVariants({ className: "mt-5" })}>
            Browse Tuitions
          </Link>
        </div>
      ) : (
        <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
          {data?.map((tuition) => (
            <TuitionCard key={tuition._id} tuition={tuition} />
          ))}
        </div>
      )}
    </>
  );
}
