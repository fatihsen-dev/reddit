"use client";

import Link from "next/link";
import { timeAgo } from "~/libs/utils/formatDate";
import Avatar from "../Avatar";
import { variants } from "~/libs/variants";

interface IProps {
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
  variant:
    | {
        bg: string;
        border: string;
      }
    | undefined;
}

export default function Comment({
  content,
  createdAt,
  variant,
  user,
  replies,
}: IProps) {
  return (
    <li>
      <div
        className={`${variants.default.bg} rounded border p-3 ${variants.default.border}`}
      >
        <div className={`mb-2 flex items-center justify-between`}>
          <Link href={`/u/${user.username}`}>
            <div className="flex items-center gap-1.5 hover:underline">
              <Avatar
                className="h-6 w-6"
                fullName={user?.name ?? ""}
                url={user?.avatar ?? ""}
              />
              <span className="text-sm">{user?.name}</span>
            </div>
          </Link>
          <span className="text-xs font-light text-foreground/80">
            {timeAgo(createdAt.toString())}
          </span>
        </div>
        <p className="text-sm">{content}</p>
      </div>
      {replies.length > 0 && (
        <ul
          className={`mt-2 grid content-start gap-2 border-l-[3rem] !border-neutral-400/[0.01] pl-2`}
        >
          {replies.map((replie, key) => (
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
