// src/app/api/generate/route.ts
import { NextResponse } from "next/server";
import { createSupabaseEdgeClient } from "@/lib/supabaseEdgeClient";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { input, type } = await req.json();
  const supabase = createSupabaseEdgeClient(req);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch brand settings
  const { data: settings, error: settingsError } = await supabase
    .from("brand_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (settingsError || !settings) {
    return NextResponse.json(
      { error: "No brand settings found" },
      { status: 404 }
    );
  }

  const prompt = `You are a content creator for a brand.
Brand: ${settings.brand_name}
Tone: ${settings.tone}
Keywords: ${settings.keywords?.join(", ") || ""}

Generate a ${type} post based on the following idea: "${input}"`;

  const aiRes = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const output = aiRes.choices[0].message.content?.trim();

  // Save to Supabase
  const { error: insertError } = await supabase.from("posts").insert([
    {
      user_id: user.id,
      input,
      output,
      type,
    },
  ]);

  if (insertError) {
    console.error("Failed to save to posts:", insertError);
    return NextResponse.json(
      { error: "Failed to save to posts" },
      { status: 500 }
    );
  }

  return NextResponse.json({ output });
}
