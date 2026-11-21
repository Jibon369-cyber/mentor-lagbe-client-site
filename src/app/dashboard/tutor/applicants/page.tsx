"use client";

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
import type { Application } from "@/lib/types";

export default function ApplicantsPage() {
  const { data, loading, error, reload } = useFetch<Application[]>(
    "/tutor/applications",
  );

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

  return (
    <>
      <PageTitle
        title='Applicants'
        description='Students who applied to your tuitions.'
      />
      <Card>
        <CardContent>
          {data?.length === 0 ? (
            <p className='py-6 text-center text-muted-foreground'>
              No applications received yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Tuition</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((app) => (
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
