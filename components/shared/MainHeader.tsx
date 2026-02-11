"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  LayoutDashboard, 
  ChevronDown,
  Globe,
  Layout,
  Settings
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { User as SupabaseUser } from "@supabase/supabase-js"

interface MainHeaderProps {
  initialUser?: SupabaseUser | null
  variant?: "admin" | "client"
  userEmail?: string // For compatibility when initialUser isn't passed directly
}

export default function MainHeader({ initialUser, variant, userEmail }: MainHeaderProps) {
  const [user, setUser] = React.useState<SupabaseUser | null>(initialUser || null)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  // Use fixed appearance for dashboard variants or when scrolled
  const isDashboard = variant === "admin" || variant === "client"
  const headerAppearance = scrolled || isDashboard

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    
    // Only fetch user if we don't have one initially
    if (!initialUser) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) setUser(user)
      })
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const displayEmail = user?.email || userEmail
  const userInitials = displayEmail?.split('@')[0].slice(0, 2).toUpperCase() || 'U'

  const navLinks = isDashboard 
    ? (variant === "admin" 
        ? [
            { name: "Requests", href: "/admin/dashboard", icon: LayoutDashboard },
            { name: "Template", href: "/admin/template", icon: Layout },
          ] 
        : [])
    : [
        { name: "Features", href: "/#features" },
        { name: "How it Works", href: "/#how-it-works" },
        { name: "Pricing", href: "/#pricing" },
      ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-500 ease-in-out border-b ${
        headerAppearance 
          ? "bg-background/80 backdrop-blur-xl border-border shadow-sm" 
          : "bg-background/0 border-transparent shadow-none"
      }`}
    >
      <div className="container mx-auto px-4 h-full flex items-center">
        {/* Logo & Badge Area */}
        <div className="flex-1 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/30 group-hover:-rotate-3 transition-all duration-300">
                E
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 hidden lg:inline">
              EstabWeb
            </span>
          </Link>

          {isDashboard && (
            <div className="hidden sm:flex items-center px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {variant}
              </span>
            </div>
          )}
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-full border border-border/50 backdrop-blur-sm mx-4">
          {navLinks.map((link) => {
            const Icon = (link as any).icon
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 shrink-0 ${
                  pathname === link.href 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Action Buttons Area */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-1 pl-3 pr-1.5 rounded-full border border-border bg-background hover:bg-muted/50 transition-all duration-200 group"
                >
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Account
                  </span>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs shadow-md">
                    {userInitials}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-3 w-64 bg-background border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-5 py-4 border-b border-border bg-muted/20">
                        <p className="text-sm font-semibold text-foreground truncate">{displayEmail}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Active Session</p>
                        </div>
                      </div>
                      <div className="p-2">
                        {variant === "admin" ? (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            Admin Dashboard
                          </Link>
                        ) : (
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            My Dashboard
                          </Link>
                        )}
                        {variant === "client" && (
                          <Link
                            href="/dashboard/requests"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4 text-primary" />
                            My Requests
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted rounded-full transition-all"
                >
                  Log In
                </Link>
                <Link 
                  href="/login?mode=signup" 
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 text-foreground transition-colors hover:bg-muted"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border animate-in slide-in-from-top duration-300 overflow-hidden shadow-xl">
          <nav className="flex flex-col p-4 gap-1 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {user ? (
              <>
                {variant === "admin" ? (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    My Dashboard
                  </Link>
                )}
                {variant === "client" && (
                  <Link
                    href="/dashboard/requests"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground"
                  >
                    <Settings className="w-4 h-4" />
                    My Requests
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-center text-sm font-semibold border border-border rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  href="/login?mode=signup"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-center text-sm font-semibold bg-primary text-primary-foreground rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
