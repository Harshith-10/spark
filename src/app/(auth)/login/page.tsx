// src/app/(auth)/login/page.tsx
import LoginForm from "@/components/LoginForm";
import Link from 'next/link';
import {Separator} from '@/components/ui/separator';
import {GoogleSignInButton} from "@/components/google-signin-button";
import {Alert, AlertDescription} from '@/components/ui/alert';
import {AlertCircle} from 'lucide-react';

interface LoginPageProps {
  searchParams: {
    error?: string;
  };
}

export default function Login({searchParams}: LoginPageProps) {
  const error = searchParams.error;
  
  // Map NextAuth error codes to user-friendly messages
  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access denied. You may have cancelled the login process.';
      case 'Verification':
        return 'The verification token is invalid or has expired.';
      case 'OAuthSignin':
        return 'Error signing in with OAuth provider.';
      case 'OAuthCallback':
        return 'Error in OAuth callback handler.';
      case 'OAuthCreateAccount':
        return 'Could not create OAuth account.';
      case 'EmailCreateAccount':
        return 'Could not create email account.';
      case 'Callback':
        return 'Error in callback handler.';
      case 'OAuthAccountNotLinked':
        return 'This account is already linked to another user.';
      case 'EmailSignin':
        return 'Error sending email verification.';
      case 'CredentialsSignin':
        return 'Invalid credentials provided.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4"/>
          <AlertDescription>
            {getErrorMessage(error)}
          </AlertDescription>
        </Alert>
      )}
      
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