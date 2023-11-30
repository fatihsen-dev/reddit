"use client";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { timeAgo } from "~/libs/utils/formatDate";
import { variants } from "~/libs/variants";
import type { IPost } from "~/types/post";
import ShareBtn from "./ShareBtn";
import VoteBtn from "./VoteBtn";
import { usePathname } from "next/navigation";

export type IComponentPost = IPost & {
  user: { username: string };
  _count: {
    votes: number;
    unVotes: number;
    comments: number;
  };
};

export interface IProps {
  data: IComponentPost;
  votes: { postId: number }[];
  unVotes: { postId: number }[];
}

export default function PostItem({ data, votes, unVotes }: IProps) {
  const pathname = usePathname();
  const [post, setPost] = useState<IComponentPost>(data);
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [isUnVoted, setIsUnVoted] = useState<boolean>(false);

  useEffect(() => {
    setPost(data);
  }, [data]);

  const variant =
    Object.values(variants)[(new Date(post.createdAt).getTime() % 4) + 1];

  useEffect(() => {
    setIsUnVoted(!!unVotes.find((vote) => vote.postId === post.id));
  }, [unVotes, post]);

  useEffect(() => {
    setIsVoted(!!votes.find((vote) => vote.postId === post.id));
  }, [votes, post]);

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
          <VoteBtn
            post={post}
            setPost={setPost}
            isVote={isVoted}
            isUnVote={isUnVoted}
          />
          <Link href={`/r/${post.slug}?comment=true`}>
            <button className="group flex h-8 items-center gap-1 rounded border border-blue-400/20 bg-blue-500/10 px-1.5 pr-2 text-xs text-foreground/90">
              <MessageCircle className="scale-75 transition-transform group-hover:scale-[0.85]" />
              <span className="font-medium dark:font-normal">
                {post._count.comments}
              </span>
            </button>
          </Link>
          <ShareBtn slug={post.slug} />
        </div>
        <span className="text-sm font-light  text-foreground/80">
          {timeAgo(post.createdAt.toString())}
        </span>
      </div>
    </li>
  );
}
