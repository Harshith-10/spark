// src/components/google-signin-button.tsx
'use client';

import {Button} from "@/components/ui/button";
import Image from "next/image";
import {useTransition} from "react";
import {googleSignIn} from "@/app/actions/auth";

interface GoogleSignInButtonProps {
  className?: string;
}

export function GoogleSignInButton({className}: GoogleSignInButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      className={`w-full flex items-center gap-2 ${className}`}
      onClick={() => startTransition(() => googleSignIn())}
      disabled={isPending}
    >
      {isPending ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        <Image
          src="/google-icon.svg"
          alt="Google logo"
          width={18}
          height={18}
        />
      )}
      <span>{isPending ? "Signing in..." : "Sign in with Google"}</span>
    </Button>
  );
}