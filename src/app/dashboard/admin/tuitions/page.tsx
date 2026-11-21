"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { useFetch } from "@/hooks/useFetch";
import { api, errorMessage } from "@/lib/api";
import type { Tuition } from "@/lib/types";

export default function AdminTuitionsPage() {
  const { data, loading, error, reload } =
    useFetch<Tuition[]>("/admin/tuitions");

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

  if (loading) return <Loader />;
  if (error) return <p className='text-red-600'>{error}</p>;

  return (
    <>
      <PageTitle
        title='Tuition Approval'
        description='Approve or reject tuitions posted by tutors.'
      />
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((tuition) => (
                <TableRow key={tuition._id}>
                  <TableCell className='font-medium'>
                    <Link
                      href={`/tuitions/${tuition._id}`}
                      className='hover:underline'>
                      {tuition.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <p>{tuition.tutorName}</p>
                    <p className='text-xs text-muted-foreground'>
                      {tuition.tutorEmail}
                    </p>
                  </TableCell>
                  <TableCell>{tuition.subject}</TableCell>
                  <TableCell>৳{tuition.monthlyFee}</TableCell>
                  <TableCell>
                    <StatusBadge status={tuition.approvalStatus} />
                  </TableCell>
                  <TableCell className='space-x-2 text-right whitespace-nowrap'>
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
        </CardContent>
      </Card>
    </>
  );
}
