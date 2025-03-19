import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/src/lib/prisma";
import authConfig from "./auth.config"
import { getUserById } from "@/src/data/user";


export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",    
    error: "/auth/error",    
  },
  callbacks: {
    async signIn({user, account}) {
      if(account?.provider !== "credentials") {
        return true
      }
      const existingUser = await getUserById(user.id as string);
      if(!existingUser?.emailVerified) {
        return false;      
      }
      return true
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,    
})