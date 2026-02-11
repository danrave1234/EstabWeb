"use client"

import * as React from "react"
import { login, signup } from "@/app/actions/auth"
import { toast } from "sonner"
import { LogIn, UserPlus, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [isPending, setIsPending] = React.useState(false)
  const [mode, setMode] = React.useState<'login' | 'signup'>('login')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)

    const formData = new FormData(event.currentTarget)
    
    try {
      const result = mode === 'login' 
        ? await login(formData) 
        : await signup(formData)

      if (result?.error) {
        toast.error(result.error)
      } else if ('success' in (result || {})) {
        toast.success((result as { success: string }).success)
      }
    } catch (error: any) {
      // Login redirects throw NEXT_REDIRECT, which is expected
      if (error?.digest?.startsWith('NEXT_REDIRECT')) return
      toast.error("An unexpected error occurred.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">E</div>
            <span className="text-2xl font-bold tracking-tight text-foreground">EstabWeb</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === 'login' 
              ? 'Enter your credentials to access your portal' 
              : 'Sign up to start building your professional website'}
          </p>
        </div>

        <div className="bg-background border border-border rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground" htmlFor="password">
                  Password
                </label>
                {mode === 'login' && (
                  <Link href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? (
                    <>
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <span className="text-primary font-bold ml-1 flex items-center gap-0.5">
                {mode === 'login' ? 'Sign up' : 'Log in'}
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 px-4">
          By continuing, you agree to EstabWeb's <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
