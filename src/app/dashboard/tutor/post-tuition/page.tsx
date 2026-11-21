"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";
import TuitionForm, { type TuitionFormData } from "@/components/TuitionForm";
import { api, errorMessage } from "@/lib/api";

export default function PostTuitionPage() {
  const router = useRouter();

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
        description='Free plan: 2 posts. Pro plan: unlimited. Posts need admin approval.'
      />
      <Card>
        <CardContent>
          <TuitionForm submitLabel='Post Tuition' onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
