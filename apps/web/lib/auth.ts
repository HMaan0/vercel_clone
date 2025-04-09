import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      username?: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.ID_GITHUB || "",
      clientSecret: process.env.SECRET_GITHUB || "",
      authorization: {
        params: {
          scope: "read:user repo user:email",
          prompt: "consent",
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username;
      }
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account && account.access_token) {
        token.username = (profile as { login: string }).login;
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};
