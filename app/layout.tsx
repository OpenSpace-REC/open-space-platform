import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
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
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <UserProvider>
              {children}
              <Toaster />
              <SonnerToaster position="bottom-right" />
            </UserProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

