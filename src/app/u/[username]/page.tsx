"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // AI Suggestions ke liye plain React states
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([
    "What's a book or movie that completely changed your perspective?",
    "If you could have dinner with any historical figure, who would it be?",
    "What's a small thing that made you smile today?",
  ]);

  useEffect(() => {
    const checkUserAcceptingStatus = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `/api/accept-messages?username=${username}`,
        );
        setIsAccepting(response.data.isAcceptingMessages ?? true);
      } catch (error) {
        console.error("Error fetching user status", error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    if (username) checkUserAcceptingStatus();
  }, [username]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: username,
        content: content,
      });

      toast.success(response.data.message || "Message sent successfully!");
      setContent("");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to send message",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 NEW: Direct Axios call for AI Suggestions
  const fetchAiSuggestions = async () => {
    setIsSuggesting(true);
    try {
      // Hum direct backend ko hit kar rahe hain plain post request se
      const response = await axios.post("/api/suggest-messages", {
        prompt: "Fun, creative, and interesting icebreakers",
      });

      // Agar response string format mein hai ya textStream hai, toh data nikalenge
      const rawText =
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data);

      if (rawText) {
        // String ko '||' se tod kar array mein set kar rahe hain
        const parsedSuggestions = rawText
          .split("||")
          .map((s) => s.trim())
          .filter(Boolean);

        if (parsedSuggestions.length > 0) {
          setCurrentSuggestions(parsedSuggestions);
          toast.success("New suggestions loaded!");
        }
      }
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      toast.error("Could not fetch new suggestions. Please try again.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setContent(suggestionText);
  };

  if (isCheckingStatus) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 space-y-6">
      <Card className="w-full max-w-xl shadow-md bg-card rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Send Anonymous Message to @{username}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isAccepting ? (
            <div className="text-center p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 font-medium">
                @{username} is not accepting messages right now.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Aap abhi inhe anonymous message nahi bhej sakte.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <Textarea
                placeholder="Write your anonymous message here secretly..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="resize-none min-h-[120px] rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                maxLength={400}
                disabled={isLoading}
              />
              <div className="text-right text-xs text-gray-400">
                {content.length}/400 characters
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" /> Sending...
                  </>
                ) : (
                  "Send Message Anonymous"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {isAccepting && (
        <div className="w-full max-w-xl space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-purple-500 fill-purple-500" />
              Select any message below to suggest:
            </h3>
            <Button
              onClick={fetchAiSuggestions}
              disabled={isSuggesting}
              variant="outline"
              size="sm"
              className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50 rounded-lg"
            >
              {isSuggesting ? (
                <Loader2 className="animate-spin w-3 h-3 mr-1" />
              ) : (
                "Suggest New"
              )}
            </Button>
          </div>

          <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            {currentSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left text-sm bg-gray-50 hover:bg-purple-50 hover:text-purple-900 text-gray-700 p-3 rounded-xl border border-gray-100 transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
