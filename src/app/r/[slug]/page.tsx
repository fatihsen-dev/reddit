"use client";

import axios from "axios";
import { ClipboardCheck, CornerUpRight, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Avatar from "~/components/Avatar";
import Comment from "~/components/Comment/Comment";
import CreateComment from "~/components/Comment/CreateComment";
import VoteBtn from "~/components/Post/VoteBtn";
import { timeAgo } from "~/libs/utils/formatDate";
import { variants } from "~/libs/variants";
import type { IPost } from "~/types/post";

export interface IProps {
  params: { slug: string };
}

export type IPagePost = IPost & {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
  };
  votes: [
    {
      postId: number;
    },
  ];
  unVotes: [
    {
      postId: number;
    },
  ];
  comments: [
    {
      content: string;
      createdAt: Date;
      user: {
        name: string;
        username: string;
        avatar: string | null;
      };
      replies: {
        content: string;
        createdAt: Date;
        user: {
          name: string;
          username: string;
          avatar: string | null;
        };
      }[];
    },
  ];
  _count: {
    votes: number;
    unVotes: number;
    comments: number;
  };
};

export default function PostListItem({ params: { slug } }: IProps) {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState<IPagePost>();
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [isUnVoted, setIsUnVoted] = useState<boolean>(false);
  const [share, setShare] = useState<boolean>(false);
  const [variant, setVariant] = useState<{
    bg: string;
    border: string;
  }>();

  const shareHandle = () => {
    setShare(true);
    navigator.clipboard
      .writeText(`${window.location.origin}/r/${post?.slug}`)
      .catch((err) => console.log(err));
    setTimeout(() => {
      setShare(false);
    }, 1000);
  };

  useEffect(() => {
    axios
      .get<IPagePost>(`/api/posts/get_post_by_slug?slug=${slug}`)
      .then((response) => {
        const { data } = response;
        setPost(data);
        setIsVoted(data.votes.length > 0);
        setIsUnVoted(data.unVotes.length > 0);
        setVariant(
          Object.values(variants)[(new Date(data.createdAt).getTime() % 4) + 1],
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [slug]);

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="flex items-center justify-center pt-52">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-500 border-l-transparent"></div>
        </div>
      ) : (
        <div className="h-full">
          {post ? (
            <div className="grid h-full content-start gap-4">
              <div
                className={`grid gap-1.5 rounded-md border ${variant?.bg} ${variant?.border} p-4`}
              >
                <div className="grid gap-1">
                  <div className={`mb-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-1.5">
                      <Avatar
                        className="h-8 w-8"
                        fullName={post.user?.name ?? ""}
                        url={post.user.avatar ?? ""}
                      />
                      <span>{post.user.name}</span>
                    </div>
                    <span className="text-sm font-light text-foreground/80">
                      {timeAgo(post.createdAt.toString())}
                    </span>
                  </div>
                  <div
                    className={`mb-3 border opacity-50 ${variant?.border}`}
                  />
                  <h2 className="mb-0.5 flex-1 text-xl font-medium dark:font-normal">
                    {post.title}
                  </h2>
                  <p className="leading-5 text-foreground/60 dark:font-light">
                    {post.content}
                  </p>
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <VoteBtn
                        post={post}
                        isVote={isVoted}
                        isUnVote={isUnVoted}
                        // @ts-ignore
                        setPost={setPost}
                      />
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
                  </div>
                </div>
              </div>
              <div className="my-2 grid grid-cols-[1fr_auto] items-center gap-6">
                <hr className={`${variants.default.border}`} />
                <span className="text-sm font-light text-foreground/80">
                  {post._count.comments} Comment
                </span>
              </div>
              {status === "authenticated" && (
                <CreateComment post={post} setPost={setPost} />
              )}
              <ul className="grid content-start gap-2">
                {post.comments.map((comment, key) => (
                  <Comment
                    key={key}
                    variant={variant}
                    createdAt={comment.createdAt}
                    content={comment.content}
                    user={comment.user}
                    replies={comment.replies}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex h-full justify-center p-56">
              Post not found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
