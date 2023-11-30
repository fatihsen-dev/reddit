"use client";

import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

import { useSession } from "next-auth/react";
import PostItem from "~/components/Post/PostItem";
import { useAuthStore } from "~/store/auth";
import type { IPost } from "~/types/post";
import type { IProfile } from "~/types/profile";
import EditProfile from "./EditProfile";

interface IProps {
  params: { username: string };
}

type IExtendedPost = IPost & {
  user: { username: string };
  _count: {
    votes: number;
    unVotes: number;
    comments: number;
  };
};

export default function Page({ params: { username } }: IProps) {
  const { status } = useSession();
  const { user, followings, getFollowings } = useAuthStore((state) => state);
  const [profile, setProfile] = useState<IProfile | null>();
  const [posts, setPosts] = useState<IExtendedPost[]>([]);
  const [votes, setVotes] = useState<{ postId: number }[]>([]);
  const [unVotes, setUnVotes] = useState<{ postId: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followState, setFollowState] = useState(false);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [isMyProfile, setIsMyProfile] = useState<boolean>(false);

  const getProfile = useCallback(async () => {
    try {
      const { data } = await axios.get<IProfile>(
        `/api/get_profile?username=${username}`,
      );
      setProfile(data);
      setIsLoading(false);
    } catch (error) {
      setProfile(null);
      setIsLoading(false);
    }
  }, [username]);

  const getPosts = useCallback(async () => {
    try {
      const { data } = await axios.get<IExtendedPost[]>(
        `/api/get_profile/get_posts?username=${username}`,
      );
      setPosts(data);
    } catch (error) {
      setPosts([]);
    }
  }, [username]);

  const getVotes = useCallback(async () => {
    try {
      const { data } =
        await axios.get<{ postId: number }[]>(`/api/posts/get_votes`);
      setVotes(data);
    } catch (error) {
      console.log(error);
      setVotes([]);
    }
  }, [setVotes]);

  const getUnVotes = useCallback(async () => {
    try {
      const { data } = await axios.get<{ postId: number }[]>(
        `/api/posts/get_unvotes`,
      );
      setUnVotes(data);
    } catch (error) {
      console.log(error);
      setUnVotes([]);
    }
  }, [setUnVotes]);

  const getData = useCallback(async () => {
    await getProfile();
    await getPosts();
    await getUnVotes();
    await getVotes();
  }, [getProfile, getPosts, getUnVotes, getVotes]);

  useEffect(() => {
    getData().catch((error) => console.log(error));
  }, [getData]);

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
          getFollowings();
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setFollowState(false);
      });
  };

  const unFollowHandle = () => {
    setFollowState(true);
    axios
      .post<IProfile>("/api/un_follow", {
        followedId: profile?.id,
        followerId: user?.id,
      })
      .then((response) => {
        setProfile(response.data);
        if (user) {
          getFollowings();
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
    setIsFollowed(!!followings.find((item) => item.followedId === profile?.id));
    setIsMyProfile(user?.id === profile?.id);
  }, [profile, user, followings, getFollowings]);

  return (
    <div className="h-full">
      {isLoading ? (
        <></>
      ) : (
        <>
          {profile ? (
            <div>
              <div className="grid h-full content-start">
                <div className="mx-auto w-full max-w-3xl">
                  <div className="grid w-full gap-4 border-b border-white/10 pb-6">
                    <div className="grid grid-cols-[1fr_auto]">
                      <div className="flex h-full flex-1 flex-col justify-start py-1">
                        <h2 className="inline-flex items-center gap-1.5 text-2xl">
                          <span>{profile.name}</span>
                          {isMyProfile && (
                            <EditProfile getProfile={getProfile} />
                          )}
                        </h2>
                        <span className="text-sm font-light opacity-50">{`u/${profile.username}`}</span>
                      </div>
                      <Avatar
                        className={`h-20 w-20 overflow-hidden rounded-full`}
                      >
                        <AvatarImage
                          src={profile?.avatar}
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
                                  onClick={unFollowHandle}
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
                  {posts.length > 0 ? (
                    <ul className="mt-6 grid w-full content-start gap-4 pb-20">
                      {posts.map((post, index) => (
                        <PostItem
                          key={index}
                          data={post}
                          votes={votes}
                          unVotes={unVotes}
                        />
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-5 flex items-center justify-center rounded px-5 py-20">
                      User has not yet shared a post!
                    </div>
                  )}
                </div>
              </div>
            </div>
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
