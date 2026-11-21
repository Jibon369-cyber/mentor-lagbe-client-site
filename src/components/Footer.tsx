import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Container from "@/components/Container";
import Logo from "@/components/Logo";

function SocialIcon({
  path,
  label,
  href,
}: {
  path: string;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer'
      aria-label={label}
      className='rounded-full border border-white/15 p-2 text-slate-300 transition-colors hover:border-primary hover:bg-primary hover:text-white'>
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
    <footer className='bg-[#0b1020] text-slate-300'>
      <Container className='grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4'>
        <div>
          <Logo textClassName='text-white' iconClassName='bg-white/10' />
          <p className='mt-4 max-w-xs text-sm leading-relaxed text-slate-400'>
            Find verified tutors and mentorship batches that fit your subject,
            level, mode and monthly budget.
          </p>
          <div className='mt-5 flex gap-2'>
            <SocialIcon path={X_PATH} label='X' href='https://x.com' />
            <SocialIcon
              path={FACEBOOK_PATH}
              label='Facebook'
              href='https://facebook.com'
            />
            <SocialIcon
              path={LINKEDIN_PATH}
              label='LinkedIn'
              href='https://linkedin.com'
            />
          </div>
        </div>

        <div>
          <h3 className='mb-4 font-semibold text-white'>Quick Links</h3>
          <ul className='space-y-2.5 text-sm'>
            {[
              ["/", "Home"],
              ["/tuitions", "Browse Tuitions"],
              ["/pricing", "Pricing"],
              ["/how-it-works", "How It Works"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className='text-slate-400 transition-colors hover:text-white'>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className='mb-4 font-semibold text-white'>Get Started</h3>
          <ul className='space-y-2.5 text-sm'>
            {[
              ["/sign-up", "Create an account"],
              ["/sign-in", "Sign In"],
              ["/dashboard", "Dashboard"],
              ["/dashboard/profile", "Update Profile"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className='text-slate-400 transition-colors hover:text-white'>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className='mb-4 font-semibold text-white'>Contact</h3>
          <ul className='space-y-2.5 text-sm text-slate-400'>
            <li className='flex items-center gap-2'>
              <Mail className='h-4 w-4 text-primary' /> support@mentorlagbe.com
            </li>
            <li className='flex items-center gap-2'>
              <Phone className='h-4 w-4 text-primary' /> +880 1700-000000
            </li>
            <li className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-primary' /> Chattogram, Bangladesh
            </li>
          </ul>
          <p className='mt-4 text-xs text-slate-500'>
            Secure payments powered by Stripe.
          </p>
        </div>
      </Container>
      <div className='border-t border-white/10 py-5'>
        <Container className='flex flex-col items-center justify-between gap-2 text-xs text-slate-500 sm:flex-row'>
          <p>
            © {new Date().getFullYear()} MentorLagbe. All rights reserved.
          </p>
          <p>Built for learners and mentors in Bangladesh.</p>
        </Container>
      </div>
    </footer>
  );
}
