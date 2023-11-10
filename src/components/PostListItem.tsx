"use client";
import axios from "axios";
import { ClipboardCheck, CornerUpRight, MessageCircle } from "lucide-react";
import {
  PiArrowFatLineUpLight,
  PiArrowFatLineDownLight,
  PiArrowFatLineUpFill,
  PiArrowFatLineDownFill,
} from "react-icons/pi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate } from "~/libs/utils/formatDate";
import { useAuthStore } from "~/store/auth";
import type { IPost } from "~/types/post";
import { usePostStore } from "~/store/posts";

type IExtendedPost = IPost & {
  user: { username: string };
  _count: {
    votes: number;
    unVotes: number;
    comments: number;
  };
};

export interface IProps {
  data: IExtendedPost;
}

export default function PostListItem({ data }: IProps) {
  const { user } = useAuthStore();
  const { posts, votes, unVotes, getVotes, getUnVotes } = usePostStore();
  const [post, setPost] = useState<IExtendedPost>(data);
  const [share, setShare] = useState<boolean>(false);
  const [isVoted, setIsVoted] = useState<boolean>(
    votes.find((el) => el.postId === post.id) ? true : false,
  );
  const [isUnVoted, setIsUnVoted] = useState<boolean>(
    unVotes.find((el) => el.postId === post.id) ? true : false,
  );

  const variants = {
    // default: {
    //   bg: "dark:bg-neutral-500/[0.03] bg-neutral-500/30",
    //   border: "dark:border-neutral-400/10 border-neutral-400/30",
    // },
    red: {
      bg: "dark:bg-red-500/[0.03] bg-red-500/30",
      border: "dark:border-red-400/10 border-red-400/30",
    },
    green: {
      bg: "dark:bg-green-500/[0.03] bg-green-500/30",
      border: "dark:border-green-400/10 border-green-400/30",
    },
    blue: {
      bg: "dark:bg-blue-500/[0.03] bg-blue-500/30",
      border: "dark:border-blue-400/10 border-blue-400/30",
    },
    pink: {
      bg: "dark:bg-pink-500/[0.03] bg-pink-500/30",
      border: "dark:border-pink-400/10 border-pink-400/30",
    },
  };

  const variant =
    Object.values(variants)[new Date(post.createdAt).getTime() % 4];

  useEffect(() => {
    setPost(data);
  }, [posts]);

  useEffect(() => {
    setIsVoted(votes.find((el) => el.postId === post.id) ? true : false);
    setIsUnVoted(unVotes.find((el) => el.postId === post.id) ? true : false);
  }, [setIsUnVoted, setIsVoted, votes, unVotes]);

  const voteHandle = async () => {
    try {
      if (user) {
        const { data } = await axios.post<IExtendedPost>("/api/posts/vote", {
          postId: post.id,
          userId: user.id,
        });
        setPost(data);
        getVotes(user.id);
        getUnVotes(user.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unVoteHandle = async () => {
    try {
      if (user) {
        const { data } = await axios.post<IExtendedPost>("/api/posts/unvote", {
          postId: post.id,
          userId: user?.id,
        });
        setPost(data);
        getVotes(user.id);
        getUnVotes(user.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const shareHandle = () => {
    setShare(true);
    navigator.clipboard
      .writeText(`${window.location.origin}/r/${post.slug}`)
      .catch((err) => console.log(err));
    setTimeout(() => {
      setShare(false);
    }, 1000);
  };

  return (
    <li
      className={`grid gap-1.5 rounded-md border ${variant!.bg} ${
        variant!.border
      } px-4 py-3`}
    >
      <div className="flex items-center justify-between gap-1">
        <Link href={`/r/${post.slug}`}>
          <h2 className="text-lg font-medium dark:font-normal">{post.title}</h2>
        </Link>
        <Link
          href={`/u/${post.user.username}`}
          className="text-sm font-light text-foreground/80 hover:underline"
        >{`u/${post.user.username}`}</Link>
      </div>
      <p className="text-sm text-foreground/60 dark:font-light">
        {post.content}
      </p>
      <div className="flex items-center gap-2"></div>
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 items-center gap-1 rounded border border-red-400/20 bg-red-500/10 px-1.5 text-xs text-foreground/90">
            <button
              onClick={voteHandle}
              className="transition-transform hover:scale-[1.15]"
            >
              {isVoted ? (
                <PiArrowFatLineUpFill className="text-xl" />
              ) : (
                <PiArrowFatLineUpLight className="text-xl" />
              )}
            </button>
            <span className="inline-block w-5 text-center font-medium dark:font-normal">
              {post._count.votes - post._count.unVotes}
            </span>
            <button
              onClick={unVoteHandle}
              className="transition-transform hover:scale-[1.15]"
            >
              {isUnVoted ? (
                <PiArrowFatLineDownFill className="text-xl" />
              ) : (
                <PiArrowFatLineDownLight className="text-xl" />
              )}
            </button>
          </div>
          <button className="group flex h-8 items-center gap-1 rounded border border-blue-400/20 bg-blue-500/10 px-1.5 pr-2 text-xs text-foreground/90">
            <MessageCircle className="scale-75 transition-transform group-hover:scale-[0.85]" />
            <span className="font-medium dark:font-normal">
              {post._count.comments}
            </span>
          </button>
          <button
            onClick={shareHandle}
            className="group flex h-8 items-center gap-1 rounded border border-green-400/20 bg-green-500/10 px-1.5 text-xs text-foreground/90"
          >
            {share ? (
              <ClipboardCheck
                strokeWidth={1.25}
                className="scale-75 transition-transform group-hover:scale-[0.85]"
              />
            ) : (
              <CornerUpRight
                strokeWidth={1.25}
                className="scale-75 transition-transform group-hover:scale-[0.85]"
              />
            )}
          </button>
        </div>
        <span className="text-sm font-light  text-foreground/80">
          {formatDate(post.createdAt)}
        </span>
      </div>
    </li>
  );
}
