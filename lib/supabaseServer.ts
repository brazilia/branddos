// lib/supabaseServer.ts
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { SupabaseClient } from '@supabase/supabase-js'

export const createSupabaseServerClient = (): SupabaseClient => {
  const cookieStore = cookies()

  return createServerComponentClient({
    cookies: () => cookieStore,
  })
}
