"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (!session) {
    return <p>No active session</p>;
  }

  return (
    <div>
      <h1>Session Details</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre> 
    </div>
  );
}
