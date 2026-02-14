"use client"

import * as React from "react"
import { login, signup } from "@/app/actions/auth"
import { toast } from "sonner"
import { LogIn, UserPlus, ArrowRight, Loader2, Zap, Shield, Globe, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

function LoginContent() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  
  const [isPending, setIsPending] = React.useState(false)
  const [mode, setMode] = React.useState<'login' | 'signup'>(initialMode)

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
      } else if (result && 'success' in result) {
        toast.success((result as { success: string }).success)
      }
    } catch (error: any) {
      if (error?.digest?.startsWith('NEXT_REDIRECT')) return
      toast.error("An unexpected error occurred.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background relative">
      <Link 
        href="/"
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-foreground lg:text-primary-foreground hover:opacity-80 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back</span>
      </Link>
      {/* Left Side - Branding & Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-lg w-full text-primary-foreground space-y-12">
          <Link href="/" className="items-center gap-3 group hidden lg:flex">
            <Image 
              src="/Logo.svg" 
              alt="EstabWeb Logo" 
              width={48} 
              height={48} 
              className="w-12 h-12 object-contain group-hover:-rotate-6 transition-transform"
            />
            <span className="text-3xl font-bold tracking-tighter">EstabWeb</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Build your <span className="text-white/80">professional presence</span> in minutes.
            </h2>
            <p className="text-xl text-primary-foreground/80 leading-relaxed font-medium">
              Join thousands of local businesses who trust EstabWeb for their high-performance, managed websites.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
            {[
              { icon: <Zap className="w-5 h-5" />, text: "Instant Launch" },
              { icon: <Shield className="w-5 h-5" />, text: "Managed Security" },
              { icon: <Globe className="w-5 h-5" />, text: "Global Edge" },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: "SEO Optimized" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                <div className="text-white">{feature.icon}</div>
                <span className="font-semibold text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
                   <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">U{i}</div>
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-primary bg-white text-primary flex items-center justify-center text-xs font-bold shadow-lg">
                +1k
              </div>
            </div>
            <p className="text-sm font-medium text-primary-foreground/70 italic">
              "EstabWeb transformed our local plumbing business online presence in less than a day."
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 pt-24 lg:pt-12 relative bg-background">
        <div className="absolute top-8 right-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/Logo.svg" 
              alt="EstabWeb Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold tracking-tight text-foreground">EstabWeb</span>
          </Link>
        </div>

        <div className="w-full max-w-[400px] space-y-10">
          <div className="space-y-3 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {mode === 'login' ? 'Welcome back' : 'Start for free'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'login' 
                ? 'Enter your details to access your dashboard.' 
                : 'Create your account and launch your site today.'}
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80 ml-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="w-full px-4 py-3.5 bg-muted/40 border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80 ml-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full px-4 py-3.5 bg-muted/40 border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:opacity-95 hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 group"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? (
                      <>
                        <LogIn className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        Sign In to Portal
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Get Started Now
                      </>
                    )}
                  </>
                )}
              </button>

              {mode === 'login' && (
                <p className="text-center -mt-1">
                  <Link href="#" className="text-sm text-primary font-semibold hover:underline">
                    Forgot password?
                  </Link>
                </p>
              )}
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground font-medium">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-2xl hover:bg-muted/50 transition-all text-sm font-semibold">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
                  </svg>
                  Google
               </button>
               <button className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-2xl hover:bg-muted/50 transition-all text-sm font-semibold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  GitHub
               </button>
            </div>
          </div>

          <div className="pt-6 border-t border-border text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <span className="text-primary font-bold ml-1.5 inline-flex items-center gap-1 group-hover:underline">
                {mode === 'login' ? 'Sign up for free' : 'Log in here'}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>

        <div className="mt-auto pt-10 text-[11px] text-muted-foreground/60 text-center max-w-[300px]">
          By continuing, you agree to our <Link href="#" className="underline hover:text-primary transition-colors">Terms</Link> and <Link href="#" className="underline hover:text-primary transition-colors">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <LoginContent />
    </React.Suspense>
  )
}
