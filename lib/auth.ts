import NextAuth, { Session } from "next-auth"
import Google from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"

interface ExtendedSession extends Session {
  providers?: string[]
  googleId?: string
}

interface ExtendedToken extends JWT {
  googleId?: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({

    }),
    
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        (token as ExtendedToken).googleId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      const extendedSession = session as ExtendedSession;
      const extendedToken = token as ExtendedToken;

      extendedSession.googleId = extendedToken.googleId;
      return extendedSession;
    },
    
  },
  pages: {
    signIn: '/auth/google-signin', 
  },
})

