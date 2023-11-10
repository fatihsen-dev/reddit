import axios from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { IFollowedId } from "~/types/following";
import type { IUser } from "~/types/user";

interface AuthState {
  status: "pending" | "authenticated" | "unauthenticated";
  followings: IFollowedId[];
  user: IUser | null;
  authUserFn: (userid: string | null) => void;
  getFollowings: (userid: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      status: "pending",
      followings: [],
      user: null,
      authUserFn: (userid) => {
        if (userid) {
          axios
            .get<IUser>(`/api/get_auth_user?id=${userid}`)
            .then((response) => {
              return set(() => ({
                user: response.data,
                status: "authenticated",
              }));
            })
            .catch((err) => {
              console.log(err);
              return set(() => ({ user: null, status: "unauthenticated" }));
            });
        }
        return set(() => ({ user: null, status: "unauthenticated" }));
      },
      getFollowings: (userid) => {
        if (userid) {
          axios
            .get<IFollowedId[]>(`/api/get_auth_user/followings?id=${userid}`)
            .then((response) => {
              return set(() => ({
                followings: response.data,
              }));
            })
            .catch((err) => {
              console.log(err);
              return set(() => ({
                followings: [],
              }));
            });
        }
        return set(() => ({ followings: [] }));
      },
    }),
    { name: "auth" },
  ),
);
