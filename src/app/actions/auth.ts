'use server';

import {signIn} from "@/auth";
import {redirect} from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function googleSignIn() {
  try {
    await signIn("google", {redirectTo: "/dashboard"});
  } catch (error) {
    if (isRedirectError(error)) {
      // If the error is a redirect error, it means the sign-in was successful but redirected
      throw error;
    }
    // If sign in fails, redirect to login with error
    redirect(`/login?error=OAuthSignin&desc=${error instanceof Error ? encodeURIComponent(error.message) : 'An error occurred during sign in.'}`);
  }
}