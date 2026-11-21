"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useFetch } from "@/hooks/useFetch";
import { useScrollToHash } from "@/hooks/useScrollToHash";
import { api, errorMessage } from "@/lib/api";
import type { Tuition } from "@/lib/types";

export default function AdminTuitionsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const query = statusFilter === "all" ? "" : `?status=${statusFilter}`;
  const { data, loading, error, reload } = useFetch<Tuition[]>(
    `/admin/tuitions${query}`,
  );
  useScrollToHash(!loading && !error);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    try {
      await api(`/admin/tuitions/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      toast.success(`Tuition ${status}`);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  return (
    <>
      <PageTitle
        title='Tuition Approval'
        description='Review new posts, approve public batches and reject anything incomplete.'
        action={
          <Badge variant='outline' className='w-fit gap-1.5'>
            <ClipboardCheck className='h-3.5 w-3.5' />
            {loading ? "Loading..." : `${data?.length ?? 0} shown`}
          </Badge>
        }
      />

      <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-sm text-muted-foreground'>
          Only approved tuitions appear on the public browse page.
        </p>
        <Select
          value={statusFilter}
          onValueChange={(value) => value && setStatusFilter(value)}>
          <SelectTrigger className='w-full sm:w-44'>
            <SelectValue placeholder='All statuses' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All statuses</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
            <SelectItem value='approved'>Approved</SelectItem>
            <SelectItem value='rejected'>Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className='mb-4 text-destructive'>{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <Card>
          <CardContent className='overflow-x-auto'>
            <Table className='min-w-[900px]'>
              <TableHeader>
                <TableRow>
                  <TableHead>Tuition</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((tuition) => (
                  <TableRow key={tuition._id} id={`tuition-${tuition._id}`}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tuition.bannerImage}
                          alt={tuition.title}
                          className='h-12 w-16 shrink-0 rounded-md border object-cover'
                        />
                        <div className='min-w-0'>
                          {tuition.approvalStatus === "approved" ? (
                            <Link
                              href={`/tuitions/${tuition._id}`}
                              className='line-clamp-1 font-medium hover:text-primary hover:underline'>
                              {tuition.title}
                            </Link>
                          ) : (
                            <p className='line-clamp-1 font-medium'>
                              {tuition.title}
                            </p>
                          )}
                          <p className='text-xs text-muted-foreground'>
                            {tuition.classLevel} · {tuition.mode}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p>{tuition.tutorName}</p>
                      <p className='text-xs text-muted-foreground'>
                        {tuition.tutorEmail}
                      </p>
                    </TableCell>
                    <TableCell>{tuition.subject}</TableCell>
                    <TableCell className='whitespace-nowrap'>
                      ৳{tuition.monthlyFee.toLocaleString("en-US")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tuition.approvalStatus} />
                    </TableCell>
                    <TableCell className='space-x-2 whitespace-nowrap text-right'>
                      <Button
                        size='sm'
                        disabled={tuition.approvalStatus === "approved"}
                        onClick={() => updateStatus(tuition._id, "approved")}>
                        Approve
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        disabled={tuition.approvalStatus === "rejected"}
                        onClick={() => updateStatus(tuition._id, "rejected")}>
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {data?.length === 0 && (
              <p className='py-10 text-center text-muted-foreground'>
                No {statusFilter === "all" ? "" : statusFilter} tuitions found.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
