"use client";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import ProfileMenu from "~/components/ProfileMenu";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";

export default function Navbar() {
  const { status } = useSession();
  return (
    <nav className="flex items-center justify-between py-5">
      <div>
        <NextLink href="/">
          <h1 className="text-xl font-semibold">Reddit</h1>
        </NextLink>
      </div>
      <div className="flex items-center gap-4">
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
