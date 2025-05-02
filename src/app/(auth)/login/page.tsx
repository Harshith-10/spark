// src/app/(auth)/login/page.tsx
import LoginForm from "@/components/LoginForm";
import Link from 'next/link';
import {Separator} from '@/components/ui/separator';
import {GoogleSignInButton} from "@/components/google-signin-button";

export default function Login() {
  return (
    <>
      <LoginForm/>

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

      <GoogleSignInButton/>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don&apos;t have an account?</span>{" "}
        <Link
          href="/register"
          className="font-semibold text-yellow-500 hover:text-yellow-600 transition-colors"
        >
          Sign up
        </Link>
      </div>

      <div className="mt-6 p-3 border rounded-md text-sm text-muted-foreground bg-muted/50">
        <p className="font-medium mb-1">Note</p>
        <p>All login attempts will redirect to the dashboard in this simplified version.</p>
      </div>
    </>
  );
}