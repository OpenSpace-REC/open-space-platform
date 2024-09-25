import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({

    }),
    
  ],
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      
        
        
        if (account?.provider === "google") {
          token.googleId = account.providerAccountId;
        }  
        

      return token;
    },
    async session({ session, token }) {
      session.providers = token.providers;
      session.googleId = token.googleId;
      return session;
    },
  },



})