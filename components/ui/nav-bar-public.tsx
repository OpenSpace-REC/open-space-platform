"use client"

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, NavigationMenuLink } from "@radix-ui/react-navigation-menu"
import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

export default function NavbarPublic() {

   

    return (
        <header className="sticky top-0 w-full bg-background pt-6 pb-6 ps-5">
            <div className="w-full flex justify-between items-center h-auto px-4"> 
                
                <Link href="/" className="text-4xl font-bold">
                    /Open-Space
                  
                </Link>
                
                
                <div className="flex items-center space-x-4">
                
                    <NavigationMenu>
                        <NavigationMenuList className="flex space-x-4">
                            <NavigationMenuItem>
                                <Link href="/landing" legacyBehavior passHref>
                                    <NavigationMenuLink className="px-3 py-2 text-md font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                                        Explore Projects
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <NavigationMenu>
                        <NavigationMenuList className="flex space-x-4">
                            <NavigationMenuItem>
                                <Link href="/landing" legacyBehavior passHref>
                                    <NavigationMenuLink className="px-3 py-2 text-md font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                                        Login
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                   
                </div>
            </div>
        </header>
    )
}
