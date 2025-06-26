// app/api/save-settings/route.ts
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

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // .upsert() handles both creating and updating in a single call.
  // It will match the row based on the 'user_id' column.
  const { error } = await supabase
    .from('brand_settings')
    .upsert({
      user_id: user.id, // This is the column it will use to find the row
      brand_name,
      description,
      tone,
      keywords,
      logo_url,
      post_frequency,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id' // Tell Supabase to use `user_id` as the conflict target
    });

  if (error) {
    console.error("Supabase upsert error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Settings saved successfully' }), { status: 200 });
}