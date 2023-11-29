"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import LeftSide from "~/components/LeftSide";
import Loading from "~/components/Loading";
import Navbar from "~/components/Navbar";
import RightSide from "~/components/RightSide";
import { Toaster } from "~/components/ui/toaster";
import { useAuthStore } from "~/store/auth";

interface IProps {
  children: React.ReactNode;
}

export function LayoutProvider({ children }: IProps) {
  const {
    status: authState,
    authUserFn,
    getFollowings,
  } = useAuthStore((state) => state);
  const { status: sessionState, data } = useSession();
  const pathname = usePathname();

  const HideLeftSide = () => {
    const pages = ["/login", "/register"];

    if (pages.find((el) => pathname.includes(el))) {
      return false;
    }
    return true;
  };

  const HideRightSide = () => {
    const pages = ["/u", "/login", "/register"];
    if (pages.find((el) => pathname.includes(el))) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    authUserFn();
    getFollowings();
  }, [sessionState, authUserFn, data, getFollowings]);

  if (authState === "pending") {
    return <Loading />;
  }

  return (
    <>
      <div className="container grid h-full min-h-screen grid-rows-[80px_1fr] gap-5">
        <Navbar />
        <main className={`flex gap-6`}>
          {HideLeftSide() && <LeftSide />}
          <div className="h-full flex-1 pb-20">{children}</div>
          {HideRightSide() && <RightSide />}
        </main>
      </div>
      <Toaster />
    </>
  );
}
