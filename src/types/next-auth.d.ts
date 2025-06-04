import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]
    accessToken?: string;
  }

  interface JWT {
    accessToken?: string;
    id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    id?: string;
  }
}
