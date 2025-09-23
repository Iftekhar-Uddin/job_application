import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import authConfig from "../auth.config";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/data/token";
import { getUserByEmail } from "@/data/route";


const prisma = new PrismaClient();



export const { auth, handlers, signIn, signOut } = NextAuth({

  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true || undefined,
    }),

    Github({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true || undefined,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        };

        const user = await prisma.user.findUnique({ where: { email: credentials?.email as string } });

        await generateVerificationToken(credentials?.email as string);

        const isValidPassword = await bcrypt.compare(
          credentials?.password as string ?? "", await prisma.user.findUnique({ where: { email: credentials?.email as string } }).then(u => u?.password || "")
        );

        if (!user || !isValidPassword) {
          throw new Error('No user found');
        };

        if (!isValidPassword) {
          throw new Error('Invalid password');
        };

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }
    })

  ],

  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google" || "github") {
        const existingUser = await prisma.user.findUnique({ where: { email: profile?.email || "" }, });
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: profile?.email,
              name: profile?.name,
            }
          })
        }
      } else {
        if (account?.provider !== "credentials") return true

        const existingUser = await getUserByEmail(user?.email as string);

        if (!existingUser?.emailVerified) return false
      }
      return true;
    },

    async jwt({ token, user }) {
      const existingUser = await prisma.user.findUnique({ where: { email: token?.email || "" }, });
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = existingUser?.role
      }
      return token;
    },

    async session({ session, token }) {

      if (session.user && token.role) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl
    }

  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/",
    error: "/auth/error"
  },

  secret: process.env.AUTH_SECRET

});