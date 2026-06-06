import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Message } from "@/model/user.model";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (MessageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  // Implement the logic to delete the message here
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`,
      );
      console.log("DELETE MESSAGE RESPONSE", response.data);

      toast.success(response.data.message);

      onMessageDelete(message._id.toString());
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
      console.error(error);
    }
  };
  return (
    <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardDescription>
          {new Date(message.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed">{message.content}</p>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Chat</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                🗑️
              </div>

              <AlertDialogTitle className="text-center text-xl">
                Delete Message?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-center">
                This anonymous message will be permanently deleted and cannot be
                recovered.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Delete Forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
export default MessageCard;
