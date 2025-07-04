// /api/refine-image-prompt/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { createCanvas, loadImage } from 'canvas';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // THE FIX 1: Use the modern route handler client for auth & db operations
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired session.' }, { status: 401 });
    }
    
    const { userPrompt } = await req.json();

    if (!userPrompt?.trim()) {
      return NextResponse.json({ error: 'Please enter a prompt.' }, { status: 400 });
    }
    
    // THE FIX 2: Fetch brand settings to make the AI smarter
    const { data: brandSettings, error: settingsError } = await supabase
        .from('brand_settings')
        .select('brand_name, description, tone')
        .eq('user_id', user.id)
        .single();
    
    if (settingsError || !brandSettings) {
      return NextResponse.json({ error: "Brand settings not found. Please complete them first." }, { status: 404 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // ENHANCED PROMPT: Inject the brand context into the AI's instructions
    const systemPrompt = `
        You are an expert creative director for the brand "${brandSettings.brand_name}".
        Your task is to take a user's idea and prepare it for an ad campaign.
        The brand's tone of voice is strictly "${brandSettings.tone}".
        The brand's description is: "${brandSettings.description}".

        You must:
        1. Refine the user's prompt into a detailed, photorealistic prompt for an AI image generator. The prompt should describe a scene with no text or words in it.
        2. Write a catchy, short headline (max 5 words) that matches the brand's ${brandSettings.tone} tone.
        3. Write a compelling subtext (max 10 words) that also matches the brand's tone.

        Respond ONLY in a valid JSON format like this: {"refinedPrompt":"...", "headline":"...", "subtext":"..."}
    `.trim();

    const refineResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo', // Using a model that's good with JSON
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: "json_object" }, // Enforce JSON output
    });

    const content = refineResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI did not return content.");
    }

    const refinedData = JSON.parse(content);
    const { refinedPrompt, headline, subtext } = refinedData;

    // ... (Your Stability AI and Canvas logic remains the same) ...
    const stabilityRes = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            cfg_scale: 7, height: 1024, width: 1024, samples: 1, steps: 30, style_preset: 'photographic',
            text_prompts: [{ text: refinedPrompt, weight: 1 }, { text: 'text, caption, watermark, signature, logo, words', weight: -1 }],
        }),
    });
    if (!stabilityRes.ok) throw new Error(`Stability AI API call failed: ${stabilityRes.statusText}`);
    const stabilityJson = await stabilityRes.json();
    const base64Image = stabilityJson.artifacts?.[0]?.base64;
    if (!base64Image) throw new Error("No image found in Stability AI response.");
    
    const buffer = Buffer.from(base64Image, 'base64');
    const baseImage = await loadImage(buffer);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(baseImage, 0, 0);
    ctx.fillStyle = 'white'; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 10;
    ctx.font = 'bold 72px Arial'; ctx.fillText(headline, canvas.width / 2, canvas.height * 0.15);
    ctx.font = '48px Arial'; ctx.fillText(subtext, canvas.width / 2, canvas.height * 0.25);
    const finalBuffer = await sharp(canvas.toBuffer('image/png')).png().toBuffer();


    // THE FIX 3: Use the single, already authenticated Supabase client for the upload
    const filename = `${user.id}/${uuidv4()}.png`;
    const { error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(filename, finalBuffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage.from('generated-images').getPublicUrl(filename);

    return NextResponse.json({ imageUrl: publicUrl, headline, subtext });

  } catch (err: any) {
    console.error('Overall Server Error:', err);
    return NextResponse.json({ error: 'Image generation process failed.', details: err.message }, { status: 500 });
  }
}