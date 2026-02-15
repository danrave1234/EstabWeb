import * as React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import MainHeader from '@/components/shared/MainHeader'
import MainFooter from '@/components/shared/MainFooter'
import StructuredData from '@/components/shared/StructuredData'

import LandingPageClient from '@/components/landing/LandingPageClient'

export default async function EstabWebLanding() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <LandingPageClient initialUser={user} />
  )
}
