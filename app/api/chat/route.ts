import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createSupabaseEdgeClient } from "@/lib/supabaseEdgeClient";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { messages } = await req.json(); // ✅ handle full array of messages

  const supabase = createSupabaseEdgeClient(req);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Save the user message (last in array)
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || !lastMessage.content) {
    return NextResponse.json(
      { error: "No message content" },
      { status: 400 }
    );
  }

  await supabase.from("chat_messages").insert({
    user_id: user.id,
    role: "user",
    content: lastMessage.content,
  });

  // Add a system prompt at the top
  const fullChat = [
    {
      role: "system",
      content:
        "You are a helpful and creative social media assistant helping users with captions, hashtags, and strategy.",
    },
    ...messages,
  ];

  const aiRes = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: fullChat,
  });

  const reply = aiRes.choices[0].message.content;

  // Save assistant message
  await supabase.from("chat_messages").insert({
    user_id: user.id,
    role: "assistant",
    content: reply,
  });

  return NextResponse.json({ reply });
}
