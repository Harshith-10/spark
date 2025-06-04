import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const {handlers, signIn, signOut, auth} = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.sub;
      }
      return token;
    },    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      return session;
    },
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