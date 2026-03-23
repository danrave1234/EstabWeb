import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileSettingsForm from '@/components/dashboard/ProfileSettingsForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Profile & Settings',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, role, full_name, phone, bio, created_at')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  return (
    <>
      <main className="min-h-screen pt-12 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account information and preferences.</p>
          </div>
          <ProfileSettingsForm profile={profile} />
        </div>
      </main>
    </>
  )
}
