import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/components/user-context";



const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"], 
  display: "swap", 
});

export const metadata: Metadata = {
  title: "/Open-Space(Early Beta)",
  description: "/Open-Space X Devfest 2024 website",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.className} bg-background `}>
        <SessionProvider>
        <UserProvider>
          {children}
          <Toaster />
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

