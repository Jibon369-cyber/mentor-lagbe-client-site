"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, LogIn, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { api, errorMessage } from "@/lib/api";

type Status = "checking" | "success" | "failed" | "signin";
type Result = { status: "success" | "failed"; message: string };

function SuccessContent() {
  const sessionId = useSearchParams().get("session_id");
  const { user, loading, refreshUser } = useAuth();
  const [result, setResult] = useState<Result | null>(null);
  const verified = useRef(false);

  useEffect(() => {
    if (loading || !user || !sessionId || verified.current) return;
    verified.current = true;

    async function verify() {
      try {
        const data = await api<{ message: string }>("/payments/verify", {
          method: "POST",
          body: { sessionId },
        });
        await refreshUser(); // plan is now "pro"
        setResult({ status: "success", message: data.message });
      } catch (error) {
        setResult({ status: "failed", message: errorMessage(error) });
      }
    }

    verify();
    // refreshUser is stable enough for this one-time verification.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, sessionId]);

  const status: Status = loading
    ? "checking"
    : !user
      ? "signin"
      : !sessionId
        ? "failed"
        : (result?.status ?? "checking");

  const message = !user
    ? "Sign in with the account you used at checkout to finish."
    : !sessionId
      ? "This page is missing a Stripe checkout session."
      : (result?.message ?? "");

  if (status === "checking") return <Loader />;

  return (
    <div className='flex min-h-[70vh] flex-col items-center justify-center px-4 text-center'>
      {status === "success" ? (
        <CheckCircle2 className='h-16 w-16 text-emerald-500' />
      ) : status === "signin" ? (
        <LogIn className='h-16 w-16 text-primary' />
      ) : (
        <XCircle className='h-16 w-16 text-destructive' />
      )}
      <h1 className='mt-4 text-2xl font-bold md:text-3xl'>
        {status === "success"
          ? "Payment Successful"
          : status === "signin"
            ? "Sign In to Confirm"
            : "Payment Verification Failed"}
      </h1>
      <p className='mt-2 max-w-md text-muted-foreground'>{message}</p>

      <div className='mt-6 flex flex-wrap justify-center gap-3'>
        {status === "signin" ? (
          <Link href='/sign-in' className={buttonVariants()}>
            Sign In
          </Link>
        ) : status === "success" ? (
          <>
            <Link href='/dashboard' className={buttonVariants()}>
              Go to Dashboard
            </Link>
            <Link
              href='/tuitions'
              className={buttonVariants({ variant: "outline" })}>
              Browse Tuitions
            </Link>
          </>
        ) : (
          <>
            <Link href='/pricing' className={buttonVariants()}>
              Back to Pricing
            </Link>
            <Link
              href='/dashboard'
              className={buttonVariants({ variant: "outline" })}>
              Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SuccessContent />
    </Suspense>
  );
}
