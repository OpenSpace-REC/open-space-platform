import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      
    }),
    GitHub({
      authorization: {
        params: {
          scope: "repo admin:repo_hook",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        if (account.provider === "github") {
          token.accessTokenGitHub = account.access_token
          token.githubId = account.providerAccountId
        }
        if (account.provider === "google") {
          token.email = user.email 
          token.googleId = account.providerAccountId
        }
      }
      if (user) {
        token.id = user.id
        token.email = user.email 
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.githubId = token.githubId as string
      session.user.email = token.email as string // Include the email in the session
      session.accessToken = token.accessToken as string
      return session
    },
  },
})