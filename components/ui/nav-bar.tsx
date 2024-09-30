"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useUser } from "../user-context";

export default function Navbar() {
  const pathname = usePathname();
  const routeName = pathname === "/" ? "" : `/${pathname.slice(1)}`;
  const { user } = useUser();

  // Fallback initials based on user name if available
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <header className="sticky top-0 w-full pt-6 pb-6 ps-5 border-b-1">
      <div className="w-full flex justify-between items-center h-auto px-4">
        <Link href="/" className="text-4xl font-bold" aria-label="Home">
          /Open-Space
          {routeName && <span className="text-gray-500">{routeName}</span>}
        </Link>

        <div className="flex items-center space-x-4">
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

          <Link href="/profile" legacyBehavior passHref>
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage
                src={user?.githubAvatarUrl}
                alt="User avatar"
                className="h-full w-full object-cover rounded-3xl"
              />
              <AvatarFallback className="h-full w-full flex items-center justify-center text-sm font-medium">
                {user?.name ? getUserInitials(user.name) : "NN"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
