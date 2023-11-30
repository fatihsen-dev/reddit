import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(3, { message: "Content can be minimum 3 characters" })
    .max(200, { message: "Content can be maximum 200 characters" }),
});
