import { NextResponse } from 'next/server'
import { createSupabaseEdgeClient } from '@/lib/supabaseEdgeClient'

export const runtime = 'edge' // tells Next.js this is an Edge function

export async function POST(req: Request) {
  const supabase = createSupabaseEdgeClient(req)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch brand settings
  const { data: brandSettings } = await supabase
    .from('brand_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!brandSettings) {
    return NextResponse.json({ error: 'No brand settings found' }, { status: 404 })
  }

  const { tone, keywords, description } = brandSettings

  const prompt = `
    Generate a branding-themed image that reflects:
    - Tone: ${tone}
    - Keywords: ${keywords.join(', ')}
    - Description: ${description}
  `

  try {
    // 🧠 Native FormData and Blob (Edge-compatible)
    const form = new FormData()
    form.append('prompt', prompt)
    form.append('model', 'stable-diffusion-xl-1024-v1-0')
    form.append('output_format', 'png')

    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        Accept: 'image/*', // Stability requires this
        // Do NOT manually set Content-Type; browser will add correct multipart boundary
      },
      body: form,
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Stability API error:', error)
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    }

    const imageBlob = await response.blob()
    const fileName = `image_${Date.now()}.png`

    const { error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(`${user.id}/${fileName}`, imageBlob, {
        contentType: 'image/png',
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload failed:', uploadError)
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('generated-images').getPublicUrl(`${user.id}/${fileName}`)

    return NextResponse.json({ imageUrl: publicUrl })
  } catch (err) {
    console.error('Image generation failed:', err)
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
  }
}
