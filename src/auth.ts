import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const {handlers, signIn, signOut, auth} = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async redirect({url, baseUrl}) {
      // Always redirect to dashboard after successful sign in
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Ensure errors are handled properly
  debug: process.env.NODE_ENV === "development",
});