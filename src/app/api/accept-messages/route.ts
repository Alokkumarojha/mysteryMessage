import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        message: "Unauthorized",
        success: false,
      },
      { status: 401 },
    );
  }
  const userId = user?._id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true },
    );
    if (!updatedUser) {
      return Response.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 },
      );
    }
    return Response.json(
      {
        message: "acceptMessages updated successfully",
        success: true,
        isAcceptingMessages: updatedUser.isAcceptingMessages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating acceptMessages:", error);
    return Response.json(
      {
        message: " Error updating acceptMessages",
        success: false,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        message: "Unauthorized",
        success: false,
      },
      { status: 401 },
    );
  }
  const userId = user?._id;
  try {
    const findUser = await UserModel.findById(userId);
    if (!findUser) {
      return Response.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 },
      );
    }
    return Response.json(
      {
        message: "User found",
        success: true,
        isAcceptingMessages: findUser.isAcceptingMessages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error finding user:", error);
    return Response.json(
      {
        message: "Error finding user",
        success: false,
      },
      { status: 500 },
    );
  }
}
