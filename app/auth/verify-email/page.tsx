import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export default async function VerifyEmailPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in, go to login
  if (!user) redirect('/login')

  // If already verified, go to dashboard
  if (user.email_confirmed_at) redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center space-y-4">
        <div className="flex flex-col items-center gap-2 mb-2">
          <Image src="/Logo.png" alt="EstabWeb" width={48} height={48} className="rounded-xl" />
          <span className="text-lg font-bold text-gray-900">EstabWeb</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
        <p className="text-gray-600">
          We sent a verification link to{' '}
          <span className="font-medium text-gray-900">{user.email}</span>.
          Please check your inbox and click the link to activate your account.
        </p>
        <p className="text-sm text-gray-400">
          Once verified, refresh this page or log in again to access the app.
        </p>
        <a
          href="/auth/signout"
          className="inline-block mt-4 text-sm text-red-500 hover:underline"
        >
          Sign out
        </a>
      </div>
    </div>
  )
}
