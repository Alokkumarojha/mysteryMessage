import { z } from "zod";

export const verifySchema = z.object({
  verifyCode: z
    .string()
    .trim()
    .length(6, { message: "Verification code must be exactly 6 digits" })
    .regex(/^[0-9]+$/, { message: "Code must contain only numbers" }),
});
