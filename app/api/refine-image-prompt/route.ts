// /api/refine-image-prompt/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';
// You might need to increase the max duration on Vercel Pro plans if needed
// export const maxDuration = 30; 

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userPrompt } = await req.json();
    if (!userPrompt?.trim()) {
      return NextResponse.json({ error: 'Please describe your idea.' }, { status: 400 });
    }

    const { data: brandSettings } = await supabase
      .from('brand_settings')
      .select('brand_name, description, tone, keywords')
      .eq('user_id', user.id)
      .single();

    if (!brandSettings) {
      return NextResponse.json({ error: 'Brand settings not found. Please complete them first.' }, { status: 404 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // === NEW: SINGLE GPT-4 CALL TO RULE THEM ALL ===
    // This combines all three previous steps into one efficient request.
    console.log('1. Generating refined DALL-E prompt with a single GPT-4 call...');
    const finalPromptRes = await openai.chat.completions.create({
      model: 'gpt-4-turbo', // Using turbo is faster and cheaper
      messages: [
        {
          role: 'system',
          content: `You are an expert visual strategist and prompt engineer. Your goal is to convert a user's idea into a single, perfect, DALL-E 3-ready image prompt.

          Follow these steps internally:
          1.  **Analyze Concept**: Understand the core visual idea, message, and tone from the user's prompt and their brand settings.
          2.  **Design Scene**: Based on the concept, design a clean, engaging image scene. Focus on 1-2 key elements, a clear setting, and mood. Avoid visual clutter.
          3.  **Construct Final Prompt**: Format the designed scene into a detailed DALL-E 3 prompt using the structure below.

          **Final Prompt Structure:**
          "A [style/adjective] [type of image] of [subject], placed in/on [environment/context], using [lighting or mood], with [composition details if needed]. The image is in [design style], with a [color palette].

          If text is needed: In the [location], [text language] text says '[Headline]'. Below that, in smaller text, it says '[Subheadline]'. The text is in [font style] and [color], and is naturally integrated and clearly legible.

          Shot in [aspect ratio] aspect ratio. [Style notes like: flat design, photorealistic, vector art, etc.]"

          **CRITICAL RULES:**
          - Prioritize storytelling and clarity. Bold ideas, simple visuals.
          - If the user asks for text, ensure it's short, readable, and contrasts with the background.
          - Your FINAL output MUST BE ONLY the DALL-E 3 prompt string and nothing else. Do not add any conversational text or explanations like "Here is the prompt:".`
        },
        {
          role: 'user',
          content: `User Idea: "${userPrompt}"\n\nBrand Tone: ${brandSettings.tone || 'not specified'}\nBrand Keywords: ${brandSettings.keywords || 'not specified'}`
        }
      ],
      temperature: 0.7,
    });

    const masterPrompt = finalPromptRes.choices[0].message.content?.trim().replace(/^"|"$/g, ''); // Clean up potential quotes
    if (!masterPrompt) {
      throw new Error('GPT-4 failed to produce the final DALL-E prompt.');
    }

    console.log('2. Final Refined Prompt:', masterPrompt);

    // === STEP 2: Generate the image (this part remains the same) ===
    console.log('3. Sending prompt to DALL-E 3...');
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: masterPrompt,
      n: 1,
      // NOTE: DALL-E 3's `size` param determines aspect ratio. You'll need to parse this from the user's prompt or add a UI selector for it.
      // For now, it's hardcoded to square.
      size: '1024x1024',
      quality: 'hd',
      style: 'vivid'
    });

    const finalImageUrl = imageResponse.data[0].url;
    if (!finalImageUrl) {
      throw new Error('DALL-E 3 failed to return an image.');
    }

    // === STEP 3: Upload to Supabase (this part remains the same) ===
    console.log('4. Uploading final asset to storage...');
    const fetchedImage = await fetch(finalImageUrl);
    const imageBuffer = Buffer.from(await fetchedImage.arrayBuffer());
    const filename = `${user.id}/${uuidv4()}.png`;

    const { error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(filename, imageBuffer, {
        contentType: 'image/png'
      });

    if (uploadError) {
      throw new Error('Storage upload failed: ' + uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(filename);

    return NextResponse.json({
      imageUrl: publicUrl,
      // You no longer have the intermediate steps, so we only return the refined prompt
      refinedPrompt: masterPrompt, 
    });

  } catch (err: any) {
    console.error('Image generation process failed:', err);
    // This catch block will now be reached if something goes wrong within the time limit.
    return NextResponse.json(
      { error: 'Image generation process failed.', details: err.message },
      { status: 500 }
    );
  }
}