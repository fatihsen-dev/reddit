import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string({ required_error: "Title required" })
    .min(3, { message: "Title can be a minimum of 3 characters" })
    .max(80, { message: "Title can be maximum 80 characters" }),
  content: z
    .string()
    .max(1000, { message: "Content can be maximum 1000 characters" })
    .optional(),
});
