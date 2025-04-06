import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  redirect("https://home.open-space.xyz");
}
