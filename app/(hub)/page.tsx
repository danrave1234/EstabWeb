import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import LandingPageClient from '@/components/landing/LandingPageClient'

export const metadata: Metadata = {
  title: 'Affordable Business Website Philippines | EstabWeb',
  description: 'Get a ready business website for your local shop, clinic, salon, restaurant, or service in the Philippines. Easy editing, monthly subscription, and design requests included.',
  keywords: [
    'website design philippines price',
    'small business website philippines',
    'affordable web design philippines',
    'website builder philippines',
    'website maintenance cost per month philippines',
    'online store website philippines',
    'landing page price philippines',
    'restaurant website philippines',
    'dental clinic website philippines',
    'create website philippines'
  ],
}

export default async function EstabWebLanding() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <LandingPageClient initialUser={user} />
  )
}
