import { z } from "zod";

export const signInSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, { message: "Username or Email is required" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
