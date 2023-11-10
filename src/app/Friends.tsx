"use client";
import PostListItem from "~/components/PostListItem";
import { usePostStore } from "~/store/posts";

export default function Friends() {
  const { posts } = usePostStore();

  return (
    <ul className="grid content-start gap-4 pb-20">
      {posts.map((item, index) => (
        <PostListItem key={index} data={item} />
      ))}
    </ul>
  );
}
