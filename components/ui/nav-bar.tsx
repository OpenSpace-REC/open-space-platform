"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, UserIcon, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const pathname = usePathname();
  const routeName = pathname === "/" ? "" : `/${pathname.slice(1)}`;
  const { user } = useUser();
  const { data: session } = useSession();
  const [sheetState, setSheetState] = useState<boolean>(false);

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  const NavItems = () => (
    <>
      <NavigationMenuItem>
        <Link href="/dashboard" legacyBehavior passHref>
          <NavigationMenuLink className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Dashboard
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/explore-projects" legacyBehavior passHref>
          <NavigationMenuLink className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Explore Projects
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/get-started" legacyBehavior passHref>
          <NavigationMenuLink>
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10  rounded-full transition-all " />
              <Button 
                variant="ghost"
                className="relative px-4 py-2 text-sm font-medium text-white border border-white/20 rounded-full  transition-all duration-300 "
              >
                Get Started
              </Button>
            </div>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </>
  );

  return (
    <header className="sticky top-0 w-full py-4 px-4 bg-background/80 dark:bg-neutral-900/80 backdrop-blur-lg border-b border-border z-50">
      <div className="w-full flex justify-between items-center h-auto max-w-7xl mx-auto">
        <Link href="/dashboard" className="text-3xl font-bold text-primary truncate md:text-clip" aria-label="Home">
          <span className="hidden sm:inline">/Open-Space</span>
          <span className="sm:hidden">/OS</span>
          {routeName && <span className="text-muted-foreground hidden sm:inline">{routeName}</span>}
        </Link>

        {session ? (
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <NavigationMenu>
                <NavigationMenuList className="flex items-center space-x-4">
                  <NavItems />
                </NavigationMenuList>
              </NavigationMenu>

              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage
                      src={user?.githubAvatarUrl}
                      alt="User avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                    <AvatarFallback className="rounded-full">
                      {user?.name ? getUserInitials(user.name) : "NN"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.githubAvatarUrl}
                        alt="User avatar"
                        className="h-full w-full object-cover rounded-full"
                      />
                      <AvatarFallback className="rounded-full">
                        {user?.name ? getUserInitials(user.name) : "NN"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">{user?.name}</span>
                      <span className="text-xs text-muted-foreground mt-1 leading-none">{user?.email}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href={`/profile/${user?.githubUsername}`}>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={sheetState} onOpenChange={() => setSheetState(prev => !prev)}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative -mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:w-[350px] p-0 [&>button]:hidden">
                  <div className="flex flex-col h-full">
                    <div className="grid grid-cols-[90%_10%] items-center w-full p-4 border-b border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">/Open-Space</span>
                        <div className="flex items-center gap-2">
                          <ThemeToggle />
                        </div>
                      </div>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </SheetClose>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <div className="flex flex-col p-4 space-y-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user?.githubAvatarUrl}
                              alt="User avatar"
                              className="h-full w-full object-cover rounded-full"
                            />
                            <AvatarFallback className="rounded-full">
                              {user?.name ? getUserInitials(user.name) : "NN"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-base font-medium leading-none truncate">{user?.name}</span>
                            <span className="text-sm text-muted-foreground mt-1 truncate">{user?.email}</span>
                          </div>
                        </div>

                        <nav className="space-y-1">
                          <Link onClick={() => setSheetState(prev => !prev)} href="/dashboard" className="w-full h-[50px]">
                            <Button variant="ghost" className="w-full justify-start text-base">
                              Dashboard
                            </Button>
                          </Link>
                          <Link onClick={() => setSheetState(prev => !prev)} href="/explore-projects" className="w-full h-[50px]">
                            <Button variant="ghost" className="w-full justify-start text-base">
                              Explore Projects
                            </Button>
                          </Link>
                        </nav>
                      </div>
                    </div>

                    <div className="border-t border-border p-4 flex items-center justify-between w-full">
                      <Link href="/profile" className="w-[44px] h-[44px] bg-gray-50/10 rounded-full text-base flex items-center justify-center">
                        <Button variant="ghost" className="w-full h-full justify-start text-base p-3">
                          <UserIcon className="h-[40px] w-[40px] block scale-95" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-[44px] h-[44px] justify-start text-base text-red-500 hover:text-red-500 hover:bg-red-50/10 p-3"
                        onClick={() => signOut()}
                      >
                        <LogOut className="h-[40px] w-[40px] block scale-95" />
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        ) : (
          <Link href="/google-signin">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
