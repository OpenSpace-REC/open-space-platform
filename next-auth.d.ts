import "next-auth";

declare module "next-auth" {
  interface Session {
    googleId?: string;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}