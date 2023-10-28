"use client";

import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { LogOut, User2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function ProfileMenu() {
  const { data } = useSession();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 justify-start gap-2 focus-visible:ring-transparent"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={data?.user.image ?? ""}
              className="h-full w-full"
              alt={data?.user.name ?? ""}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{data?.user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem className="flex">
          <Button
            onClick={() => router.push(`/u/${data?.user.username}`)}
            variant="ghost"
            className="h-9 w-full justify-start gap-1.5 px-2"
          >
            <User2 className="h-5 w-5" />
            <span>My Account</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex">
          <Button
            onClick={() => signOut()}
            variant="ghost"
            className="h-9 w-full justify-start gap-1.5 px-2 text-red-500 hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
