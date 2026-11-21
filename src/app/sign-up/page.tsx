"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BadgeCheck, GraduationCap, Users } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GoogleButton from "@/components/GoogleButton";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "tutor">("student");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [authLoading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("All fields are required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      plan: "free",
      phone: "",
      bio: "",
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Sign up failed");
      return;
    }

    toast.success("Account created successfully!");
    router.push("/dashboard");
  }

  return (
    <div className='relative overflow-hidden'>
      <div className='absolute inset-0 bg-hero-glow' />
      <div className='relative mx-auto grid min-h-[80vh] w-full max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-2'>
        <div className='hidden lg:block'>
          <Logo />
          <h1 className='mt-8 max-w-md text-4xl font-bold leading-tight tracking-tight'>
            Join the right <span className='text-gradient'>learning network</span>
          </h1>
          <p className='mt-4 max-w-md text-muted-foreground'>
            Create a free account as a student looking for guidance or a tutor
            ready to publish batches and manage applicants.
          </p>

          <div className='mt-8 grid gap-4 sm:grid-cols-2'>
            <div className='rounded-xl border bg-card/70 p-4 shadow-sm backdrop-blur'>
              <Users className='h-6 w-6 text-primary' />
              <p className='mt-3 font-semibold'>For Students</p>
              <p className='mt-1 text-sm text-muted-foreground'>
                Search approved tuitions, apply, save favourites and review
                accepted classes.
              </p>
            </div>
            <div className='rounded-xl border bg-card/70 p-4 shadow-sm backdrop-blur'>
              <GraduationCap className='h-6 w-6 text-primary' />
              <p className='mt-3 font-semibold'>For Tutors</p>
              <p className='mt-1 text-sm text-muted-foreground'>
                Post up to 2 tuitions free, upload a banner and manage every
                applicant.
              </p>
            </div>
          </div>

          <p className='mt-5 flex items-center gap-2 text-sm text-muted-foreground'>
            <BadgeCheck className='h-4 w-4 text-emerald-500' />
            Every tuition listing is reviewed by an admin before it goes live.
          </p>
        </div>

        <Card className='mx-auto w-full max-w-md shadow-xl'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl'>Create your account</CardTitle>
            <CardDescription>
              Join MentorLagbe as a student or a tutor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mb-4 space-y-2'>
              <Label>I am a</Label>
              <Select
                value={role}
                onValueChange={(value) =>
                  value && setRole(value as "student" | "tutor")
                }>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='student'>Student</SelectItem>
                  <SelectItem value='tutor'>Tutor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <GoogleButton
              role={role}
              label={`Sign up with Google as a ${role}`}
            />

            <div className='my-5 flex items-center gap-3'>
              <div className='h-px flex-1 bg-border' />
              <span className='text-xs text-muted-foreground'>
                or use your email
              </span>
              <div className='h-px flex-1 bg-border' />
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  autoComplete='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Your full name'
                />
              </div>
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
                  autoComplete='new-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='At least 8 characters'
                />
              </div>
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <p className='mt-4 text-center text-sm text-muted-foreground'>
              Already have an account?{" "}
              <Link
                href='/sign-in'
                className='font-medium text-primary hover:underline'>
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
