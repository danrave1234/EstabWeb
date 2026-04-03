import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import LandingPageClient from '@/components/landing/LandingPageClient'

export const metadata: Metadata = {
  title: 'Affordable Business Website Philippines | EstabWeb',
  description: 'Launch a managed business website for your local service business in the Philippines. EstabWeb prepares the site for you, hands it off with easy editing, and supports custom domains, analytics, and AI-assisted updates.',
  keywords: [
    'website design philippines price',
    'small business website philippines',
    'affordable web design philippines',
    'managed website philippines',
    'website maintenance cost per month philippines',
    'online store website philippines',
    'landing page price philippines',
    'restaurant website philippines',
    'dental clinic website philippines',
    'gym website design philippines',
    'gym website creation philippines',
    'fitness studio website philippines',
    'local business website launch philippines'
  ],
}

export default async function EstabWebLanding() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <LandingPageClient initialUser={user} />
  )
}
