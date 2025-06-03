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
      // Ensure redirection to dashboard works properly
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  }
});