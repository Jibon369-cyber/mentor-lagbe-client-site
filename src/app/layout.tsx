import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import LayoutShell from "@/components/LayoutShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "MentorLagbe - Find Your Ideal Tutor",
    template: "%s | MentorLagbe",
  },
  description:
    "MentorLagbe is a smart tuition and mentorship platform that connects verified tutors with students by subject, class level, mode and budget.",
  keywords: [
    "MentorLagbe",
    "tuition Bangladesh",
    "home tutor",
    "online tutor",
    "mentorship",
    "IELTS tutor",
    "programming mentor",
  ],
  openGraph: {
    title: "MentorLagbe - Smart Tuition & Mentorship Platform",
    description:
      "Find verified tutors, compare batches and apply for tuition in one place.",
    type: "website",
    url: appUrl,
    siteName: "MentorLagbe",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#12141f" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('mentorlagbe-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.variable}>
        <ThemeProvider>
          <AuthProvider>
            <LayoutShell>{children}</LayoutShell>
            <Toaster richColors position='top-right' theme='system' />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
