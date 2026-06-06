import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> },
) {
  //const messageId = (await params).messageid;
  const { messageid } = await params;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 400 },
    );
  }
  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } },
    );
    console.log("UPDATE RESULT:", updateResult);
    if (updateResult.matchedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Messsage not found , Already delete",
        },
        { status: 404 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message Deleted",
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { Suspense: false, message: "Error deleting Message" },
      { status: 500 },
    );
  }
}
