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
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const protectedPaths = ['/landing', '/profile', '/settings']
      const isProtected = protectedPaths.some(path => nextUrl.pathname.startsWith(path))
      
      if (isProtected) {
        if (isLoggedIn) return true
        return false 
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/google-signin', 
  },
})

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*']
}