import { z } from "zod";

export const registerBody = z.object({
  username: z
    .string({ required_error: "Username required" })
    .min(3, { message: "Username can be a minimum of 6 characters" })
    .max(24, { message: "Username can be maximum 24 characters" }),
  email: z
    .string({ required_error: "Email required" })
    .email({ message: "Invalid email address" })
    .max(40, { message: "Email can be maximum 40 characters" }),
  password: z
    .string({ required_error: "Password required" })
    .min(6, { message: "Password can be a minimum of 6 characters" })
    .max(20, { message: "Password can be maximum 20 characters" }),
});
