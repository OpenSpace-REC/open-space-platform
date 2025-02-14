"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; 
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
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
    const [isAllowed, setIsAllowed] = useState(false);
    const [hasCheckedAccess, setHasCheckedAccess] = useState(false);

    const checkAllowedEmail = useCallback(async () => {
        if (!session?.user?.email || hasCheckedAccess) return;
        
        try {
            const response = await fetch('/api/check-access', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: session.user.email
                }),
            });

            setHasCheckedAccess(true);

            if (response.ok) {
                setIsAllowed(true);
                toast({
                    title: "Access Granted",
                    description: "Welcome to Open-Space Beta!",
                    variant: "default",
                    duration: 5000,
                });
            } else {
                toast({
                    title: "Access Denied",
                    description: "Sorry, this app is currently in early access. You're not on the allowed list.",
                    variant: "destructive",
                    duration: 5000,
                });
                setTimeout(() => {
                    signOut({ 
                        callbackUrl: '/',
                        redirect: true 
                    });
                }, 2000);
            }
        } catch (error) {
            console.error("Error checking access:", error);
            setHasCheckedAccess(true);
            toast({
                title: "Error",
                description: "Something went wrong while checking access.",
                variant: "destructive",
                duration: 5000,
            });
        }
    }, [session?.user?.email, hasCheckedAccess, toast]);

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
        if (session?.user?.email && !hasCheckedAccess) {
            checkAllowedEmail();
        }
    }, [session, checkAllowedEmail, hasCheckedAccess]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const navigateToDashboard = useCallback(() => {
        console.log("Navigating to dashboard...");
        router.replace("/dashboard");
    }, [router]);

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

                    {session && isAllowed && (
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
