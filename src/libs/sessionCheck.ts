import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";

export class HttpError extends Error {
  message: string;
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

export const sessionCheck = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    return session;
  }
  throw new HttpError("Unauthorized", 401);
};
