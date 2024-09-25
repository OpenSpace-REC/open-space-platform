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

export default function SignUpPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [name, setName] = useState(""); 
    const userEmail = session?.user?.email || "";
    const googleId = session?.googleId || "";

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

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("Success:", data);


            router.push("/auth/github-link"); 

        } catch (error) {
            console.error("Error:", error); 
        }
    };

    return (
        <main className="w-screen h-screen flex items-center justify-center">
            <Card className="bg-zinc-950 text-white w-[90%] max-w-[400px] p-6 rounded-lg shadow-lg border border-white border-opacity-30">
                <CardContent className="flex flex-col gap-4">
                    {!session && (
                        <SignIn buttonText="Sign in with Google" providerName="google">
                            <FaGoogle />
                        </SignIn>
                    )}

                    {session && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="text-sm font-medium mt-2">Email</label>
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
