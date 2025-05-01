"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface GoogleSignInButtonProps {
  className?: string;
}

export function GoogleSignInButton({ className }: GoogleSignInButtonProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button
        variant="outline"
        className={`w-full py-4 flex items-center gap-2 ${className}`}
        type="submit"
      >
        <Image
          src="/google-icon.svg"
          alt="Google logo"
          width={24}
          height={24}
        />
        <span>Sign in with Google</span>
      </Button>
    </form>
  );
}