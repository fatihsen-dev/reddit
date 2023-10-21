import NextLink from "next/link";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-5">
      <div>
        <NextLink href="/">
          <h1 className="text-xl font-semibold">Reddit</h1>
        </NextLink>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NextLink href="/login">
          <Button variant={"ghost"} className="!h-9">
            Sign In
          </Button>
        </NextLink>
      </div>
    </nav>
  );
}
