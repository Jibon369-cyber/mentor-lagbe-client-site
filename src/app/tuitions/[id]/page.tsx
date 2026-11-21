"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  MessageSquare,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import BookmarkButton from "@/components/BookmarkButton";
import RatingStars from "@/components/RatingStars";
import ReviewDialog from "@/components/ReviewDialog";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useFetch } from "@/hooks/useFetch";
import { api, errorMessage } from "@/lib/api";
import type { Application, Tuition } from "@/lib/types";

export default function TuitionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const {
    data: tuition,
    loading,
    error,
    reload: reloadTuition,
  } = useFetch<Tuition>(`/tuitions/${id}`);
  const { data: myApplications, reload: reloadApplications } = useFetch<
    Application[]
  >(user?.role === "student" ? "/student/applications" : null);

  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [schedule, setSchedule] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const myApplication = myApplications?.find(
    (application) => application.tuitionId === id,
  );
  const canReview = myApplication?.status === "accepted";

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
      toast.success("Application submitted! Track it from your dashboard.");
      setOpen(false);
      setPhone("");
      setSchedule("");
      setNote("");
      reloadApplications();
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
        <Link
          href='/tuitions'
          className={buttonVariants({ className: "mt-4" })}>
          Back to Tuitions
        </Link>
      </Container>
    );
  }

  function renderApplyArea() {
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
        <Link
          href='/sign-in'
          className={buttonVariants({ className: "w-full" })}>
          Sign in to Apply
        </Link>
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

    if (myApplication) {
      return (
        <div className='space-y-3'>
          <div className='flex items-center justify-between gap-2 rounded-lg border bg-muted/40 p-3'>
            <span className='text-sm font-medium'>Your application</span>
            <StatusBadge status={myApplication.status} />
          </div>
          {canReview && (
            <ReviewDialog
              applicationId={myApplication._id}
              tuitionTitle={tuition.title}
              initialRating={myApplication.rating}
              initialFeedback={myApplication.feedback}
              onSubmitted={() => {
                reloadApplications();
                reloadTuition();
              }}
            />
          )}
        </div>
      );
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button className='w-full' />}>
          Apply Now
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
    <Container className='py-8 md:py-12'>
      <Link
        href='/tuitions'
        className='mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
        <ArrowLeft className='h-4 w-4' /> Back to all tuitions
      </Link>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Left: details */}
        <div className='space-y-6 lg:col-span-2'>
          <div className='relative overflow-hidden rounded-2xl border'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tuition.bannerImage}
              alt={tuition.title}
              className='aspect-video w-full object-cover'
            />
            <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-16'>
              <div className='mb-2 flex flex-wrap gap-2'>
                <Badge className='bg-white/95 text-slate-900'>
                  {tuition.subject}
                </Badge>
                <Badge
                  variant='outline'
                  className='border-white/50 text-white'>
                  {tuition.mode}
                </Badge>
                {tuition.rating && tuition.rating.count > 0 && (
                  <Badge className='bg-amber-400 text-amber-950'>
                    ★ {tuition.rating.average.toFixed(1)} (
                    {tuition.rating.count})
                  </Badge>
                )}
              </div>
              <h1 className='text-2xl font-bold text-white md:text-3xl'>
                {tuition.title}
              </h1>
            </div>
          </div>

          <div className='grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-2'>
            <div className='flex items-start gap-3'>
              <GraduationCap className='mt-0.5 h-5 w-5 text-primary' />
              <div>
                <p className='text-sm text-muted-foreground'>Class Level</p>
                <p className='font-medium'>{tuition.classLevel}</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <MapPin className='mt-0.5 h-5 w-5 text-primary' />
              <div>
                <p className='text-sm text-muted-foreground'>Location</p>
                <p className='font-medium'>
                  {tuition.location} ({tuition.mode})
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <CalendarDays className='mt-0.5 h-5 w-5 text-primary' />
              <div>
                <p className='text-sm text-muted-foreground'>Schedule</p>
                <p className='font-medium'>
                  {tuition.daysPerWeek} days per week
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <Clock className='mt-0.5 h-5 w-5 text-primary' />
              <div>
                <p className='text-sm text-muted-foreground'>Monthly Fee</p>
                <p className='font-medium'>
                  ৳{tuition.monthlyFee.toLocaleString("en-US")}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className='mb-2 text-xl font-semibold'>About this tuition</h2>
            <p className='whitespace-pre-line leading-relaxed text-muted-foreground'>
              {tuition.description}
            </p>
          </div>

          {/* Reviews */}
          <div className='rounded-2xl border bg-card p-5'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h2 className='text-xl font-semibold'>Student Reviews</h2>
                <RatingStars
                  rating={tuition.rating?.average}
                  count={tuition.rating?.count}
                  className='mt-1'
                />
              </div>
              {canReview && myApplication && (
                <ReviewDialog
                  applicationId={myApplication._id}
                  tuitionTitle={tuition.title}
                  initialRating={myApplication.rating}
                  initialFeedback={myApplication.feedback}
                  onSubmitted={() => {
                    reloadApplications();
                    reloadTuition();
                  }}
                />
              )}
            </div>

            <div className='mt-5 space-y-4'>
              {tuition.reviews && tuition.reviews.length > 0 ? (
                tuition.reviews.map((review, index) => (
                  <div
                    key={`${review.studentName}-${index}`}
                    className='rounded-xl border bg-muted/20 p-4'>
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        <Avatar className='h-8 w-8'>
                          <AvatarFallback>
                            {review.studentName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-sm font-semibold'>
                            {review.studentName}
                          </p>
                          {review.reviewedAt && (
                            <p className='text-xs text-muted-foreground'>
                              {new Date(review.reviewedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <RatingStars
                        rating={review.rating}
                        showCount={false}
                        className='shrink-0'
                      />
                    </div>
                    {review.feedback && (
                      <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
                        {review.feedback}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className='rounded-xl border border-dashed p-6 text-center'>
                  <MessageSquare className='mx-auto h-8 w-8 text-muted-foreground/50' />
                  <p className='mt-2 text-sm text-muted-foreground'>
                    No reviews yet. Accepted students can leave the first one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: apply + tutor */}
        <div className='space-y-6'>
          <Card className='lg:sticky lg:top-24'>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-3xl font-bold'>
                  ৳{tuition.monthlyFee.toLocaleString("en-US")}
                  <span className='text-base font-normal text-muted-foreground'>
                    {" "}
                    / month
                  </span>
                </p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {tuition.daysPerWeek} classes every week
                </p>
              </div>

              <div>
                {renderApplyArea()}
              </div>

              <div className='flex items-center justify-between gap-2'>
                <BookmarkButton
                  tuitionId={tuition._id}
                  showLabel
                  className='flex-1'
                />
              </div>

              <div className='rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground'>
                <p className='flex items-center gap-1.5 font-medium text-foreground'>
                  <ShieldCheck className='h-3.5 w-3.5 text-emerald-500' />
                  Safe application
                </p>
                <p className='mt-1'>
                  Your phone number is shared only with this tutor after you
                  apply.
                </p>
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
                  <p className='flex items-center gap-1.5 font-semibold'>
                    {tuition.tutorName}
                    {tuition.tutor?.plan === "pro" && (
                      <BadgeCheck className='h-4 w-4 text-primary' />
                    )}
                  </p>
                  {tuition.tutor?.plan === "pro" ? (
                    <Badge variant='secondary'>Verified Pro Tutor</Badge>
                  ) : (
                    <p className='text-xs text-muted-foreground'>Tutor</p>
                  )}
                </div>
              </div>
              <p className='text-sm leading-relaxed text-muted-foreground'>
                {tuition.tutor?.bio || "This tutor has not added a bio yet."}
              </p>
              <div className='flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground'>
                <UserRound className='h-3.5 w-3.5' />
                {tuition.tutorEmail}
              </div>
            </CardContent>
          </Card>

          <div className='rounded-xl border bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200'>
            <p className='flex items-center gap-2 font-semibold'>
              <CheckCircle2 className='h-4 w-4' /> Admin approved listing
            </p>
            <p className='mt-1 text-xs opacity-90'>
              This tuition was reviewed and approved by the MentorLagbe team.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
