import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const verifyCodeSchema = z.object({
  username: userNameValidation,
  code: z
    .string()
    .trim()
    .length(6, { message: "Code must be 6 digits" })
    .regex(/^[0-9]+$/, { message: "Code must contain only numbers" }),
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    // const { username, code } = await request.json();
    // const decodedUsername = decodeURIComponent(username);
    const body = await request.json();

    const result = verifyCodeSchema.safeParse(body);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      const codeError = result.error.format().code?._errors || [];
      return Response.json(
        {
          success: false,
          message: usernameError[0] || codeError[0] || " Invalid input",
        },
        { status: 400 },
      );
    }

    const { username, code } = result.data;

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 },
      );
    }
    const isCodeNotExpired = new Date(user.verifiedExpiry) > new Date();
    const isCodeValid = user.verifyCode === code;
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      //user.verifyCode = "";  // Clear the code after successful verification
      await user.save();
      return Response.json(
        {
          message: "Verification successful",
          success: true,
        },
        { status: 200 },
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          message: "Verification code has expired - please request a new one",
          success: false,
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          message: "Invalid verification code",
          success: false,
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return Response.json(
      {
        message: "Internal server error",
        success: false,
      },
      { status: 500 },
    );
  }
}
