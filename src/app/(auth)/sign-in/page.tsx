


"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Sign In Data:", formData);

    // Add your login API here
  };

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-6 rounded-xl border p-8 shadow-sm'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Welcome Back</h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Enter your credentials to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='example@gmail.com'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              placeholder='Enter your password'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div className='text-right'>
            <Link
              href='/forgot-password'
              className='text-sm text-primary hover:underline'>
              Forgot Password?
            </Link>
          </div>

          <Button type='submit' className='w-full'>
            Sign In
          </Button>
        </form>

        <p className='text-center text-sm text-muted-foreground'>
          Don't have an account?{" "}
          <Link
            href='/sign-up'
            className='font-semibold text-primary hover:underline'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
