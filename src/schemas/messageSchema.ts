import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s.,!?]+$/, "Message contains invalid characters")
    .min(10, "Message content must be at least 10 characters long")
    .max(300, "Message content must be at most 300 characters long")
    .refine((val) => val.length > 0, {
      message: "Message cannot be empty",
    }),
});
