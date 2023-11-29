"use client";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import ProfileMenu from "~/components/ProfileMenu";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import { Input } from "./ui/input";

export default function Navbar() {
  const { status } = useSession();
  return (
    <nav className="sticky top-0 z-20 grid grid-cols-[240px_1fr_240px] items-center justify-between bg-background py-5">
      <div>
        <NextLink href="/">
          <h1 className="text-xl font-semibold">Reddit</h1>
        </NextLink>
      </div>
      <div className="flex w-full justify-center">
        <Input className="max-w-xl" placeholder="Search" />
      </div>
      <div className="flex items-center justify-end gap-4">
        <ThemeToggle />
        {status === "unauthenticated" ? (
          <NextLink href="/login">
            <Button variant={"ghost"} className="!h-9">
              Sign In
            </Button>
          </NextLink>
        ) : (
          <ProfileMenu />
        )}
      </div>
    </nav>
  );
}
