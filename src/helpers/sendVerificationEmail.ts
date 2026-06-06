import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmails";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string,
): Promise<ApiResponse> {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      // to: email,
      to: "delivered@resend.dev",
      subject: "Verify your email",
      react: VerificationEmail({ username, otp }),
    });

    console.log(data);

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
}
