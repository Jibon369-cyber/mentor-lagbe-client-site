"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Atom,
  BadgeCheck,
  BookOpen,
  Calculator,
  Code2,
  Dna,
  FlaskConical,
  GraduationCap,
  Languages,
  Laptop,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import TuitionCard from "@/components/TuitionCard";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import RatingStars from "@/components/RatingStars";
import { useFetch } from "@/hooks/useFetch";
import type { Review, Tuition } from "@/lib/types";

const subjects = [
  { name: "Math", icon: Calculator, color: "text-indigo-500" },
  { name: "Physics", icon: Atom, color: "text-sky-500" },
  { name: "Chemistry", icon: FlaskConical, color: "text-emerald-500" },
  { name: "Biology", icon: Dna, color: "text-rose-500" },
  { name: "English", icon: BookOpen, color: "text-amber-500" },
  { name: "Programming", icon: Code2, color: "text-violet-500" },
  { name: "IELTS", icon: Languages, color: "text-cyan-500" },
  { name: "ICT", icon: Laptop, color: "text-orange-500" },
];

type Stats = {
  tutors: number;
  students: number;
  approvedTuitions: number;
  totalReviews: number;
};

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: tuitions, loading } = useFetch<Tuition[]>("/tuitions/latest");
  const { data: stats } = useFetch<Stats>("/stats");
  const { data: reviews } = useFetch<Review[]>("/tuitions/reviews/featured");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const value = search.trim();
    router.push(value ? `/tuitions?search=${encodeURIComponent(value)}` : "/tuitions");
  }

  return (
    <>
      {/* 1. Hero */}
      <section className='relative overflow-hidden border-b'>
        <div className='absolute inset-0 bg-hero-glow' />
        <div className='absolute inset-0 bg-grid opacity-50' />
        <Container className='relative grid items-center gap-12 py-16 md:grid-cols-2 md:py-24'>
          <div className='animate-fade-up'>
            <Badge
              variant='secondary'
              className='mb-5 gap-1.5 border-primary/20 bg-primary/10 px-3 py-1 text-primary'>
              <Sparkles className='h-3.5 w-3.5' />
              Trusted tuition marketplace in Bangladesh
            </Badge>

            <h1 className='max-w-xl text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl'>
              Find your ideal <span className='text-gradient'>tutor</span> or
              mentorship batch today
            </h1>

            <p className='mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground'>
              Compare verified tutors by subject, class level, online or home
              tuition, and monthly budget. Apply in one click and track every
              response.
            </p>

            <form
              onSubmit={handleSearch}
              className='mt-7 flex max-w-lg flex-col gap-2 rounded-2xl border bg-card/80 p-2 shadow-sm backdrop-blur sm:flex-row'>
              <div className='relative flex-1'>
                <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search math, physics, IELTS, programming...'
                  className='h-11 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0'
                />
              </div>
              <Button type='submit' size='lg' className='h-11'>
                Search Tuitions
              </Button>
            </form>

            <div className='mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
              <span className='font-medium text-foreground'>Popular:</span>
              {["Math", "Physics", "Programming", "IELTS"].map((subject) => (
                <Link
                  key={subject}
                  href={`/tuitions?subject=${subject}`}
                  className='rounded-full border bg-background/60 px-3 py-1 transition-colors hover:border-primary/40 hover:text-primary'>
                  {subject}
                </Link>
              ))}
            </div>

            <div className='mt-8 flex flex-wrap gap-x-8 gap-y-3'>
              {[
                { label: "Verified tutors", value: stats?.tutors ?? 0 },
                { label: "Students", value: stats?.students ?? 0 },
                { label: "Active tuitions", value: stats?.approvedTuitions ?? 0 },
              ].map((item) => (
                <div key={item.label}>
                  <p className='text-2xl font-bold text-foreground'>
                    {item.value}+
                  </p>
                  <p className='text-xs text-muted-foreground'>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live preview of real approved tuitions */}
          <div className='relative mx-auto w-full max-w-md animate-fade-up'>
            <div className='absolute -inset-6 rounded-[2rem] bg-primary/10 blur-2xl' />
            <div className='relative rounded-3xl border bg-card p-4 shadow-2xl'>
              <div className='mb-3 flex items-center justify-between px-1'>
                <div>
                  <p className='text-sm font-semibold'>Latest approved batches</p>
                  <p className='text-xs text-muted-foreground'>
                    Updated live from MongoDB
                  </p>
                </div>
                <Badge variant='secondary' className='gap-1'>
                  <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500' />
                  Live
                </Badge>
              </div>

              <div className='space-y-2.5'>
                {loading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className='h-[74px] w-full rounded-xl' />
                    ))
                  : tuitions?.slice(0, 3).map((tuition) => (
                      <Link
                        key={tuition._id}
                        href={`/tuitions/${tuition._id}`}
                        className='flex items-center gap-3 rounded-xl border bg-background/70 p-2.5 transition-colors hover:border-primary/40 hover:bg-muted/50'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tuition.bannerImage}
                          alt={tuition.title}
                          className='h-14 w-14 shrink-0 rounded-lg object-cover'
                        />
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-semibold'>
                            {tuition.title}
                          </p>
                          <p className='truncate text-xs text-muted-foreground'>
                            {tuition.subject} • {tuition.mode} •{" "}
                            {tuition.classLevel}
                          </p>
                          <p className='mt-0.5 text-sm font-bold text-primary'>
                            ৳{tuition.monthlyFee.toLocaleString("en-US")}
                            <span className='text-[10px] font-normal text-muted-foreground'>
                              {" "}
                              / month
                            </span>
                          </p>
                        </div>
                        <ArrowRight className='h-4 w-4 shrink-0 text-muted-foreground' />
                      </Link>
                    ))}
              </div>

              <div className='mt-4 grid grid-cols-3 gap-2 border-t pt-4 text-center'>
                <div>
                  <BadgeCheck className='mx-auto h-4 w-4 text-primary' />
                  <p className='mt-1 text-xs font-medium'>Admin approved</p>
                </div>
                <div>
                  <ShieldCheck className='mx-auto h-4 w-4 text-primary' />
                  <p className='mt-1 text-xs font-medium'>Verified tutors</p>
                </div>
                <div>
                  <Star className='mx-auto h-4 w-4 fill-amber-400 text-amber-400' />
                  <p className='mt-1 text-xs font-medium'>
                    {stats?.totalReviews ?? 0} reviews
                  </p>
                </div>
              </div>
            </div>

            <div className='absolute -right-3 -top-4 hidden rotate-3 rounded-xl border bg-card px-3 py-2 shadow-lg sm:block'>
              <p className='flex items-center gap-1.5 text-xs font-semibold'>
                <Users className='h-3.5 w-3.5 text-primary' />
                {stats?.students ?? 0}+ happy students
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Featured tuitions */}
      <section className='py-16 md:py-20'>
        <Container>
          <SectionHeading
            title='Latest Tuitions'
            subtitle='Freshly approved batches and 1-on-1 mentorship from verified tutors.'
          />
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className='h-[430px] w-full rounded-xl' />
                ))
              : tuitions?.map((tuition) => (
                  <TuitionCard key={tuition._id} tuition={tuition} />
                ))}
          </div>
          {!loading && tuitions?.length === 0 && (
            <div className='rounded-2xl border border-dashed bg-muted/30 p-10 text-center'>
              <GraduationCap className='mx-auto h-10 w-10 text-muted-foreground' />
              <p className='mt-3 font-medium'>No approved tuitions yet</p>
              <p className='text-sm text-muted-foreground'>
                New batches appear here after admin approval.
              </p>
            </div>
          )}
          <div className='mt-10 text-center'>
            <Link
              href='/tuitions'
              className={buttonVariants({ variant: "outline", size: "lg" })}>
              View All Tuitions <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. Pricing */}
      <PricingSection />

      {/* 4. How it works */}
      <HowItWorks />

      {/* 5. Subjects, stats and real reviews */}
      <section className='border-y bg-muted/30 py-16 md:py-20'>
        <Container>
          <SectionHeading
            title='Popular Subjects'
            subtitle='Pick a subject and find a tutor right away.'
          />
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
            {subjects.map((subject) => (
              <Link
                key={subject.name}
                href={`/tuitions?subject=${subject.name}`}
                className='group'>
                <Card className='h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-md'>
                  <CardContent className='flex flex-col items-center gap-3 text-center'>
                    <div className='grid h-12 w-12 place-items-center rounded-xl bg-muted transition-colors group-hover:bg-primary/10'>
                      <subject.icon className={`h-6 w-6 ${subject.color}`} />
                    </div>
                    <div>
                      <p className='font-semibold'>{subject.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        Find a tutor
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className='my-14 grid gap-4 sm:grid-cols-3'>
            {[
              {
                label: "Verified Tutors",
                value: stats?.tutors ?? 0,
                icon: BadgeCheck,
              },
              {
                label: "Students Learning",
                value: stats?.students ?? 0,
                icon: Users,
              },
              {
                label: "Active Tuitions",
                value: stats?.approvedTuitions ?? 0,
                icon: BookOpen,
              },
            ].map((item) => (
              <div
                key={item.label}
                className='relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg'>
                <item.icon className='absolute -right-3 -top-3 h-20 w-20 opacity-10' />
                <p className='text-3xl font-bold'>{item.value}+</p>
                <p className='text-sm opacity-90'>{item.label}</p>
              </div>
            ))}
          </div>

          <SectionHeading
            title='What Students Say'
            subtitle='Real reviews from students whose applications were accepted.'
          />

          {reviews && reviews.length > 0 ? (
            <div className='grid gap-6 md:grid-cols-3'>
              {reviews.slice(0, 3).map((review, index) => (
                <Card key={`${review.studentName}-${index}`} className='h-full'>
                  <CardContent className='space-y-4'>
                    <Quote className='h-7 w-7 text-primary/30' />
                    <RatingStars
                      rating={review.rating}
                      count={0}
                      showCount={false}
                    />
                    <p className='line-clamp-5 text-sm leading-relaxed text-muted-foreground'>
                      “{review.feedback}”
                    </p>
                    <div className='border-t pt-3'>
                      <p className='font-semibold'>{review.studentName}</p>
                      <p className='text-xs text-muted-foreground'>
                        {review.tuitionTitle}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className='text-center text-sm text-muted-foreground'>
              Reviews will appear here after students complete a tuition.
            </p>
          )}
        </Container>
      </section>

      {/* 6. Closing CTA */}
      <section className='py-16 md:py-20'>
        <Container>
          <div className='relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary to-indigo-700 px-6 py-12 text-center text-white shadow-xl md:px-12'>
            <div className='absolute inset-0 bg-grid opacity-10' />
            <div className='relative'>
              <p className='text-sm font-medium uppercase tracking-widest text-white/70'>
                Ready when you are
              </p>
              <h2 className='mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl'>
                Start learning with the right mentor today
              </h2>
              <p className='mx-auto mt-3 max-w-xl text-white/80'>
                Join as a student to apply for batches, or join as a tutor to
                publish your tuition and manage applicants.
              </p>
              <div className='mt-7 flex flex-wrap justify-center gap-3'>
                <Link
                  href='/tuitions'
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                  })}>
                  Browse Tuitions
                </Link>
                <Link
                  href='/sign-up'
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className:
                      "border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white",
                  })}>
                  Become a Tutor
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
