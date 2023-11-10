"use client";

import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

import { useSession } from "next-auth/react";
import { useAuthStore } from "~/store/auth";
import type { IProfile } from "~/types/profile";
import EditProfile from "./EditProfile";

interface IProps {
  params: { username: string };
}

export default function Page({ params: { username } }: IProps) {
  const { status } = useSession();
  const { user, followings, getFollowings } = useAuthStore((state) => state);
  const [profile, setProfile] = useState<IProfile | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [followState, setFollowState] = useState(false);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [isMyProfile, setIsMyProfile] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get<IProfile>(`/api/user?username=${username}`)
      .then((response) => {
        setProfile(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setProfile(null);
        setIsLoading(false);
      });
  }, [username]);

  const followHandle = () => {
    setFollowState(true);
    axios
      .post<IProfile>("/api/follow", {
        followedId: profile?.id,
        followerId: user?.id,
      })
      .then((response) => {
        setProfile(response.data);
        if (user) {
          getFollowings(user.id);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setFollowState(false);
      });
  };

  const unfollowHandle = () => {
    setFollowState(true);
    axios
      .post<IProfile>("/api/un_follow", {
        followedId: profile?.id,
        followerId: user?.id,
      })
      .then((response) => {
        setProfile(response.data);
        if (user) {
          getFollowings(user.id);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setFollowState(false);
      });
  };

  useEffect(() => {
    setIsFollowed(
      followings.find((item) => item.followedId === profile?.id) ? true : false,
    );
    setIsMyProfile(user?.id === profile?.id ? true : false);
  }, [profile, user, followings, getFollowings]);

  return (
    <div className="h-full">
      {isLoading ? (
        <></>
      ) : (
        <>
          {profile ? (
            <>
              <div className="h-full">
                <div className="mx-auto grid max-w-xl gap-4 border-b border-white/10 pb-6">
                  <div className="grid grid-cols-[1fr_auto]">
                    <div className="flex h-full flex-1 flex-col justify-start py-1">
                      <h2 className="inline-flex items-center gap-1.5 text-2xl">
                        <span>{profile.name}</span>
                        {isMyProfile && <EditProfile />}
                      </h2>
                      <span className="text-sm font-light opacity-50">{`u/${profile.username}`}</span>
                    </div>
                    <Avatar
                      className={`h-20 w-20 overflow-hidden rounded-full`}
                    >
                      <AvatarImage
                        src={profile?.image}
                        className="h-full w-full"
                        alt={profile?.name}
                      />
                      <AvatarFallback className="flex w-full items-center justify-center rounded-full border bg-neutral-500/5 text-2xl">
                        {profile?.name
                          ?.split(" ")
                          .map((e) => e[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex items-end">
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="max-h-20">
                        <p className="text-sm font-light">{profile.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-light text-white/60">
                        <button>
                          Followers:{" "}
                          <span className="text-white">
                            {profile._count.followers}
                          </span>
                        </button>
                        {"-"}
                        <button>
                          Following:{" "}
                          <span className="text-white">
                            {profile._count.following}
                          </span>
                        </button>
                      </div>
                    </div>
                    {status === "authenticated" ? (
                      <>
                        {!isMyProfile && (
                          <>
                            {isFollowed ? (
                              <Button
                                disabled={followState}
                                onClick={unfollowHandle}
                                variant="outline"
                                className="h-9 !px-8"
                              >
                                Following
                              </Button>
                            ) : (
                              <Button
                                disabled={followState}
                                onClick={followHandle}
                                variant="outline"
                                className="h-9 !px-8"
                              >
                                Follow
                              </Button>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <Link href={`/login?callback=/u/${profile.username}`}>
                        <Button
                          onClick={followHandle}
                          variant="outline"
                          className="h-9 !px-8"
                        >
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full justify-center pt-36">
              User Not Found
            </div>
          )}
        </>
      )}
    </div>
  );
}
