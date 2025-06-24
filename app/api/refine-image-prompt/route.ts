import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createCanvas, loadImage } from 'canvas';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { createSupabaseEdgeClient } from '@/lib/supabaseEdgeClient';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseEdgeClient(req);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userPrompt } = await req.json();

    if (!userPrompt?.trim()) {
      return NextResponse.json({ error: 'Please enter a prompt before generating.' }, { status: 400 });
    }

    // Step 1: Refine Prompt + Extract Headline/Subtext
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const refineResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert creative director. Refine the user\'s prompt for an image generation background (no text), and write a catchy headline and subtext for an ad. Respond ONLY in JSON format like: {"refinedPrompt":"...", "headline":"...", "subtext":"..."}',
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = refineResponse.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'No content received from OpenAI' }, { status: 500 });
    }

    let refinedData;
    try {
      refinedData = JSON.parse(content);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON format from OpenAI response' }, { status: 500 });
    }

    const { refinedPrompt, headline, subtext } = refinedData;

    if (!refinedPrompt) {
      return NextResponse.json({ error: 'Failed to extract refined prompt' }, { status: 500 });
    }

    // Step 2: Generate Image with Stability AI SDXL
    const stabilityRes = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        cfg_scale: 7,
        clip_guidance_preset: 'FAST_BLUE',
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 40,
        style_preset: 'photographic',
        text_prompts: [
          { text: refinedPrompt, weight: 1 },
          { text: 'text, caption, watermark, signature, logo', weight: -1 },
        ],
      }),
    });

    if (!stabilityRes.ok) {
      const errorDetails = await stabilityRes.text();
      throw new Error(`Stability AI generation failed: ${errorDetails}`);
    }

    const stabilityJson = await stabilityRes.json();
    const base64Image = stabilityJson.artifacts?.[0]?.base64;
    if (!base64Image) {
      throw new Error('No image returned from Stability AI');
    }

    const buffer = Buffer.from(base64Image, 'base64');

    // Step 3: Draw Text Overlay
    const baseImage = await loadImage(buffer);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(baseImage, 0, 0);

    // Step 4: Add Headline and Subtext
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(headline, canvas.width / 2, canvas.height * 0.15);
    ctx.font = '28px Arial';
    ctx.fillText(subtext, canvas.width / 2, canvas.height * 0.23);

    // Step 5: Convert to PNG and Upload to Supabase
    const finalBuffer = await sharp(canvas.toBuffer('image/png')).png().toBuffer();
    const filename = `${user.id}/${uuidv4()}.png`;

    const { error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(filename, finalBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('generated-images').getPublicUrl(filename);

    return NextResponse.json({
      imageUrl: publicUrl,
      headline,
      subtext,
    });
  } catch (err: any) {
    console.error('Server Error:', err);
    return NextResponse.json(
      {
        error: 'Image generation failed',
        details: err.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
