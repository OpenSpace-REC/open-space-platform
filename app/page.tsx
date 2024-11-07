import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <p className="font-bold text-4xl">/Open-Space</p>
      <div className="p-1 space-y-4 space-x-4"> 
        <Link href="/google-signin">
        <Button >Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
