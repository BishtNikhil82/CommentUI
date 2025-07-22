import { createClientComponentClient} from '@supabase/auth-helpers-nextjs'

export function createClient() {
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  return createClientComponentClient()
}

