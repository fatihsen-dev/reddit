import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name required" })
    .min(3, { message: "Name can be a minimum of 3 characters" })
    .max(12, { message: "Name can be maximum 12 characters" }),
  surname: z
    .string({ required_error: "Surname required" })
    .min(3, { message: "Surname can be a minimum of 3 characters" })
    .max(12, { message: "Surname can be maximum 12 characters" }),
  username: z
    .string({ required_error: "Username required" })
    .min(3, { message: "Username can be a minimum of 3 characters" })
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
