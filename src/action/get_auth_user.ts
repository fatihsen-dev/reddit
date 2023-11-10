import axios from "axios";
import type { IUser } from "~/types/user";

export const getAuthUser = async (userId: string) => {
  try {
    const { data } = await axios.get<IUser>(`/api/get_auth_user?id=${userId}`);
    return data;
  } catch (error) {
    return null;
  }
};
