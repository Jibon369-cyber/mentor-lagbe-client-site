import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className='flex min-h-[70vh] flex-col items-center justify-center px-4 text-center'>
      <p className='text-6xl font-bold text-primary'>404</p>
      <h1 className='mt-4 text-2xl font-bold'>Page not found</h1>
      <p className='mt-2 text-muted-foreground'>
        The page you are looking for does not exist.
      </p>
      <Link href='/' className={buttonVariants({ className: 'mt-6' })}>
        Back to Home
      </Link>
    </div>
  );
}
