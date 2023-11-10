import { z } from "zod";

export const editProfileSchema = z.object({
  name: z
    .string({ required_error: "Name required" })
    .min(3, { message: "Name can be a minimum of 3 characters" })
    .max(12, { message: "Name can be maximum 12 characters" }),
  surname: z
    .string({ required_error: "Surname required" })
    .min(3, { message: "Surname can be a minimum of 3 characters" })
    .max(12, { message: "Surname can be maximum 12 characters" }),
  image: z
    .string()
    .max(120, { message: "Avatar Url can be maximum 120 characters" })
    .optional(),
  desc: z
    .string()
    .max(150, { message: "Description can be maximum 150 characters" })
    .optional(),
});
