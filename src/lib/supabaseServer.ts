import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  console.log('SUPABASE_URL (server):', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('SUPABASE_ANON_KEY (server):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  return createServerComponentClient({ cookies: () => cookies() })
}