import axios from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { IPost } from "~/types/post";

type IExtendedPost = IPost & {
  user: { username: string };
  _count: {
    votes: number;
    unVotes: number;
    comments: number;
  };
};

interface PostState {
  status: "pending" | "loaded" | "failed";
  posts: IExtendedPost[];
  votes: { postId: number }[];
  unVotes: { postId: number }[];
  getPosts: () => void;
  getVotes: (userId: string | null) => void;
  getUnVotes: (userId: string | null) => void;
  newPost: (post: IExtendedPost) => void;
}

export const usePostStore = create<PostState>()(
  devtools(
    (set) => ({
      status: "pending",
      posts: [],
      votes: [],
      unVotes: [],
      getPosts: () => {
        axios
          .get<IExtendedPost[]>("/api/posts")
          .then((response) => {
            return set(() => ({
              posts: response.data,
              status: "loaded",
            }));
          })
          .catch((err) => {
            console.log(err);
            return set(() => ({ posts: [], status: "failed" }));
          });
      },
      newPost: (post) => {
        return set((state) => ({
          posts: [post, ...state.posts],
        }));
      },
      getVotes: (userId) => {
        if (userId) {
          axios
            .get<{ postId: number }[]>(`/api/posts/get_votes?id=${userId}`)
            .then((response) => {
              return set(() => ({
                votes: response.data,
              }));
            })
            .catch((err) => {
              console.log(err);
              return set(() => ({ votes: [] }));
            });
        }
        return set(() => ({ votes: [] }));
      },
      getUnVotes: (userId) => {
        if (userId) {
          axios
            .get<{ postId: number }[]>(`/api/posts/get_unvotes?id=${userId}`)
            .then((response) => {
              return set(() => ({
                unVotes: response.data,
              }));
            })
            .catch((err) => {
              console.log(err);
              return set(() => ({ unVotes: [] }));
            });
        }
        return set(() => ({ unVotes: [] }));
      },
    }),
    { name: "posts" },
  ),
);
