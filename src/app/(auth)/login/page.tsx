// src/app/(auth)/login/page.tsx
'use client';

import { Suspense } from 'react';
import LoginForm from "@/components/LoginForm";
import Link from 'next/link';
import {Separator} from '@/components/ui/separator';
import {GoogleSignInButton} from "@/components/google-signin-button";

// A fallback component to show while the content is loading
function LoginFormFallback() {
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center animate-pulse">
        <div className="h-8 w-48 bg-muted rounded mx-auto"></div>
        <div className="h-4 w-64 bg-muted rounded mx-auto"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-16 bg-muted rounded"></div>
        <div className="h-10 bg-muted rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 w-16 bg-muted rounded"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
        <div className="h-10 bg-muted rounded"></div>
      </div>
      <div className="h-10 bg-muted rounded mt-6"></div>
    </div>
  );
}

export default function Login() {
  return (
    <>
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full"/>
        </div>
        <div className="relative flex justify-center items-center text-xs uppercase py-6">
          <hr className='flex-1'></hr>
          <span className="bg-background px-2 text-muted-foreground">OR</span>
          <hr className='flex-1'></hr>
        </div>
      </div>

      <Suspense fallback={<div className="h-10 bg-muted rounded"></div>}>
        <GoogleSignInButton />
      </Suspense>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don&apos;t have an account?</span>{" "}
        <Link
          href="/register"
          className="font-semibold text-yellow-500 hover:text-yellow-600 transition-colors"
        >
          Sign up
        </Link>
      </div>
    </>
  );
}