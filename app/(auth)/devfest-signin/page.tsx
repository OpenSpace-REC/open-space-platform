"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";
import { useSession } from "next-auth/react";
import SignIn from "@/components/auth/sign-in";
import { toast } from "sonner";

export default function DevFestSignInPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const userEmail = session?.user?.email || "";
    const googleId = session?.googleId || "";

    const handleUserCreation = useCallback(async () => {
        if (!session) return;
        
        try {
            const response = await fetch("/api/create-devfest-user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: session.user?.name,
                    email: userEmail,
                    googleId: googleId,
                }),
            });

            if (response.ok || response.status === 409) {
                toast.success("Successfully signed in!");
                router.push("/devfest"); 
            } else {
                throw new Error('Failed to create user');
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to sign in. Please try again.");
        }
    }, [session, router, userEmail, googleId]);

    useEffect(() => {
        if (session?.user) {
            handleUserCreation();
        }
    }, [session, handleUserCreation]);

    return (
        <main className="w-screen h-screen flex items-center justify-center">
            <Card className="bg-zinc-950 text-white w-[90%] max-w-[400px] p-6 rounded-lg shadow-lg border border-white border-opacity-30">
                <CardHeader>
                    <p className="flex items-center justify-center font-semibold text-4xl">/Open-Space X DevFest'24</p>
                    <p className="text-center text-sm mt-2 text-gray-400">Sign in to vote for your favorite DevSpirit project</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {!session && (
                        <SignIn buttonText="Sign in with Google" providerName="google">
                            <FaGoogle />
                        </SignIn>
                    )}
                </CardContent>
            </Card>
        </main>
    );
} 