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

export default function MyApplicationsPage() {
  const { data, loading, error, reload } = useFetch<Application[]>(
    "/student/applications",
  );

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
        description='All tuitions you have applied for.'
      />
      <Card>
        <CardContent>
          {data?.length === 0 ? (
            <p className='py-6 text-center text-muted-foreground'>
              You have not applied for any tuition yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tuition</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Monthly Fee</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell className='font-medium'>
                      {app.tuitionTitle}
                    </TableCell>
                    <TableCell>
                      <p>{app.tutorName}</p>
                      <p className='text-xs text-muted-foreground'>
                        {app.tutorEmail}
                      </p>
                    </TableCell>
                    <TableCell>৳{app.monthlyFee}</TableCell>
                    <TableCell>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
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
