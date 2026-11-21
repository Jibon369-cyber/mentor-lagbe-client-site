import Link from "next/link";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import Container from "@/components/Container";

function SocialIcon({ path, label }: { path: string; label: string }) {
  return (
    <a
      href='#'
      aria-label={label}
      className='rounded-full border border-slate-700 p-2 text-slate-300 transition-colors hover:bg-primary hover:text-white'>
      <svg
        viewBox='0 0 24 24'
        className='h-4 w-4 fill-current'
        aria-hidden='true'>
        <path d={path} />
      </svg>
    </a>
  );
}

// New X logo (not the old Twitter bird)
const X_PATH =
  "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";
const FACEBOOK_PATH =
  "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z";
const LINKEDIN_PATH =
  "M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z";

export default function Footer() {
  return (
    <footer className='bg-slate-900 text-slate-300'>
      <Container className='grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4'>
        <div>
          <Link
            href='/'
            className='flex items-center gap-2 text-xl font-bold text-white'>
            <GraduationCap className='h-7 w-7' />
            MentorLagbe
          </Link>
          <p className='mt-3 text-sm'>
            Find verified tutors and mentorship batches that fit your subject,
            level and budget.
          </p>
          <div className='mt-4 flex gap-2'>
            <SocialIcon path={X_PATH} label='X' />
            <SocialIcon path={FACEBOOK_PATH} label='Facebook' />
            <SocialIcon path={LINKEDIN_PATH} label='LinkedIn' />
          </div>
        </div>

        <div>
          <h3 className='mb-3 font-semibold text-white'>Quick Links</h3>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link href='/' className='hover:text-white'>
                Home
              </Link>
            </li>
            <li>
              <Link href='/tuitions' className='hover:text-white'>
                Browse Tuitions
              </Link>
            </li>
            <li>
              <Link href='/pricing' className='hover:text-white'>
                Pricing
              </Link>
            </li>
            <li>
              <Link href='/how-it-works' className='hover:text-white'>
                How It Works
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='mb-3 font-semibold text-white'>Get Started</h3>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link href='/sign-up' className='hover:text-white'>
                Sign Up
              </Link>
            </li>
            <li>
              <Link href='/sign-in' className='hover:text-white'>
                Sign In
              </Link>
            </li>
            <li>
              <Link href='/dashboard' className='hover:text-white'>
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='mb-3 font-semibold text-white'>Contact</h3>
          <ul className='space-y-2 text-sm'>
            <li className='flex items-center gap-2'>
              <Mail className='h-4 w-4' /> support@mentorlagbe.com
            </li>
            <li className='flex items-center gap-2'>
              <Phone className='h-4 w-4' /> +880 1700-000000
            </li>
            <li className='flex items-center gap-2'>
              <MapPin className='h-4 w-4' /> Chattogram, Bangladesh
            </li>
          </ul>
        </div>
      </Container>
      <div className='border-t border-slate-800 py-4 text-center text-sm'>
        © {new Date().getFullYear()} MentorLagbe. All rights reserved.
      </div>
    </footer>
  );
}
