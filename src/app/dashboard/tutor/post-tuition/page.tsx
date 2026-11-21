"use client";

import { useRouter } from "next/navigation";
import { Info, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";
import TuitionForm, { type TuitionFormData } from "@/components/TuitionForm";
import { useAuth } from "@/context/AuthContext";
import { api, errorMessage } from "@/lib/api";

export default function PostTuitionPage() {
  const router = useRouter();
  const { user } = useAuth();

  async function handleSubmit(data: TuitionFormData) {
    try {
      await api("/tutor/tuitions", { method: "POST", body: data });
      toast.success("Tuition posted! Waiting for admin approval.");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (error) {
      // e.g. free plan limit reached
      toast.error(errorMessage(error));
    }
  }

  return (
    <div className='max-w-3xl'>
      <PageTitle
        title='Post a Tuition'
        description='Add a clear banner, schedule and fee. Every new post is reviewed by an admin.'
      />

      <div className='mb-4 flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between'>
        <p className='flex items-start gap-2 text-sm text-muted-foreground'>
          <Info className='mt-0.5 h-4 w-4 shrink-0 text-primary' />
          {user?.plan === "pro"
            ? "You are on the Pro plan, so you can post unlimited tuitions."
            : "Free plan: up to 2 tuition posts. Upgrade to Pro for unlimited posts and a verified badge."}
        </p>
        {user?.plan !== "pro" && (
          <Link
            href='/pricing'
            className={buttonVariants({
              size: "sm",
              className: "shrink-0",
            })}>
            <Sparkles className='mr-1.5 h-3.5 w-3.5' /> Upgrade
          </Link>
        )}
      </div>

      <Card>
        <CardContent>
          <TuitionForm submitLabel='Post Tuition' onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
