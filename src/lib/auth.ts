import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();
export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true || undefined,
    }),

    Github({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const isValidPassword = await bcrypt.compare(
            credentials?.password as string ?? "", await prisma.user.findUnique({ where: { email: credentials?.email as string } }).then(u => u?.password || "")
          );
          if (isValidPassword) {
            return await prisma.user.findUnique({ where: { email: credentials?.email as string } });
          } else {
            throw new Error("password is incorrect");
          }
        } catch (error: any) {
          error.message = "Invalid credentials";
          throw error;
        }
      }
    })

  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" || "github" ) {

        const existingUser = await prisma.user.findUnique({ where: { email: profile?.email || "" }, });
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: profile?.email,
              name: profile?.name,
            }
          })
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    }

  },
  pages: {
    signIn: "/",
  },
  secret: process.env.AUTH_SECRET

});
