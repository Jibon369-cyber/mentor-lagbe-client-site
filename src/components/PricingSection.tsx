"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { useAuth } from "@/context/AuthContext";
import { api, errorMessage } from "@/lib/api";

type PlanProps = {
  name: string;
  price: string;
  features: string[];
  pro?: boolean;
  busy?: boolean;
  current?: boolean;
  disabled?: boolean;
  onSubscribe?: () => void;
};

function Plan({
  name,
  price,
  features,
  pro,
  busy,
  current,
  disabled,
  onSubscribe,
}: PlanProps) {
  return (
    <Card
      className={`relative flex h-full flex-col ${
        pro ? "border-primary/50 shadow-lg ring-1 ring-primary/10" : ""
      }`}>
      {pro && (
        <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
          <Badge className='gap-1 shadow-sm'>
            <Sparkles className='h-3 w-3' /> Most popular
          </Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          {name}
          {current && <Badge variant='secondary'>Current plan</Badge>}
        </CardTitle>
        <CardDescription>
          <span className='text-4xl font-bold text-foreground'>{price}</span>
          {pro && (
            <span className='text-sm text-muted-foreground'> one-time</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-1'>
        <ul className='space-y-2.5 text-sm'>
          {features.map((feature) => (
            <li key={feature} className='flex items-start gap-2'>
              <span className='mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/10 text-primary'>
                <Check className='h-3 w-3' />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {pro ? (
          <Button
            className='w-full'
            onClick={onSubscribe}
            disabled={busy || current || disabled}>
            {busy
              ? "Redirecting to Stripe..."
              : current
                ? "You are Pro"
                : disabled
                  ? "Admins do not need a plan"
                  : "Subscribe with Stripe"}
          </Button>
        ) : (
          <Link
            href='/sign-up'
            className={buttonVariants({
              variant: "outline",
              className: "w-full",
            })}>
            Get Started Free
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

export default function PricingSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [busyRole, setBusyRole] = useState<string | null>(null);

  async function subscribe(role: "tutor" | "student") {
    if (!user) {
      toast.info("Please sign in first");
      router.push("/sign-in");
      return;
    }
    if (user.role !== role) {
      toast.error(`This plan is only for ${role}s`);
      return;
    }
    if (user.plan === "pro") {
      toast.info("You are already a Pro member");
      return;
    }

    try {
      setBusyRole(role);
      const data = await api<{ url: string }>(
        "/payments/create-checkout-session",
        { method: "POST" },
      );
      window.location.href = data.url; // go to Stripe checkout
    } catch (error) {
      toast.error(errorMessage(error));
      setBusyRole(null);
    }
  }

  return (
    <section className='bg-muted/30 py-16 md:py-20'>
      <Container>
        <SectionHeading
          title='Simple, transparent pricing'
          subtitle='Start for free. Upgrade to Pro when you need more reach, priority and support.'
        />

        <div className='grid gap-10 lg:grid-cols-2'>
          <div>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>For Tutors</h3>
              <Badge variant='outline'>Unlimited reach with Pro</Badge>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Plan
                name='Free Tutor'
                price='$0'
                current={user?.role === "tutor" && user?.plan === "free"}
                features={[
                  "Post up to 2 tuitions",
                  "Manage applicants",
                  "Basic public profile",
                  "Email support",
                ]}
              />
              <Plan
                name='Pro Tutor'
                price='$15'
                pro
                busy={busyRole === "tutor"}
                current={user?.role === "tutor" && user?.plan === "pro"}
                disabled={user?.role === "admin"}
                onSubscribe={() => subscribe("tutor")}
                features={[
                  "Unlimited tuition posts",
                  "Verified Pro badge",
                  "Manage unlimited applicants",
                  "Priority support",
                ]}
              />
            </div>
          </div>

          <div>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>For Students</h3>
              <Badge variant='outline'>Priority booking</Badge>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Plan
                name='Free Student'
                price='$0'
                current={user?.role === "student" && user?.plan === "free"}
                features={[
                  "Browse all tuitions",
                  "Apply for tuitions",
                  "Track applications",
                  "Save tuitions for later",
                ]}
              />
              <Plan
                name='Pro Student'
                price='$10'
                pro
                busy={busyRole === "student"}
                current={user?.role === "student" && user?.plan === "pro"}
                disabled={user?.role === "admin"}
                onSubscribe={() => subscribe("student")}
                features={[
                  "Priority booking",
                  "Unlimited applications",
                  "Early access to new batches",
                  "Priority support",
                ]}
              />
            </div>
          </div>
        </div>

        <p className='mt-8 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground'>
          <ShieldCheck className='h-4 w-4 text-emerald-500' />
          Secure one-time checkout powered by Stripe. No hidden fees.
        </p>
      </Container>
    </section>
  );
}
