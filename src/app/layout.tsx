import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutShell from "@/components/LayoutShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MentorLagbe - Find Your Ideal Tutor",
  description: "Smart tuition and mentorship platform for students and tutors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
          <Toaster richColors position='top-right' />
        </AuthProvider>
      </body>
    </html>
  );
}
