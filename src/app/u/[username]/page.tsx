"use client";

import { useSession } from "next-auth/react";

interface IProps {
  params: { username: string };
}

export default function Page({ params: { username } }: IProps) {
  const { data } = useSession();
  return (
    <div>
      {username}
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
}
