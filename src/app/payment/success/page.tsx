"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { api, errorMessage } from "@/lib/api";

function SuccessContent() {
  const sessionId = useSearchParams().get("session_id");
  const { user, loading, refreshUser } = useAuth();
  const [status, setStatus] = useState<"checking" | "success" | "failed">(
    "checking",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loading || !user) return; // wait until login is checked

    async function verify() {
      try {
        const data = await api<{ message: string }>("/payments/verify", {
          method: "POST",
          body: { sessionId },
        });
        await refreshUser(); // plan is now "pro"
        setMessage(data.message);
        setStatus("success");
      } catch (error) {
        setMessage(errorMessage(error));
        setStatus("failed");
      }
    }
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.email, sessionId]);

  if (status === "checking") return <Loader />;

  return (
    <div className='flex min-h-[70vh] flex-col items-center justify-center px-4 text-center'>
      {status === "success" ? (
        <CheckCircle2 className='h-16 w-16 text-green-600' />
      ) : (
        <XCircle className='h-16 w-16 text-red-600' />
      )}
      <h1 className='mt-4 text-2xl font-bold'>
        {status === "success"
          ? "Payment Successful"
          : "Payment Verification Failed"}
      </h1>
      <p className='mt-2 text-muted-foreground'>{message}</p>
      <Button asChild className='mt-6'>
        <Link href='/dashboard'>Go to Dashboard</Link>
      </Button>
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
