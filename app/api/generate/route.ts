// src/app/api/generate/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { input, type } = await req.json();

    // NEW: Use the standard Route Handler client for modern, cookie-based auth
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // NEW: Fetch the description along with other settings for a better prompt
    const { data: settings, error: settingsError } = await supabase
      .from("brand_settings")
      .select("brand_name, description, tone, keywords")
      .eq("user_id", user.id)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json(
        { error: "Brand settings not found. Please complete your settings first." },
        { status: 404 }
      );
    }

    // ENHANCED: A more detailed and robust prompt for higher quality results
    const prompt = `
      You are an expert social media manager for the brand "${settings.brand_name}".
      
      **Brand Identity:**
      - Name: ${settings.brand_name}
      - Description: ${settings.description}
      - Tone of Voice: Your response MUST be in a ${settings.tone} tone.
      - Core Keywords: ${settings.keywords?.join(", ") || "N/A"}

      **Task:**
      Generate a "${type}" based on the following idea.
      The output should be ready to copy and paste directly to the social media platform.
      Do not include any of your own commentary, just the generated content.

      **User's Idea:**
      "${input}"
    `.trim();

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const output = aiRes.choices[0].message.content?.trim();

    if (!output) {
      return NextResponse.json({ error: "The AI failed to generate content." }, { status: 500 });
    }

    // Save the generated post to the 'posts' table (this logic is correct)
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
      // Don't fail the request if saving fails, but log it. The user should still get their content.
    }

    return NextResponse.json({ output });

  } catch (error: any) {
      console.error("Generate API Error:", error);
      return NextResponse.json({ error: 'An unexpected error occurred.', details: error.message }, { status: 500 });
  }
}