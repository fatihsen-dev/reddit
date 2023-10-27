"use client";

import { signIn } from "next-auth/react";
import NavLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const signInHandle = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const response = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    console.log(response);
  };

  return (
    <div className="flex items-start justify-center pt-48">
      <div className="w-full max-w-md rounded-md border p-5 px-6 shadow">
        <h1>Sign In</h1>
        <span className="text-sm opacity-50">{"Choose your login method"}</span>
        <form onSubmit={signInHandle} className="mt-6 grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-left">
              Username
            </Label>
            <Input
              value={username}
              onInput={(e) => setUsername(e.currentTarget.value)}
              id="username"
              placeholder="USERNAME"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-left">
              Password
            </Label>
            <Input
              value={password}
              onInput={(e) => setPassword(e.currentTarget.value)}
              type="password"
              id="password"
              placeholder="**********"
              className="col-span-3"
            />
          </div>
          <Button className="!w-full" type="submit">
            Sign In
          </Button>
        </form>
        <div className="mt-5 grid gap-5">
          <hr className="border" />
          <Button
            type="button"
            variant={"secondary"}
            className="!w-full gap-1.5"
            onClick={async () => {
              await signIn("github", { callbackUrl: "/" });
            }}
          >
            <AiFillGithub className="text-xl" />
            Sign In With Github
          </Button>
          <NavLink href="/register">
            <Button type="button" variant={"link"} className="!w-full gap-1.5">
              Sign Up
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
