import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

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

    // === STEP 1: Extract visual concept from vague prompt ===
    const conceptRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a creative brand visual strategist. Your job is to interpret vague or marketing-style prompts and explain what core visual idea they aim to communicate. Include the key subject(s), message, emotional tone, and any embedded phrases or hashtags that should be displayed as text in the final image.`
        },
        {
          role: 'user',
          content: `User prompt: "${userPrompt}"\n\nBrand tone: ${brandSettings.tone || 'none'}\nKeywords: ${brandSettings.keywords || 'none'}`
        }
      ],
      temperature: 0.7
    });

    const visualConcept = conceptRes.choices[0].message.content?.trim();
    if (!visualConcept) {
      throw new Error('GPT failed to extract visual concept.');
    }

    // === STEP 2: Turn concept into a detailed image scene ===
    const sceneRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert visual designer. Based on the concept, describe a clean, engaging image scene that communicates it clearly. Include only 1–2 focal elements (e.g. a person and an object), a clear setting, mood, and any supporting details. This is not yet the final DALL·E prompt. Avoid clutter. If the prompt includes text, mention exactly where it should go, how it should appear, and the precise words to include.`
        },
        {
          role: 'user',
          content: `Concept summary: ${visualConcept}`
        }
      ],
      temperature: 0.7
    });

    const sceneDescription = sceneRes.choices[0].message.content?.trim();
    if (!sceneDescription) {
      throw new Error('GPT failed to generate the scene description.');
    }

    // === STEP 3: Format final DALL·E 3-ready prompt ===
    const finalPromptRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert image prompt engineer. Format the following scene into a polished, DALL·E 3-ready prompt using the structure below. The final prompt should be clean, legible, and stylistically consistent.

Use this structure:

"A [style/adjective] [type of image] of [subject], placed in/on [environment/context], using [lighting or mood], with [composition details if needed]. The image is in [design style], with a [color palette].

If text is needed: In the [location], [text language] text says '[Headline]'. Below that, in smaller text, it says '[Subheadline]'. The text is in [font style] and [color], and is naturally integrated and clearly legible — placed on a clean background or overlay box.

Shot in [aspect ratio] aspect ratio. [Style notes like: flat design, photorealistic, vector art, digital painting, etc.]

IMPORTANT:
- Limit visual elements to a few clear components.
- Avoid busy or cluttered backgrounds.
- Ensure text is readable, properly placed, and contrasts with its background.
- If using photorealism, do not embed small or complex text in the environment.
- Bold ideas. Simplify visuals. Prioritize storytelling clarity."

Only output the final refined image prompt.`
        },
        {
          role: 'user',
          content: `Scene: ${sceneDescription}`
        }
      ],
      temperature: 0.7
    });

    const masterPrompt = finalPromptRes.choices[0].message.content?.trim();
    if (!masterPrompt) {
      throw new Error('GPT failed to produce the final DALL·E prompt.');
    }

    console.log('Final Refined Prompt:', masterPrompt);

    // === STEP 4: Generate the image ===
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: masterPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'vivid'
    });

    const finalImageUrl = imageResponse.data[0].url;
    if (!finalImageUrl) {
      throw new Error('DALL·E 3 failed to return an image.');
    }

    // === STEP 5: Upload to Supabase ===
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
      refinedPrompt: masterPrompt,
      concept: visualConcept,
      scene: sceneDescription
    });

  } catch (err: any) {
    console.error('Image generation error:', err);
    return NextResponse.json(
      { error: 'Image generation process failed.', details: err.message },
      { status: 500 }
    );
  }
}
