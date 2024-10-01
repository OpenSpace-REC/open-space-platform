"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,

} from "@/components/ui/navigation-menu"

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useUser } from "../user-context";
import { Button } from "./button";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function Navbar() {
  const pathname = usePathname();
  const routeName = pathname === "/" ? "" : `/${pathname.slice(1)}`;
  const { user } = useUser();
  const { data: session } = useSession()


  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <header className="sticky top-0 w-full pt-6 pb-6 ps-5  bg-neutral-900 bg-opacity-30 backdrop-blur-lg z-50">
      <div className="w-full flex justify-between items-center h-auto px-4">
        <Link href="/" className="text-4xl font-bold text-primary" aria-label="Home">
          /Open-Space
          {routeName && <span className="text-stone-500">{routeName}</span>}
        </Link>
        {session ?

          <div className="flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-4">
                <NavigationMenuItem>
                  <Link href="/upload-project" legacyBehavior passHref>
                    <Button>Post Project</Button>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-4">
                <NavigationMenuItem>
                  <Link href="/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink className="px-3 py-2 text-md font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>


            <NavigationMenu>
              <NavigationMenuList className="flex space-x-4">
                <NavigationMenuItem>
                  <Link href="/explore-projects" legacyBehavior passHref>
                    <NavigationMenuLink className="px-3 py-2 text-md font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                      Explore Projects
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Avatar className="h-10 w-10 rounded-full">
                <AvatarImage
                  src={user?.githubAvatarUrl}
                  alt="User avatar"
                  className="h-full w-full object-cover rounded-3xl"
                />
                <AvatarFallback className="h-full w-full flex items-center justify-center text-sm font-medium">
                  {user?.name ? getUserInitials(user.name) : "NN"}
                </AvatarFallback>
              </Avatar></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={async () => await signOut()}>Logout</DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>




          </div> : <Button>Login</Button>
        }
      </div>
    </header>
  );
}
