// src/components/google-signin-button.tsx
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`
        }
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Google Sign In error:", error);
      toast.error("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      variant="outline"
      className="w-full"
      disabled={isLoading}
    >
      {!isLoading && (
        <Image 
          src="/google-icon.svg" 
          width={20} 
          height={20} 
          alt="Google Logo" 
          className="mr-2" 
        />
      )}
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}