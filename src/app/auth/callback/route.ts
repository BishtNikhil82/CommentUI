import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createServerSupabaseClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_error`)
      }

      // Store YouTube tokens in user metadata if available
      if (data.session?.provider_token) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            provider_token: data.session.provider_token,
            provider_refresh_token: data.session.provider_refresh_token,
          }
        })
        
        if (updateError) {
          console.error('Error storing tokens:', updateError)
        }
      }

      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    } catch (error) {
      console.error('Unexpected auth error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=unexpected_error`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
}