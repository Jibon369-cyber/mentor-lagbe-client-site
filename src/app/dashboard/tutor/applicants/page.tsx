"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
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
import type { Application } from "@/lib/types";

type Filter = "all" | "pending" | "accepted" | "rejected";

export default function ApplicantsPage() {
  const { data, loading, error, reload } = useFetch<Application[]>(
    "/tutor/applications",
  );
  const [filter, setFilter] = useState<Filter>("all");

  async function updateStatus(id: string, status: "accepted" | "rejected") {
    try {
      await api(`/tutor/applications/${id}`, {
        method: "PATCH",
        body: { status },
      });
      toast.success(`Application ${status}`);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  if (loading) return <Loader />;
  if (error) return <p className='text-red-600'>{error}</p>;

  const filtered =
    filter === "all"
      ? data
      : data?.filter((application) => application.status === filter);

  const counts = {
    all: data?.length ?? 0,
    pending: data?.filter((a) => a.status === "pending").length ?? 0,
    accepted: data?.filter((a) => a.status === "accepted").length ?? 0,
    rejected: data?.filter((a) => a.status === "rejected").length ?? 0,
  };

  return (
    <>
      <PageTitle
        title='Applicants'
        description='Students who applied to your tuitions. Accept the best fit.'
      />

      <div className='mb-4 flex flex-wrap gap-2'>
        {(["all", "pending", "accepted", "rejected"] as Filter[]).map(
          (item) => (
            <Button
              key={item}
              size='sm'
              variant={filter === item ? "default" : "outline"}
              onClick={() => setFilter(item)}
              className='capitalize'>
              {item} ({counts[item]})
            </Button>
          ),
        )}
      </div>

      <Card>
        <CardContent className='overflow-x-auto'>
          {filtered?.length === 0 ? (
            <p className='py-10 text-center text-muted-foreground'>
              No {filter === "all" ? "" : filter} applications found.
            </p>
          ) : (
            <Table className='min-w-[1050px]'>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Tuition</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered?.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>
                      <p className='font-medium'>{app.studentName}</p>
                      <p className='text-xs text-muted-foreground'>
                        {app.studentEmail}
                      </p>
                    </TableCell>
                    <TableCell>{app.studentPhone}</TableCell>
                    <TableCell>{app.tuitionTitle}</TableCell>
                    <TableCell>{app.preferredSchedule}</TableCell>
                    <TableCell
                      className='max-w-48 truncate'
                      title={app.studentNote}>
                      {app.studentNote || "-"}
                    </TableCell>
                    <TableCell>
                      {app.rating ? (
                        <span className='flex items-center gap-1 text-sm'>
                          <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                          {app.rating}/5
                        </span>
                      ) : (
                        <span className='text-xs text-muted-foreground'>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell className='space-x-2 text-right whitespace-nowrap'>
                      <Button
                        size='sm'
                        disabled={app.status === "accepted"}
                        onClick={() => updateStatus(app._id, "accepted")}>
                        Accept
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        disabled={app.status === "rejected"}
                        onClick={() => updateStatus(app._id, "rejected")}>
                        Reject
                      </Button>
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
