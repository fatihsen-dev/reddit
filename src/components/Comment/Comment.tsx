"use client";

import Link from "next/link";
import { timeAgo } from "~/libs/utils/formatDate";
import { variants } from "~/libs/variants";
import type { IComment } from "~/types/comment";
import Avatar from "../Avatar";
import VoteBtn from "./VoteBtn";

interface IProps {
  comment: IComment;
  commentVotes: { commentId: number }[];
  commentUnVotes: { commentId: number }[];
  variant:
    | {
        bg: string;
        border: string;
      }
    | undefined;
}

export default function Comment({
  comment,
  commentVotes,
  commentUnVotes,
}: IProps) {
  return (
    <li>
      <div
        className={`${variants.default.bg} rounded border p-3 ${variants.default.border}`}
      >
        <div className={`mb-2 flex items-center justify-between`}>
          <Link href={`/u/${comment.user.username}`}>
            <div className="flex items-center gap-1.5 hover:underline">
              <Avatar
                className="h-6 w-6"
                fullName={comment.user?.name ?? ""}
                url={comment.user?.avatar ?? ""}
              />
              <span className="text-sm">{comment.user?.name}</span>
            </div>
          </Link>
          <span className="text-xs font-light text-foreground/80">
            {timeAgo(comment.createdAt.toString())}
          </span>
        </div>
        <p className="text-sm">{comment.content}</p>
        <div className="flex items-center justify-start">
          <VoteBtn
            comment={comment}
            commentVotes={commentVotes}
            commentUnVotes={commentUnVotes}
          />
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <ul
          className={`mt-2 grid content-start gap-2 border-l-[3rem] !border-neutral-400/[0.01] pl-2`}
        >
          {comment.replies.map((replie, key) => (
            <li key={key}>
              <div
                className={`${variants.default.bg} rounded border p-3 ${variants.default.border}`}
              >
                <div className={`mb-2 flex items-center justify-between`}>
                  <Link href={`/u/${replie.user.username}`}>
                    <div className="flex items-center gap-1.5 hover:underline">
                      <Avatar
                        className="h-6 w-6"
                        fullName={replie.user?.name ?? ""}
                        url={replie.user?.avatar ?? ""}
                      />
                      <span className="text-sm">{replie.user?.name}</span>
                    </div>
                  </Link>
                  <span className="text-xs font-light text-foreground/80">
                    {timeAgo(replie.createdAt.toString())}
                  </span>
                </div>
                <p className="text-sm">{replie.content}</p>
                <div className="flex items-center justify-start">
                  <VoteBtn
                    comment={replie}
                    commentVotes={commentVotes}
                    commentUnVotes={commentUnVotes}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
