import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className='flex min-h-[70vh] flex-col items-center justify-center px-4 text-center'>
      <XCircle className='h-16 w-16 text-amber-500' />
      <h1 className='mt-4 text-2xl font-bold'>Payment Cancelled</h1>
      <p className='mt-2 text-muted-foreground'>
        No money was charged. You can upgrade any time.
      </p>
      <div className='mt-6 flex gap-3'>
        <Button variant='outline' asChild>
          <Link href='/dashboard'>Dashboard</Link>
        </Button>
        <Button asChild>
          <Link href='/pricing'>Back to Pricing</Link>
        </Button>
      </div>
    </div>
  );
}
