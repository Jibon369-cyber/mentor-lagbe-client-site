"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageTitle from "@/components/PageTitle";
import StatusBadge from "@/components/StatusBadge";
import Loader from "@/components/Loader";
import ReviewDialog from "@/components/ReviewDialog";
import { useFetch } from "@/hooks/useFetch";
import { useScrollToHash } from "@/hooks/useScrollToHash";
import { api, errorMessage } from "@/lib/api";
import type { Application } from "@/lib/types";

export default function MyApplicationsPage() {
  const { data, loading, error, reload } = useFetch<Application[]>(
    "/student/applications",
  );
  useScrollToHash(!loading && !error);

  async function handleCancel(id: string) {
    if (!window.confirm("Cancel this application?")) return;
    try {
      await api(`/student/applications/${id}`, { method: "DELETE" });
      toast.success("Application cancelled");
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  if (loading) return <Loader />;
  if (error) return <p className='text-red-600'>{error}</p>;

  return (
    <>
      <PageTitle
        title='My Applications'
        description='Track every application and review your accepted tuitions.'
        action={
          <Link
            href='/tuitions'
            className={buttonVariants({ variant: "outline", size: "sm" })}>
            Find more tuitions
          </Link>
        }
      />
      <Card>
        <CardContent className='overflow-x-auto'>
          {data?.length === 0 ? (
            <div className='py-10 text-center'>
              <p className='text-muted-foreground'>
                You have not applied for any tuition yet.
              </p>
              <Link
                href='/tuitions'
                className={buttonVariants({ className: "mt-4" })}>
                Browse Tuitions
              </Link>
            </div>
          ) : (
            <Table className='min-w-[900px]'>
              <TableHeader>
                <TableRow>
                  <TableHead>Tuition</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Monthly Fee</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead className='text-right'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((app) => (
                  <TableRow key={app._id} id={`application-${app._id}`}>
                    <TableCell className='font-medium'>
                      <Link
                        href={`/tuitions/${app.tuitionId}`}
                        className='hover:text-primary hover:underline'>
                        {app.tuitionTitle}
                      </Link>
                      <p className='text-xs font-normal text-muted-foreground'>
                        {app.subject}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p>{app.tutorName}</p>
                      <p className='text-xs text-muted-foreground'>
                        {app.tutorEmail}
                      </p>
                    </TableCell>
                    <TableCell>
                      ৳{app.monthlyFee.toLocaleString("en-US")}
                    </TableCell>
                    <TableCell>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell>
                      {app.status === "accepted" ? (
                        <ReviewDialog
                          applicationId={app._id}
                          tuitionTitle={app.tuitionTitle}
                          initialRating={app.rating}
                          initialFeedback={app.feedback}
                          onSubmitted={reload}
                        />
                      ) : app.rating ? (
                        <span className='flex items-center gap-1 text-sm'>
                          <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                          {app.rating}/5
                        </span>
                      ) : (
                        <span className='text-xs text-muted-foreground'>
                          After acceptance
                        </span>
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      {app.status === "pending" && (
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleCancel(app._id)}>
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
