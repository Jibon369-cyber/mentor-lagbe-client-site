"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  onSubscribe?: () => void;
};

function Plan({ name, price, features, pro, busy, onSubscribe }: PlanProps) {
  return (
    <Card
      className={`flex h-full flex-col ${pro ? "border-primary shadow-md" : ""}`}>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          {name}
          {pro && <Badge>Popular</Badge>}
        </CardTitle>
        <CardDescription>
          <span className='text-3xl font-bold text-foreground'>{price}</span>
          {pro && " one-time"}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-1'>
        <ul className='space-y-2 text-sm'>
          {features.map((feature) => (
            <li key={feature} className='flex items-start gap-2'>
              <Check className='mt-0.5 h-4 w-4 shrink-0 text-primary' />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {pro ? (
          <Button className='w-full' onClick={onSubscribe} disabled={busy}>
            {busy ? "Redirecting..." : "Subscribe with Stripe"}
          </Button>
        ) : (
          <Button variant='outline' className='w-full' asChild>
            <Link href='/sign-up'>Get Started Free</Link>
          </Button>
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
    <section className='bg-muted/40 py-16'>
      <Container>
        <SectionHeading
          title='Simple Pricing'
          subtitle='Start for free. Upgrade to Pro when you need more.'
        />

        <div className='grid gap-8 lg:grid-cols-2'>
          <div>
            <h3 className='mb-4 text-lg font-semibold'>For Tutors</h3>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Plan
                name='Free Tutor'
                price='$0'
                features={[
                  "Post up to 2 tuitions",
                  "Manage applicants",
                  "Basic profile",
                ]}
              />
              <Plan
                name='Pro Tutor'
                price='$15'
                pro
                busy={busyRole === "tutor"}
                onSubscribe={() => subscribe("tutor")}
                features={[
                  "Unlimited tuition posts",
                  "Verified badge",
                  "Manage applicants",
                  "Priority support",
                ]}
              />
            </div>
          </div>

          <div>
            <h3 className='mb-4 text-lg font-semibold'>For Students</h3>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Plan
                name='Free Student'
                price='$0'
                features={[
                  "Browse all tuitions",
                  "Apply for tuitions",
                  "Track applications",
                ]}
              />
              <Plan
                name='Pro Student'
                price='$10'
                pro
                busy={busyRole === "student"}
                onSubscribe={() => subscribe("student")}
                features={[
                  "Priority booking",
                  "Browse all tuitions",
                  "Track applications",
                  "Priority support",
                ]}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
