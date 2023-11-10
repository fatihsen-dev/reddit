import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string({ required_error: "Title required" })
    .min(3, { message: "Title can be a minimum of 3 characters" })
    .max(50, { message: "Title can be maximum 50 characters" }),
  content: z
    .string()
    .max(1000, { message: "Content can be maximum 12 characters" })
    .optional(),
});
