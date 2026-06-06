import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 },
      );
    }
    // is user accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          message: "User is not accepting messages",
          success: false,
        },
        { status: 403 },
      );
    }
    const newMessage = {
      content,
      createdAt: new Date(),
    };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        message: "Message sent successfully",
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      {
        message: "Error sending message",
        success: false,
      },
      { status: 500 },
    );
  }
}
