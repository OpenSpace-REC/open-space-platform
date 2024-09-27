"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";


export default function GitHubLinkPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLinking, setIsLinking] = useState(false);
    const userEmail = session?.user?.email || "";

    
    const isGithubLinked = false;

    const handleGitHubLink = async () => {
        setIsLinking(true);
        try {
            const response = await fetch('/api/github/oauth');
            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            console.error("Error initiating GitHub OAuth:", error);
            setIsLinking(false);
        }
    };

    return (
        <main className="w-screen h-screen flex items-center justify-center">
            <Card className="bg-zinc-950 text-white w-[90%] max-w-[400px] p-6 rounded-lg shadow-lg border border-white border-opacity-30">
                <CardContent className="flex flex-col gap-4">
                    {userEmail && (
                        <div>
                            <Input id="email" value={userEmail} readOnly className="bg-zinc-800 text-white" />
                        </div>
                    )}
                    {!isGithubLinked ? (
                        <Button
                            onClick={handleGitHubLink}
                            disabled={isLinking}
                            className="bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2"
                        >
                            <FaGithub />
                            {isLinking ? "Linking..." : "Link GitHub Account"}
                        </Button>
                    ) : (
                        <div className="text-green-500 font-medium">
                            <p>GitHub Account Linked!</p>
                           
                        </div>
                    )}


                    {isGithubLinked && (
                        <Button
                            onClick={() => router.push("/dashboard")}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Go to Dashboard
                        </Button>
                    )}
                </CardContent>
            </Card>

        </main>
    );
}