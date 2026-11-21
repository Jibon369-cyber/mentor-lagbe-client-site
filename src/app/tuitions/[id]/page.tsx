"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Container from "@/components/Container";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { useFetch } from "@/hooks/useFetch";
import { api, errorMessage } from "@/lib/api";
import type { Tuition } from "@/lib/types";

export default function TuitionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const {
    data: tuition,
    loading,
    error,
  } = useFetch<Tuition>(`/tuitions/${id}`);

  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [schedule, setSchedule] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  async function handleApply(e: FormEvent) {
    e.preventDefault();

    if (!phone.trim() || !schedule.trim()) {
      toast.error("Phone and preferred schedule are required");
      return;
    }

    try {
      setSending(true);
      await api("/student/applications", {
        method: "POST",
        body: { tuitionId: id, phone, preferredSchedule: schedule, note },
      });
      toast.success("Application submitted!");
      setOpen(false);
      setPhone("");
      setSchedule("");
      setNote("");
    } catch (err) {
      toast.error(errorMessage(err)); // e.g. "You already applied for this tuition"
    } finally {
      setSending(false);
    }
  }

  if (loading) return <Loader />;
  if (error || !tuition) {
    return (
      <Container className='py-20 text-center'>
        <p className='text-lg font-semibold'>{error || "Tuition not found"}</p>
        <Button asChild className='mt-4'>
          <Link href='/tuitions'>Back to Tuitions</Link>
        </Button>
      </Container>
    );
  }

  // Which button should the visitor see?
  function ApplyArea() {
    if (!tuition?.isActive)
      return (
        <Button disabled className='w-full'>
          Applications Closed
        </Button>
      );
    if (authLoading)
      return (
        <Button disabled className='w-full'>
          Loading...
        </Button>
      );
    if (!user)
      return (
        <Button asChild className='w-full'>
          <Link href='/sign-in'>Sign in to Apply</Link>
        </Button>
      );
    if (user.role !== "student") {
      return (
        <>
          <Button disabled className='w-full'>
            Apply Now
          </Button>
          <p className='mt-2 text-center text-sm text-muted-foreground'>
            Only students can apply for tuitions.
          </p>
        </>
      );
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className='w-full'>Apply Now</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for this tuition</DialogTitle>
            <DialogDescription>{tuition.title}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApply} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone</Label>
              <Input
                id='phone'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='01XXXXXXXXX'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='schedule'>Preferred Schedule</Label>
              <Input
                id='schedule'
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder='e.g. Evening, 6-8 PM'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='note'>Learning Note</Label>
              <Textarea
                id='note'
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder='What do you want to learn?'
              />
            </div>
            <Button type='submit' className='w-full' disabled={sending}>
              {sending ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Container className='py-10'>
      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Left: details */}
        <div className='space-y-6 lg:col-span-2'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tuition.bannerImage}
            alt={tuition.title}
            className='aspect-video w-full rounded-xl object-cover'
          />

          <div>
            <div className='mb-3 flex gap-2'>
              <Badge>{tuition.subject}</Badge>
              <Badge variant='outline'>{tuition.mode}</Badge>
            </div>
            <h1 className='text-3xl font-bold tracking-tight'>
              {tuition.title}
            </h1>
          </div>

          <div className='grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2'>
            <div>
              <p className='text-sm text-muted-foreground'>Class Level</p>
              <p className='font-medium'>{tuition.classLevel}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Location / Mode</p>
              <p className='font-medium'>
                {tuition.location} ({tuition.mode})
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Schedule</p>
              <p className='font-medium'>{tuition.daysPerWeek} days per week</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Monthly Fee</p>
              <p className='font-medium'>৳{tuition.monthlyFee}</p>
            </div>
          </div>

          <div>
            <h2 className='mb-2 text-xl font-semibold'>Description</h2>
            <p className='whitespace-pre-line text-muted-foreground'>
              {tuition.description}
            </p>
          </div>
        </div>

        {/* Right: apply + tutor */}
        <div className='space-y-6'>
          <Card>
            <CardContent className='space-y-4'>
              <p className='text-3xl font-bold'>
                ৳{tuition.monthlyFee}
                <span className='text-base font-normal text-muted-foreground'>
                  {" "}
                  / month
                </span>
              </p>
              <div>
                <ApplyArea />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>About the Tutor</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-12 w-12'>
                  <AvatarImage
                    src={tuition.tutor?.image}
                    alt={tuition.tutorName}
                  />
                  <AvatarFallback>{tuition.tutorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-semibold'>{tuition.tutorName}</p>
                  {tuition.tutor?.plan === "pro" && (
                    <Badge variant='secondary'>Verified Pro Tutor</Badge>
                  )}
                </div>
              </div>
              <p className='text-sm text-muted-foreground'>
                {tuition.tutor?.bio || "This tutor has not added a bio yet."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
