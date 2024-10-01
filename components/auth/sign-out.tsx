"use client"
import { signIn, signOut } from "next-auth/react"

import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa";

export default function SignOut() {

    const handleSignIn = async () => {
        const result = await signOut();
        
    };

    return <Button onClick={handleSignIn} className="w-full bg-white text-black hover:text-white flex gap-2">
        Sign Out
        <FaGoogle />
    </Button>
}