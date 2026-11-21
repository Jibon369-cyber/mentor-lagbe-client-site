"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleButton from "@/components/GoogleButton";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [authLoading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }

    toast.success("Signed in successfully!");
    router.push("/dashboard");
  }

  return (
    <div className='relative overflow-hidden'>
      <div className='absolute inset-0 bg-hero-glow' />
      <div className='relative mx-auto grid min-h-[80vh] w-full max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-2'>
        <div className='hidden lg:block'>
          <Logo />
          <h1 className='mt-8 max-w-md text-4xl font-bold leading-tight tracking-tight'>
            Welcome back to your{" "}
            <span className='text-gradient'>learning journey</span>
          </h1>
          <p className='mt-4 max-w-md text-muted-foreground'>
            Sign in to manage applications, post tuitions, review applicants
            and keep your subscription in sync.
          </p>
          <div className='mt-8 space-y-3'>
            {[
              { icon: GraduationCap, text: "Role-based dashboards for students and tutors" },
              { icon: ShieldCheck, text: "Secure BetterAuth sessions with JWT API protection" },
              { icon: Sparkles, text: "Real reviews from accepted students" },
            ].map((item) => (
              <div
                key={item.text}
                className='flex items-center gap-3 rounded-xl border bg-card/70 p-3 text-sm shadow-sm backdrop-blur'>
                <span className='grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary'>
                  <item.icon className='h-4 w-4' />
                </span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <Card className='mx-auto w-full max-w-md shadow-xl'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl'>Welcome back</CardTitle>
            <CardDescription>Sign in to your MentorLagbe account</CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleButton label='Sign in with Google' />

            <div className='my-5 flex items-center gap-3'>
              <div className='h-px flex-1 bg-border' />
              <span className='text-xs text-muted-foreground'>
                or continue with email
              </span>
              <div className='h-px flex-1 bg-border' />
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  autoComplete='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@example.com'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  autoComplete='current-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Your password'
                />
              </div>
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className='mt-4 text-center text-sm text-muted-foreground'>
              New here?{" "}
              <Link
                href='/sign-up'
                className='font-medium text-primary hover:underline'>
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
