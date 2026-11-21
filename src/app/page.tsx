"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Atom,
  BookOpen,
  Calculator,
  Code,
  Dna,
  FlaskConical,
  GraduationCap,
  Languages,
  Search,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import TuitionCard from "@/components/TuitionCard";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import { useFetch } from "@/hooks/useFetch";
import type { Tuition } from "@/lib/types";

const subjects = [
  { name: "Math", icon: Calculator },
  { name: "Physics", icon: Atom },
  { name: "Chemistry", icon: FlaskConical },
  { name: "Biology", icon: Dna },
  { name: "English", icon: BookOpen },
  { name: "Programming", icon: Code },
  { name: "IELTS", icon: Languages },
  { name: "ICT", icon: GraduationCap },
];

const testimonials = [
  {
    name: "Ayesha Rahman",
    role: "HSC Student",
    text: "I found a great Physics tutor in one day. The application process was very easy.",
  },
  {
    name: "Md. Imran Hossain",
    role: "Tutor",
    text: "I posted my batch and got my first students within a week. Managing applicants is simple.",
  },
  {
    name: "Sadia Akter",
    role: "Parent",
    text: "I could compare fees, mode and location in one place. Very helpful for our family.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: tuitions, loading } = useFetch<Tuition[]>("/tuitions/latest");
  const { data: stats } = useFetch<{
    tutors: number;
    students: number;
    approvedTuitions: number;
  }>("/stats");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    router.push(`/tuitions?search=${encodeURIComponent(search)}`);
  }

  return (
    <>
      {/* 1. Hero */}
      <section className='bg-gradient-to-b from-indigo-50 to-white py-16 md:py-24'>
        <Container className='grid items-center gap-10 md:grid-cols-2'>
          <div>
            <Badge variant='secondary' className='mb-4'>
              Trusted by students across Bangladesh
            </Badge>
            <h1 className='text-4xl font-bold leading-tight tracking-tight md:text-5xl'>
              Find Your Ideal Tutor or Mentorship Batch Today
            </h1>
            <p className='mt-4 text-lg text-muted-foreground'>
              Search verified tutors by subject, class level, mode and monthly
              budget. Apply in one click.
            </p>

            <form onSubmit={handleSearch} className='mt-6 flex max-w-md gap-2'>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search math, physics, IELTS...'
              />
              <Button type='submit'>
                <Search className='mr-1 h-4 w-4' /> Search
              </Button>
            </form>
            <Button variant='link' asChild className='mt-2 px-0'>
              <Link href='/tuitions'>Or browse all tuitions →</Link>
            </Button>
          </div>

          {/* Hero visual (replace with your own photo if you like) */}
          <div className='hidden md:block'>
            <div className='space-y-4 rounded-2xl border bg-white p-6 shadow-lg'>
              {[
                {
                  title: "Class 10 Math Batch",
                  meta: "Offline • Dhanmondi",
                  fee: "৳2,500",
                },
                {
                  title: "HSC Physics Crash Course",
                  meta: "Online • Zoom",
                  fee: "৳3,000",
                },
                {
                  title: "IELTS Band 7+ Preparation",
                  meta: "Online • Google Meet",
                  fee: "৳4,500",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className='flex items-center justify-between rounded-lg border p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='rounded-lg bg-primary/10 p-2 text-primary'>
                      <GraduationCap className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-semibold'>{item.title}</p>
                      <p className='text-sm text-muted-foreground'>
                        {item.meta}
                      </p>
                    </div>
                  </div>
                  <p className='font-semibold text-primary'>{item.fee}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Featured tuitions */}
      <section className='py-16'>
        <Container>
          <SectionHeading
            title='Latest Tuitions'
            subtitle='Freshly approved batches and 1-on-1 mentorship from our tutors.'
          />
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className='h-96 w-full' />
                ))
              : tuitions?.map((tuition) => (
                  <TuitionCard key={tuition._id} tuition={tuition} />
                ))}
          </div>
          {!loading && tuitions?.length === 0 && (
            <p className='text-center text-muted-foreground'>
              No tuitions available yet.
            </p>
          )}
          <div className='mt-8 text-center'>
            <Button variant='outline' asChild>
              <Link href='/tuitions'>View All Tuitions</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 3. Pricing */}
      <PricingSection />

      {/* 4. How it works */}
      <HowItWorks />

      {/* 5. Subjects, stats, testimonials */}
      <section className='bg-muted/40 py-16'>
        <Container>
          <SectionHeading
            title='Popular Subjects'
            subtitle='Pick a subject and find a tutor right away.'
          />
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
            {subjects.map((subject) => (
              <Link
                key={subject.name}
                href={`/tuitions?subject=${subject.name}`}>
                <Card className='h-full transition-shadow hover:shadow-md'>
                  <CardContent className='flex flex-col items-center gap-2 text-center'>
                    <subject.icon className='h-8 w-8 text-primary' />
                    <p className='font-medium'>{subject.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className='my-12 grid gap-4 sm:grid-cols-3'>
            {[
              { label: "Verified Tutors", value: stats?.tutors },
              { label: "Students", value: stats?.students },
              { label: "Active Tuitions", value: stats?.approvedTuitions },
            ].map((item) => (
              <div
                key={item.label}
                className='rounded-xl bg-primary p-6 text-center text-primary-foreground'>
                <p className='text-3xl font-bold'>{item.value ?? 0}+</p>
                <p className='text-sm opacity-90'>{item.label}</p>
              </div>
            ))}
          </div>

          <SectionHeading title='What People Say' />
          <div className='grid gap-6 md:grid-cols-3'>
            {testimonials.map((item) => (
              <Card key={item.name} className='h-full'>
                <CardContent className='space-y-3'>
                  <div className='flex gap-1 text-amber-500'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className='h-4 w-4 fill-current' />
                    ))}
                  </div>
                  <p className='text-sm text-muted-foreground'>“{item.text}”</p>
                  <div>
                    <p className='font-semibold'>{item.name}</p>
                    <p className='text-xs text-muted-foreground'>{item.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
