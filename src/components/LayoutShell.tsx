"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Public pages get Navbar + Footer. The dashboard has its own layout.
export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className='min-h-[70vh]'>{children}</main>
      <Footer />
    </>
  );
}
