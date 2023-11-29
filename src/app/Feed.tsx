"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import PostCreate from "~/components/Post/PostCreate";
import PostItem from "~/components/Post/PostItem";
import type { IPost } from "~/types/post";

type IExtendedPost = IPost & {
  user: { username: string };
  _count: {
    votes: number;
    unVotes: number;
    comments: number;
  };
};

export default function Feed() {
  const { status } = useSession();
  const [posts, setPosts] = useState<IExtendedPost[]>([]);
  const [votes, setVotes] = useState<{ postId: number }[]>([]);
  const [unVotes, setUnVotes] = useState<{ postId: number }[]>([]);

  const getPosts = async () => {
    try {
      const { data } = await axios.get<IExtendedPost[]>("/api/posts");
      setPosts(data);
    } catch (error) {
      console.log(error);
      setPosts([]);
    }
  };

  const getVotes = async () => {
    try {
      const { data } =
        await axios.get<{ postId: number }[]>(`/api/posts/get_votes`);
      setVotes(data);
    } catch (error) {
      console.log(error);
      setVotes([]);
    }
  };

  const getUnVotes = async () => {
    try {
      const { data } = await axios.get<{ postId: number }[]>(
        `/api/posts/get_unvotes`,
      );
      setUnVotes(data);
    } catch (error) {
      console.log(error);
      setUnVotes([]);
    }
  };

  const getData = useCallback(async () => {
    await getVotes();
    await getUnVotes();
    await getPosts();
  }, []);

  useEffect(() => {
    getData().catch((error) => console.log(error));
  }, [getData]);

  return (
    <>
      {status === "authenticated" && (
        <PostCreate setPosts={setPosts} posts={posts} />
      )}
      <ul className="grid content-start gap-4 pb-20">
        {posts.map((post, index) => (
          <PostItem key={index} data={post} votes={votes} unVotes={unVotes} />
        ))}
      </ul>
    </>
  );
}
