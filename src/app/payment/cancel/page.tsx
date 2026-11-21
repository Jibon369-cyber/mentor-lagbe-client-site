import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className='mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-12'>
      <Card className='w-full text-center'>
        <CardContent className='py-10'>
          <XCircle className='mx-auto h-16 w-16 text-amber-500' />
          <h1 className='mt-4 text-2xl font-bold'>Payment Cancelled</h1>
          <p className='mt-2 text-muted-foreground'>
            No money was charged. You can upgrade whenever you are ready.
          </p>
          <div className='mt-6 flex flex-wrap justify-center gap-3'>
            <Link
              href='/pricing'
              className={buttonVariants({ variant: "outline" })}>
              <ArrowLeft className='mr-1.5 h-4 w-4' /> Back to Pricing
            </Link>
            <Link href='/dashboard' className={buttonVariants()}>
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
