export interface IComment {
  id: number;
  content: string;
  createdAt: Date;
  _count: {
    votes: number;
    unVotes: number;
  };
  user: {
    name: string;
    username: string;
    avatar: string | null;
  };
  replies?: {
    id: number;
    content: string;
    createdAt: Date;
    _count: {
      votes: number;
      unVotes: number;
    };
    user: {
      name: string;
      username: string;
      avatar: string | null;
    };
  }[];
}
