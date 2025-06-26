import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
    try {
        // THE FIX: Explicitly get the token from the header
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Authorization header is missing or invalid.' }, { status: 401 });
        }
        const accessToken = authHeader.split(' ')[1];

        // Create a generic Supabase client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Authenticate the user with the provided token
        const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
        
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
        }
        
        // --- AUTHENTICATION IS NOW COMPLETE AND RELIABLE ---
        
        const { messages } = await req.json();

        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || !lastMessage.content) {
            return NextResponse.json({ error: "No message content" }, { status: 400 });
        }

        // Save user message (can be done in parallel with AI call for speed)
        const saveUserMsgPromise = supabase.from("chat_messages").insert({
            user_id: user.id,
            role: "user",
            content: lastMessage.content,
        });

        const fullChat = [
            {
                role: "system",
                content: "You are a helpful and creative social media assistant helping users with captions, hashtags, and strategy.",
            },
            ...messages,
        ];

        const aiRes = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: fullChat,
        });

        const reply = aiRes.choices[0].message.content;

        if (!reply) {
            return NextResponse.json({ error: "AI failed to generate a reply." }, { status: 500 });
        }

        // Wait for user message save to complete and also save assistant message
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