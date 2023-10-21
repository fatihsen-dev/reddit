"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  return (
    <div>
      <pre>{JSON.stringify(session, null, 4)}</pre>
      <button onClick={() => signIn()}>signin</button>
      <button onClick={() => signOut()}>signout</button>
    </div>
  );
}
