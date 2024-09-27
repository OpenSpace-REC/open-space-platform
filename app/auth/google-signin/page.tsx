"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import SignIn from "@/components/auth/sign-in";
import SignOut from "@/components/auth/sign-out";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

export default function SignUpPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [name, setName] = useState(""); 
    const userEmail = session?.user?.email || "";
    const googleId = session?.googleId || "";
    const { toast } = useToast()

    useEffect(() => {
        console.log(JSON.stringify(session));
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleConfirm = async () => {
        if (!session) return;
        try {
            const response = await fetch("/api/auth/create-user", {
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

            if (response.status === 409) {
                toast({
                    title: "User already exists",
                    description: "The account associated with this email already exists.",
                    action: <ToastAction  className="border p-1 rounded-md" altText="Login">Login</ToastAction>,
                });
            } else if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                const data = await response.json();
                console.log("Success:", data);
                router.push("/auth/github-link");
            }


        } catch (error) {
            console.error("Error:", error); 
        }
    };

    return (
        <main className="w-screen h-screen flex items-center justify-center">
            <Card className="bg-zinc-950 text-white w-[90%] max-w-[400px] p-6 rounded-lg shadow-lg border border-white border-opacity-30">
                <CardHeader>
                    <p className="flex items-center justify-center font-semibold text-4xl">/Open-Space</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {!session && (
                        <SignIn buttonText="Sign in with Google" providerName="google">
                            <FaGoogle />
                        </SignIn>
                    )}

                    {session && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                            </div>
                            <div>
                                
                                <Input id="email" value={userEmail} readOnly />
                            </div>
                            <Button onClick={handleConfirm} className="bg-white text-black">Confirm</Button>
                            <SignOut />
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
