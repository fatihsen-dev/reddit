export interface IProfile {
  createdAt: string;
  email: string;
  desc: string;
  emailVerified: null | boolean;
  id: string;
  avatar: string;
  name: string;
  updatedAt: string;
  username: string;
  _count: {
    followers: number;
    following: number;
  };
}
