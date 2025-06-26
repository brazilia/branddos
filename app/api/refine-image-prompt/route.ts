import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createCanvas, loadImage } from 'canvas';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization header is missing or invalid.' }, { status: 401 });
    }
    
    const accessToken = authHeader.split(' ')[1];
    
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
    }
    
    const { userPrompt } = await req.json();

    if (!userPrompt?.trim()) {
      return NextResponse.json({ error: 'Please enter a prompt before generating.' }, { status: 400 });
    }
    
    // --- The rest of your image generation logic ---
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const refineResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert creative director. Refine the user\'s prompt for an image generation background (no text), and write a catchy headline and subtext for an ad. Respond ONLY in JSON format like: {"refinedPrompt":"...", "headline":"...", "subtext":"..."}' },
        { role: 'user', content: userPrompt },
      ],
    });
    const content = refineResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI did not return content.");
    }
    const refinedData = JSON.parse(content);
    const { refinedPrompt, headline, subtext } = refinedData;

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
            steps: 30, // Reduced for faster generation
            style_preset: 'photographic',
            text_prompts: [{ text: refinedPrompt, weight: 1 }, { text: 'text, caption, watermark, signature, logo, words', weight: -1 }],
        }),
    });
    if (!stabilityRes.ok) {
        throw new Error(`Stability AI API call failed with status: ${stabilityRes.statusText}`);
    }
    const stabilityJson = await stabilityRes.json();
    const base64Image = stabilityJson.artifacts?.[0]?.base64;
    if (!base64Image) {
        throw new Error("No image artifact found in Stability AI response.");
    }
    const buffer = Buffer.from(base64Image, 'base64');
    
    const baseImage = await loadImage(buffer);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(baseImage, 0, 0);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.font = 'bold 72px Arial'; // Increased size for better impact
    ctx.fillText(headline, canvas.width / 2, canvas.height * 0.15);
    ctx.font = '48px Arial';
    ctx.fillText(subtext, canvas.width / 2, canvas.height * 0.25);
    const finalBuffer = await sharp(canvas.toBuffer('image/png')).png().toBuffer();


    // Use a Supabase client that is authenticated *as the user* for the upload
    const supabaseAuthed = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      }
    );

    const filename = `${user.id}/${uuidv4()}.png`;
    const { error: uploadError } = await supabaseAuthed.storage
      .from('generated-images')
      .upload(filename, finalBuffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from('generated-images').getPublicUrl(filename);

    return NextResponse.json({
      imageUrl: publicUrl,
      headline,
      subtext,
    });
  } catch (err: any) {
    console.error('Overall Server Error:', err);
    return NextResponse.json({ error: 'Image generation process failed.', details: err.message || 'Unknown error' }, { status: 500 });
  }
}