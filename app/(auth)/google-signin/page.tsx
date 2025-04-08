"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { signOut as signOutAuth } from 'next-auth/react';
import { Input } from "@/components/ui/input";
import SignIn from "@/components/auth/sign-in";
import SignOut from "@/components/auth/sign-out";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SignUpPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [name, setName] = useState(""); 
    const userEmail = session?.user?.email || "";
    const googleId = session?.googleId || "";
    const { toast } = useToast();

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const navigateToDashboard = () => {
        console.log("Navigating to dashboard...");
        router.replace("/dashboard");
    };

    const handleConfirm = async () => {
        if (!session) return;
        try {
            console.log("Sending create-user request...");
            const response = await fetch("/api/create-user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: userEmail,
                    googleId: googleId,
                }),
            });

            console.log("Create user response status:", response.status);

            if (response.status === 403) {
                toast({
                    title: "Access Restricted",
                    description: "You don't have access to the platform at this time.",
                    variant: "destructive",
                    duration: 5000,
                });
                await signOutAuth();
                router.push("/restricted");
                return;
            }

            if (response.status === 302) {
                toast({
                    title: "Next Step",
                    description: "Please link your GitHub account to continue.",
                    variant: "default",
                    duration: 5000,
                });
                router.push("/github-link");
            } else if (response.status === 409) {
                toast({
                    title: "Welcome Back!",
                    description: "Account found. Redirecting to dashboard...",
                    variant: "default",
                    duration: 5000,
                });
                // Wait for toast to be visible
                setTimeout(navigateToDashboard, 1000);
            } else if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                const data = await response.json();
                console.log("Success:", data);
                toast({
                    title: "Success",
                    description: "Account created successfully!",
                    variant: "default",
                    duration: 5000,
                });
                router.push("/github-link");
            }
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
                duration: 5000,
            });
        }
    };

    return (
        <main className="w-screen h-screen flex items-center justify-center p-4">
            <Card className="bg-zinc-950 text-white w-[90%] max-w-[400px] p-4 sm:p-6 rounded-lg shadow-lg border border-white border-opacity-30">
                <CardHeader className="space-y-2">
                    <p className="flex items-center justify-center font-semibold text-2xl sm:text-4xl">/Open-Space</p>
                    <p className="text-center text-xs sm:text-sm text-gray-400">Early Access Beta</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:gap-4 mt-2">
                    {!session && (
                        <SignIn buttonText="Sign in with Google" providerName="google">
                            <FaGoogle className="text-sm sm:text-base" />
                        </SignIn>
                    )}

                    {session && (
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={handleNameChange}
                                    className="text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <Input 
                                    id="email" 
                                    value={userEmail} 
                                    readOnly 
                                    className="text-sm sm:text-base"
                                />
                            </div>
                            <Button 
                                onClick={handleConfirm} 
                                className="bg-white text-black text-sm sm:text-base py-2 sm:py-3"
                            >
                                Confirm
                            </Button>
                            <SignOut />
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
