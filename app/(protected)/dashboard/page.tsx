"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (!session) {
    return <p>No active session</p>;
  }


  if (!userData && session) {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setUserData(data);
        }
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="pl-7">

     <p className="mt-10 text-4xl font-light">Welcome, {userData?.name}</p>
      
    </div>
  );
}
