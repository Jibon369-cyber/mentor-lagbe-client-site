"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type Props = {
  role?: "student" | "tutor";
  label?: string;
};

function GoogleIcon() {
  return (
    <svg viewBox='0 0 24 24' className='h-4 w-4' aria-hidden='true'>
      <path
        fill='#4285F4'
        d='M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z'
      />
      <path
        fill='#34A853'
        d='M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z'
      />
      <path
        fill='#FBBC05'
        d='M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z'
      />
      <path
        fill='#EA4335'
        d='M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z'
      />
    </svg>
  );
}

export default function GoogleButton({ role, label = "Continue with Google" }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      const origin = window.location.origin;
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${origin}/dashboard`,
        errorCallbackURL: `${origin}/sign-in`,
        ...(role ? { additionalData: { role } } : {}),
      });

      if (error) {
        toast.error(
          error.message ||
            "Google sign-in is not available right now. Please use email.",
        );
        setLoading(false);
      }
      // On success BetterAuth redirects the browser to Google.
    } catch {
      toast.error(
        "Google sign-in is not configured yet. Please use email and password.",
      );
      setLoading(false);
    }
  }

  return (
    <Button
      type='button'
      variant='outline'
      className='w-full gap-2'
      onClick={handleClick}
      disabled={loading}>
      <GoogleIcon />
      {loading ? "Redirecting to Google..." : label}
    </Button>
  );
}
