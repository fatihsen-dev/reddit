"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  PiArrowFatLineDownFill,
  PiArrowFatLineDownLight,
  PiArrowFatLineUpFill,
  PiArrowFatLineUpLight,
} from "react-icons/pi";
import type { IComment } from "~/types/comment";

interface IProps {
  commentVotes: { commentId: number }[];
  commentUnVotes: { commentId: number }[];
  comment: IComment;
}

export default function VoteBtn({
  commentVotes,
  commentUnVotes,
  comment,
}: IProps) {
  const [waitVote, setWaitVote] = useState<boolean>(false);
  const [voteCount, setVoteCount] = useState<number>(comment._count.votes);
  const [unVoteCount, setUnVoteCount] = useState<number>(
    comment._count.unVotes,
  );
  const [voted, setIsVoted] = useState<boolean>(
    commentVotes.find((el) => el.commentId === comment.id) ? true : false,
  );
  const [unVoted, setIsUnVoted] = useState<boolean>(
    commentUnVotes.find((el) => el.commentId === comment.id) ? true : false,
  );

  useEffect(() => {
    setIsVoted(
      commentVotes.find((el) => el.commentId === comment.id) ? true : false,
    );
  }, [commentVotes, comment.id]);

  useEffect(() => {
    setIsUnVoted(
      commentUnVotes.find((el) => el.commentId === comment.id) ? true : false,
    );
  }, [commentUnVotes, comment.id]);

  const voteHandle = async () => {
    setWaitVote(true);
    try {
      const { data } = await axios.post<{ message: string }>(
        "/api/comment/vote",
        {
          commentId: comment.id,
        },
      );
      if (data.message === "vote") {
        setVoteCount((prev) => prev + (unVoted ? 2 : 1));
        setIsVoted(true);
        setIsUnVoted(false);
      } else {
        setVoteCount((prev) => prev - 1);
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
        "/api/comment/unvote",
        {
          commentId: comment.id,
        },
      );
      console.log(data.message);
      if (data.message === "unvote") {
        setUnVoteCount((prev) => prev + (voted ? 2 : 1));
        setIsUnVoted(true);
        setIsVoted(false);
      } else {
        setUnVoteCount((prev) => prev - 1);
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
      className={`mt-4 flex h-7 items-center gap-1 rounded border border-red-400/20 bg-red-500/10 px-1 text-xs text-foreground/90 ${
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
          <PiArrowFatLineUpFill className="text-lg" />
        ) : (
          <PiArrowFatLineUpLight className="text-lg" />
        )}
      </button>
      <span className="inline-block w-5 text-center font-medium dark:font-normal">
        {voteCount - unVoteCount}
      </span>
      <button
        onClick={unVoteHandle}
        className="transition-transform hover:scale-[1.15]"
      >
        {unVoted ? (
          <PiArrowFatLineDownFill className="text-lg" />
        ) : (
          <PiArrowFatLineDownLight className="text-lg" />
        )}
      </button>
    </div>
  );
}
