"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import TuitionForm, { type TuitionFormData } from "@/components/TuitionForm";
import Loader from "@/components/Loader";
import { useFetch } from "@/hooks/useFetch";
import { api, errorMessage } from "@/lib/api";
import type { Tuition } from "@/lib/types";

export default function MyTuitionsPage() {
  const { data, loading, error, reload } =
    useFetch<Tuition[]>("/tutor/tuitions");
  const [editing, setEditing] = useState<Tuition | null>(null);

  async function handleUpdate(form: TuitionFormData) {
    if (!editing) return;
    try {
      await api(`/tutor/tuitions/${editing._id}`, {
        method: "PATCH",
        body: form,
      });
      toast.success("Tuition updated");
      setEditing(null);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  async function handleToggle(id: string) {
    try {
      await api(`/tutor/tuitions/${id}/toggle`, { method: "PATCH" });
      toast.success("Status changed");
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  async function handleDelete(id: string) {
    if (
      !window.confirm(
        "Delete this tuition? Its applications will also be deleted.",
      )
    )
      return;
    try {
      await api(`/tutor/tuitions/${id}`, { method: "DELETE" });
      toast.success("Tuition deleted");
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
        title='My Tuitions'
        description='Edit, close or delete the tuitions you posted.'
      />
      <Card>
        <CardContent>
          {data?.length === 0 ? (
            <p className='py-6 text-center text-muted-foreground'>
              You have not posted any tuition yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((tuition) => (
                  <TableRow key={tuition._id}>
                    <TableCell className='font-medium'>
                      {tuition.title}
                    </TableCell>
                    <TableCell>{tuition.subject}</TableCell>
                    <TableCell>৳{tuition.monthlyFee}</TableCell>
                    <TableCell>
                      <StatusBadge status={tuition.approvalStatus} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={tuition.isActive ? "active" : "closed"}
                      />
                    </TableCell>
                    <TableCell className='space-x-2 text-right whitespace-nowrap'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => setEditing(tuition)}>
                        Edit
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleToggle(tuition._id)}>
                        {tuition.isActive ? "Close" : "Activate"}
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => handleDelete(tuition._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog
        open={!!editing}
        onOpenChange={(isOpen) => !isOpen && setEditing(null)}>
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Edit Tuition</DialogTitle>
          </DialogHeader>
          {editing && (
            <TuitionForm
              initial={editing}
              submitLabel='Update Tuition'
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
