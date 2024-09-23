"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import SignIn from "@/components/auth/sign-in";
import { useSession } from "next-auth/react";
import SignOut from "@/components/auth/sign-out";

export default function SignUpPage() {
    const { data: session } = useSession();
    const isUserAvailable = session
    console.log(JSON.stringify(session))
    return (
        <main className="w-screen h-screen flex items-center justify-center">
            <Card className="bg-zinc-950 text-white w-[90%] max-w-[400px] p-6 rounded-lg shadow-lg border border-white border-opacity-30">
                <CardHeader className="text-center mb-4">
                    <h1 className="font-bold text-4xl">/Open-Space</h1>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <SignIn buttonText="Sign In With Google" providerName="google">
                        <FaGoogle />
                    </SignIn>
                    <SignOut />
                    <p className="text-center text-md">And</p>
                    {isUserAvailable && (
                        <SignIn
                            buttonText="Link Github"
                            providerName="github"
                        >
                            <FaGithub />
                        </SignIn>
                    )
                    }
                    {!isUserAvailable && (
                        <Button
                            disabled
                            className="w-full bg-gray-500 text-white flex gap-2 justify-center items-center"
                        >
                            Link Github
                            <FaGithub />
                        </Button>
                    )}
                </CardContent>
                <CardFooter className="text-center mt-4">
                    <p className="text-xs text-gray-400">
                        By signing up, you agree to our terms of service and privacy policy.
                    </p>
                </CardFooter>
            </Card>
        </main>
    );
}
