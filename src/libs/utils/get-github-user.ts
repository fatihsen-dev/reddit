import type { GithubProfile } from "next-auth/providers/github";

export const getGithubUser = async (email: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.github.com/search/users?q=${email}+in:email`,
    );
    const data = (await response.json()) as IResponse;
    return data.items[0]?.login ? data.items[0].login : randomUserName();
  } catch (error) {
    return randomUserName();
  }
};

export const randomUserName = () => {
  return `user_${getRandomNumber(10000000, 99999999)}`;
};

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface IResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubProfile[];
}
