// src/app/api/generate/route.ts
import { NextResponse } from 'next/server'
import { createSupabaseEdgeClient } from '@/lib/supabaseEdgeClient'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { input, type } = await req.json()
  const supabase = createSupabaseEdgeClient(req)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const prompt = `Write a ${type} for: ${input}`

  const aiRes = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  })

  const output = aiRes.choices[0].message.content

  // Save to Supabase
  const { error: insertError } = await supabase.from('posts').insert([
    {
      user_id: user.id,
      input,
      output,
      type,
    },
  ]);
  
  if (insertError) {
    console.error("Failed to save to posts:", insertError);
    return NextResponse.json({ error: "Failed to save to posts" }, { status: 500 });
  }
  

  return NextResponse.json({ output })
}
