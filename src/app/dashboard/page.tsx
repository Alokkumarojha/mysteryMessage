"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessages = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id.toString() !== messageId),
    );
  };

  // const { data: session } = useSession();
  const result = useSession();
  const session = result.data;

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      console.log("ACCEPT RESPONSE", response.data);
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data.message ||
          "Failed to fetch accepting messages status",
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");

      console.log("GET MESSAGES RESPONSE", response.data);

      setMessages(response.data.messages || []);

      if (refresh) {
        toast.success("Messages refreshed successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch messages",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptingMessages();
  }, [session, setValue, fetchMessages, fetchAcceptingMessages]);

  // handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      //   toast(
      //     axiosError.response?.data.message ||
      //       "Failed to update accepting messages status",
      //  );
      console.log("ERROR:", axiosError.response);
      console.log("DATA:", axiosError.response?.data);

      toast.error(
        axiosError.response?.data.message ||
          "Failed to update accepting messages status",
      );
    }
  };
  const username = session?.user?.username;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const profileUrl = `${baseUrl}/u/${username}`;
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);

      toast.success("Profile URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">
            Welcome, {session.user.username} 👋
          </h1>
          <p className="text-muted-foreground">
            Manage your anonymous messages dashboard.
          </p>
        </div>

        {/* Share Link Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Your Unique Link</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={profileUrl}
              type="text"
              readOnly
              className="flex-1 rounded-md border px-3 py-2 bg-muted"
            />

            <Button onClick={copyToClipboard}>Copy Link</Button>
          </div>
        </div>

        {/* Accept Messages */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Accept Messages</h2>

              <p className="text-sm text-muted-foreground">
                Allow people to send anonymous messages.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                {...form.register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />

              <span className="text-sm font-medium">
                {acceptMessages ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </div>

        {/* Refresh */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            Refresh Messages
          </Button>
        </div>

        <Separator />

        {/* Messages */}
        <div>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="rounded-xl border p-4 space-y-3">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : messages.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {messages.map((message) => (
                <MessageCard
                  key={message._id.toString()}
                  message={message}
                  onMessageDelete={handleDeleteMessages}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="text-muted-foreground">No messages to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
