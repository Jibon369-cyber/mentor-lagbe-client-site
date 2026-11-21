import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Container from "@/components/Container";
import HowItWorks from "@/components/HowItWorks";

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorks />
      <section className='pb-16'>
        <Container className='grid gap-6 md:grid-cols-2'>
          <div className='rounded-xl border bg-card p-6'>
            <h3 className='text-xl font-semibold'>For Students</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              Browse approved tuitions, filter by subject, class level and mode,
              then apply with your preferred schedule. Track every application
              from your dashboard.
            </p>
            <Link
              href='/tuitions'
              className={buttonVariants({ className: 'mt-4' })}>
              Browse Tuitions
            </Link>
          </div>
          <div className='rounded-xl border bg-card p-6'>
            <h3 className='text-xl font-semibold'>For Tutors</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              Post your batch with a banner image. After admin approval it
              appears on the site, and you can accept or reject applicants.
            </p>
            <Link
              href='/sign-up'
              className={buttonVariants({ className: 'mt-4' })}>
              Join as Tutor
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
