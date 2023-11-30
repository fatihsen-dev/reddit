"use client";
import axios from "axios";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import {
  PiArrowFatLineDownFill,
  PiArrowFatLineDownLight,
  PiArrowFatLineUpFill,
  PiArrowFatLineUpLight,
} from "react-icons/pi";
import type { IPagePost } from "~/app/r/[slug]/page";
import type { IComponentPost } from "./PostItem";

interface IProps {
  isVote: boolean;
  isUnVote: boolean;
  post: IComponentPost | IPagePost;
  setPost: Dispatch<SetStateAction<IComponentPost | IPagePost>>;
}

export default function VoteBtn({ isVote, isUnVote, post, setPost }: IProps) {
  const [waitVote, setWaitVote] = useState<boolean>(false);
  const [voted, setIsVoted] = useState<boolean>(isVote);
  const [unVoted, setIsUnVoted] = useState<boolean>(isUnVote);

  useEffect(() => {
    setIsVoted(isVote);
  }, [isVote]);

  useEffect(() => {
    setIsUnVoted(isUnVote);
  }, [isUnVote]);

  const voteHandle = async () => {
    setWaitVote(true);
    try {
      const { data } = await axios.post<{ message: string }>(
        "/api/posts/vote",
        {
          postId: post.id,
        },
      );
      if (data.message === "vote") {
        setPost({
          ...post,
          _count: {
            ...post._count,
            votes: post._count.votes + (unVoted ? 2 : 1),
          },
        });
        setIsVoted(true);
        setIsUnVoted(false);
      } else {
        setPost({
          ...post,
          _count: {
            ...post._count,
            votes: post._count.votes - 1,
          },
        });
        setIsVoted(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setWaitVote(false);
    }
  };

  const unVoteHandle = async () => {
    setWaitVote(true);
    try {
      const { data } = await axios.post<{ message: string }>(
        "/api/posts/unvote",
        {
          postId: post.id,
        },
      );
      if (data.message === "unvote") {
        setPost({
          ...post,
          _count: {
            ...post._count,
            unVotes: post._count.unVotes + (voted ? 2 : 1),
          },
        });
        setIsUnVoted(true);
        setIsVoted(false);
      } else {
        setPost({
          ...post,
          _count: { ...post._count, unVotes: post._count.unVotes - 1 },
        });
        setIsUnVoted(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setWaitVote(false);
    }
  };

  return (
    <div
      className={`flex h-8 items-center gap-1 rounded border border-red-400/20 bg-red-500/10 px-1.5 text-xs text-foreground/90 ${
        waitVote
          ? "pointer-events-none opacity-50"
          : "pointer-events-auto opacity-100"
      }`}
    >
      <button
        onClick={voteHandle}
        className="transition-transform hover:scale-[1.15]"
      >
        {voted ? (
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
        {unVoted ? (
          <PiArrowFatLineDownFill className="text-xl" />
        ) : (
          <PiArrowFatLineDownLight className="text-xl" />
        )}
      </button>
    </div>
  );
}
