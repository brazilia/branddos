// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized: Invalid or expired session.' }, { status: 401 });
        }
        
        // NEW: Fetch the user's brand settings from the database
        const { data: brandSettings, error: settingsError } = await supabase
            .from('brand_settings')
            .select('brand_name, description, tone, keywords')
            .eq('user_id', user.id)
            .single(); // .single() is used because each user has only one row of settings

        if (settingsError) {
            console.error("Error fetching brand settings:", settingsError);
            // Don't fail the chat, just proceed with a generic prompt
        }

        // NEW: Dynamically construct the system prompt
        let systemPrompt = "You are a helpful and creative social media assistant."; // Default prompt

        if (brandSettings) {
            // If settings are found, build a much more detailed prompt
            systemPrompt = `
                You are a highly specialized social media assistant for the brand "${brandSettings.brand_name}".
                Your primary goal is to help the user with their social media presence.
                
                Brand Details:
                - Name: ${brandSettings.brand_name}
                - Description: ${brandSettings.description}
                - Required Tone of Voice: You must adopt a ${brandSettings.tone} tone.
                - Important Keywords: When relevant, try to naturally incorporate these keywords: ${brandSettings.keywords.join(', ')}.

                Your instructions:
                - ALWAYS write in a ${brandSettings.tone} tone.
                - Generate creative captions, content ideas, and strategic advice.
                - Do NOT mention that you are an AI. You are their brand's dedicated assistant.
                - Keep your responses concise and ready to be used on social media unless asked for a longer explanation.
            `.trim();
        }

        const { messages } = await req.json();

        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || !lastMessage.content) {
            return NextResponse.json({ error: "No message content" }, { status: 400 });
        }

        const saveUserMsgPromise = supabase.from("chat_messages").insert({
            user_id: user.id,
            role: "user",
            content: lastMessage.content,
        });

        // NEW: Use the dynamic system prompt
        const fullChat = [
            {
                role: "system",
                content: systemPrompt,
            },
            ...messages,
        ];

        const aiRes = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: fullChat,
        });

        const reply = aiRes.choices[0].message.content;

        if (!reply) {
            return NextResponse.json({ error: "AI failed to generate a reply." }, { status: 500 });
        }

        await Promise.all([
            saveUserMsgPromise,
            supabase.from("chat_messages").insert({
                user_id: user.id,
                role: "assistant",
                content: reply,
            })
        ]);

        return NextResponse.json({ reply });
    
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: 'An unexpected error occurred.', details: error.message }, { status: 500 });
    }
}