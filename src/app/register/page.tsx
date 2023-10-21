"use client";

import { signIn } from "next-auth/react";
import NavLink from "next/link";
import { AiFillGithub } from "react-icons/ai";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function page() {
  const signInHandle = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <div className="flex items-start justify-center pt-48">
      <div className="w-full max-w-md rounded-md border p-5 px-6 shadow">
        <h1>Sign Up</h1>
        <span className="text-sm opacity-50">
          {"Choose your register method"}
        </span>
        <form onSubmit={signInHandle} className="mt-6 grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-left">
              Username
            </Label>
            <Input
              id="username"
              placeholder="USERNAME"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-left">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-left">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="**********"
              className="col-span-3"
            />
          </div>
          <Button className="!w-full" type="submit">
            Sign Up
          </Button>
        </form>
        <div className="mt-5 grid gap-5">
          <hr className="border" />
          <Button
            type="button"
            variant={"secondary"}
            className="!w-full gap-1.5"
            onClick={() => signIn("github")}
          >
            <AiFillGithub className="text-xl" />
            Sign In With Github
          </Button>

          <NavLink href="/login">
            <Button type="button" variant={"link"} className="!w-full gap-1.5">
              Sign In
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
