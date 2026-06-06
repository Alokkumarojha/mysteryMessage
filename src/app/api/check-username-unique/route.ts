import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const checkUsernameSchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    // Zod validation for query parameters
    const result = checkUsernameSchema.safeParse(queryParams);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          message: usernameError[0],
          success: false,
        },
        { status: 400 },
      );
    }
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          message: "Username is already taken",
          success: false,
        },
        { status: 409 },
      );
    }
    return Response.json(
      {
        message: "Username is available",
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return Response.json(
      {
        message: "Internal server error",
        success: false,
      },
      { status: 500 },
    );
  }
}
