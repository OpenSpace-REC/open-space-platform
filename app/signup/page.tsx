import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function SignUpPage() {
    return (
        <main className="w-screen h-screen flex items-center justify-center ">
            <Card className="bg-zinc-950 text-white w-[90%] max-w-[400px] p-6 rounded-lg shadow-lg border border-white border-opacity-30">
                <CardHeader className="text-center mb-4">
                    <h1 className="font-bold text-4xl">/Open-Space</h1>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">

                    <Button className="w-full bg-white text-black hover:text-white flex gap-2">
                        Sign in with Google
                        <FaGoogle/>
                    </Button>
                    <p className="text-center text-md">And</p>
                    <Button className="w-full bg-white text-black hover:text-white flex gap-2">
                        Link GitHub
                        <FaGithub/>
                    </Button>
                </CardContent>
                <CardFooter className="text-center mt-4">
                    <p className="text-xs text-gray-400">By signing up, you agree to our terms of service and privacy policy.</p>
                </CardFooter>
            </Card>
        </main>
    );
}
