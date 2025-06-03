'use server';

import {signIn} from "@/auth";
import {redirect} from "next/navigation";

export async function googleSignIn() {
  try {
    await signIn("google", {redirectTo: "/dashboard"});
  } catch (error) {
    // If sign in fails, redirect to login with error
    redirect("/login?error=OAuthSignin");
  }
}