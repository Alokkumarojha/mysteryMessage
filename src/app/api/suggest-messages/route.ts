import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // 💡 FIX: useCompletion hamesha body mein 'prompt' bhejta hai, toh hum use 'topicFromFrontend' mein save kar rahe hain
    const { prompt: topicFromFrontend } = await req.json();

    const response = streamText({
      model: google("gemini-2.5-flash"),
      prompt: `
Create exactly 3 open-ended and engaging questions
for an anonymous social messaging platform.

Topic/Context: ${topicFromFrontend || "General conversation"}

Rules:
- Questions must be friendly and intriguing
- Avoid personal or sensitive topics
- Encourage curiosity and conversation
- Suitable for a diverse audience
- Separate each question using ||
- Do not include numbering or extra text

Example Output:
What's a hobby you've recently started?||
If you could travel anywhere tomorrow, where would you go?||
What's a simple thing that always makes you happy?
`,
    });

    return response.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate suggestions" }),
      {
        status: 500,
      },
    );
  }
}
