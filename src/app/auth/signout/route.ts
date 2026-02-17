import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // 1. Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // 2. Sign out (deletes session on Supabase & clears cookies)
    await supabase.auth.signOut()
  }

  // 3. Revalidate the home page to refresh the UI (remove the "Welcome" message)
  revalidatePath('/', 'layout')

  // 4. Redirect the user back to login or home
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })
}