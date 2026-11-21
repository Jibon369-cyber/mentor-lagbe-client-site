"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className='flex min-h-[70vh] flex-col items-center justify-center px-4 text-center'>
      <h1 className='text-2xl font-bold'>Something went wrong</h1>
      <p className='mt-2 text-muted-foreground'>
        An unexpected error happened. Please try again.
      </p>
      <div className='mt-6 flex gap-3'>
        <Button variant='outline' onClick={reset}>
          Try Again
        </Button>
        <Button asChild>
          <Link href='/'>Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
