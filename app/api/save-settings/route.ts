// ✅ CORRECT for App Router (app/api/save-settings/route.ts)
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await req.json();

  const {
    brand_name,
    description,
    tone,
    keywords,
    logo_url,
    post_frequency,
  } = body;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { data: existing } = await supabase
    .from('brand_settings')
    .select('id')
    .eq('user_id', user.id)
    .single();

  let dbResponse;

  if (existing) {
    dbResponse = await supabase
      .from('brand_settings')
      .update({
        brand_name,
        description,
        tone,
        keywords,
        logo_url,
        post_frequency,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);
  } else {
    dbResponse = await supabase
      .from('brand_settings')
      .insert([
        {
          user_id: user.id,
          brand_name,
          description,
          tone,
          keywords,
          logo_url,
          post_frequency,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
  }

  if (dbResponse.error) {
    return new Response(JSON.stringify({ error: dbResponse.error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Settings saved successfully' }), { status: 200 });
}
