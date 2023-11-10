"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Error from "~/components/Error";
import LeftSide from "~/components/LeftSide";
import Loading from "~/components/Loading";
import Navbar from "~/components/Navbar";
import RightSide from "~/components/RightSide";
import { Toaster } from "~/components/ui/toaster";
import { useAuthStore } from "~/store/auth";
import { usePostStore } from "~/store/posts";

interface IProps {
  children: React.ReactNode;
}

export function LayoutProvider({ children }: IProps) {
  const {
    status: authState,
    authUserFn,
    getFollowings,
  } = useAuthStore((state) => state);
  const {
    status: postStatus,
    getPosts,
    getVotes,
    getUnVotes,
  } = usePostStore((state) => state);
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
    authUserFn(sessionState === "authenticated" ? data.user.id : null);
    getFollowings(sessionState === "authenticated" ? data.user.id : null);
    getFollowings(sessionState === "authenticated" ? data.user.id : null);
    getVotes(sessionState === "authenticated" ? data.user.id : null);
    getUnVotes(sessionState === "authenticated" ? data.user.id : null);
  }, [sessionState, authUserFn, data, getFollowings]);

  useEffect(() => getPosts(), [getPosts]);

  if (authState === "pending" || postStatus === "pending") {
    return <Loading />;
  }
  if (postStatus === "failed") {
    return <Error />;
  }

  return (
    <>
      <div className="container grid h-full min-h-screen grid-rows-[80px_1fr]">
        <Navbar />
        <main className={`flex gap-6`}>
          {HideLeftSide() && <LeftSide />}
          <div className="h-full flex-1">{children}</div>
          {HideRightSide() && <RightSide />}
        </main>
      </div>
      <Toaster />
    </>
  );
}
