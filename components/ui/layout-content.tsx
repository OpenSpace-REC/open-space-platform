
"use client";

import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/nav-bar";
import NavBarPublic from "@/components/ui/nav-bar-public";
import { Toaster } from "@/components/ui/toaster";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  return (
    <>
      {session ? <Navbar /> : <NavBarPublic />}
      {children}
      <Toaster />
    </>
  );
};

export default LayoutContent;
