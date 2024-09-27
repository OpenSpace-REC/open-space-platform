"use client"

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, NavigationMenuLink } from "@radix-ui/react-navigation-menu"
import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

export default function Navbar() {
    const pathname = usePathname()
    const routeName = pathname === '/' ? '' : `/${pathname.slice(1)}`
    const [githubProfileUrl, setGithubProfileUrl] = useState("")

    useEffect(() => {
        async function fetchGithubProfileUrl() {
            try {
                const response = await fetch('/api/user')
                const data = await response.json()
                setGithubProfileUrl(data.githubAvatarUrl)
            } catch (error) {
                console.error("Failed to fetch GitHub profile URL:", error)
            }
        }

        fetchGithubProfileUrl()
    }, [])

    return (
        <header className="sticky top-0 w-full pt-6 pb-6 ps-5 border-b-1">

            <div className="w-full flex justify-between items-center h-auto px-4"> 
                
                <Link href="/" className="text-4xl font-bold">
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
                        <AvatarImage src={githubProfileUrl} alt="User avatar" className="h-full w-full object-cover rounded-3xl" />
                        <AvatarFallback className="h-full w-full flex items-center justify-center text-sm font-medium">CN</AvatarFallback>
                    </Avatar>
                    </Link>
                    
                </div>
            </div>
        </header>
    )
}
