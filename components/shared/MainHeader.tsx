"use client";

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
  Globe,
  Layout,
  Settings,
  KeyRound,
  CreditCard,
  ClipboardList
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { useAuth } from "@/components/providers/AuthProvider"

interface MainHeaderProps {
  initialUser?: SupabaseUser | null
  variant?: "admin" | "client"
  userEmail?: string // For compatibility when initialUser isn't passed directly
  role?: string
}

export default function MainHeader({ initialUser, variant, userEmail, role }: MainHeaderProps) {
  const { user, loading } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()
  const desktopNavId = "main-header-desktop-nav"
  const mobileNavId = "main-header-mobile-nav"

  // Use fixed appearance for dashboard variants or when scrolled
  const isDashboard = variant === "admin" || variant === "client"
  const headerAppearance = scrolled || isDashboard

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSignOut = () => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/auth/signout'
    document.body.appendChild(form)
    form.submit()
  }

  const displayEmail = user?.email || userEmail
  const userInitials = displayEmail?.split('@')[0].slice(0, 2).toUpperCase() || 'U'

  const isSubAdmin = role === 'sub_admin'
  const adminRestrictedLinks = ['Transactions', 'Codes', 'Settings', 'Audit Logs']

  const navLinks = React.useMemo(() => isDashboard
    ? (variant === "admin"
      ? [
        { name: "Requests", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Clients", href: "/admin/clients", icon: Globe },
        { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
        { name: "Template", href: "/admin/template", icon: Layout },
        { name: "Codes", href: "/admin/codes", icon: KeyRound },
        { name: "Settings", href: "/admin/settings", icon: Settings },
        { name: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
      ].filter(link => !isSubAdmin || !adminRestrictedLinks.includes(link.name))
      : [])
    : [
      { name: "Home", href: "/" },
      { name: "Pricing", href: "/pricing" },
      { name: "Contact", href: "/contact" },
    ], [isDashboard, variant, isSubAdmin])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-500 ease-in-out border-b ${headerAppearance
          ? "bg-background/80 backdrop-blur-xl border-border shadow-sm"
          : "bg-background/0 border-transparent shadow-none"
        }`}
    >
      <div className="container mx-auto px-4 h-full flex items-center">
        {/* Logo & Badge Area */}
        <div className="flex-1 flex items-center gap-4">
          <Link href={variant === "admin" ? "/admin/dashboard" : variant === "client" ? "/dashboard" : "/"} className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <Image
                src="/Logo.svg"
                alt="EstabWeb Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain group-hover:-rotate-3 transition-all duration-300"
              />
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
        <nav
          id={desktopNavId}
          aria-label="Primary"
          className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-full border border-border/50 backdrop-blur-sm mx-4"
        >
          {navLinks.map((link) => {
            const Icon = (link as any).icon
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 shrink-0 ${pathname === link.href
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
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 lg:gap-4 shrink-0">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-20 h-9 bg-muted animate-pulse rounded-full" />
                <div className="w-28 h-9 bg-muted animate-pulse rounded-full" />
              </div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setMobileOpen(false) }}
                  className="flex items-center gap-3 p-1 pl-3 pr-1.5 rounded-full border border-border bg-background hover:bg-muted/50 transition-all duration-200 group cursor-pointer"
                >
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors hidden sm:inline">
                    Account
                  </span>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs shadow-md">
                    {userInitials}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40 hidden md:block" onClick={() => setUserMenuOpen(false)} />
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
                          <>
                            <Link
                              href="/admin/dashboard"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="w-4 h-4 text-primary" />
                              Admin Dashboard
                            </Link>
                            <Link
                              href="/admin/clients"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Globe className="w-4 h-4 text-primary" />
                              Clients
                            </Link>
                          </>
                        ) : (
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            My Dashboard
                          </Link>
                        )}
                        {variant === "client" && (
                          <>
                            <Link
                              href="/dashboard/profile"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <User className="w-4 h-4 text-primary" />
                              Profile & Settings
                            </Link>
                            <Link
                              href="/admin/approvals"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Settings className="w-4 h-4 text-primary" />
                              My Requests
                            </Link>
                          </>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all text-left cursor-pointer"
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
              <div className="flex items-center gap-1 lg:gap-2">
                <Link
                  href="/login"
                  className="px-3 lg:px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted rounded-full transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="px-4 lg:px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-xs lg:text-sm font-bold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0 whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => { setMobileOpen(!mobileOpen); setUserMenuOpen(false) }}
            aria-expanded={mobileOpen}
            aria-controls={mobileNavId}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 text-foreground transition-colors hover:bg-muted"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border animate-in slide-in-from-top duration-300 overflow-hidden shadow-xl z-[60]">
          <nav id={mobileNavId} aria-label="Mobile Primary" className="flex flex-col p-4 gap-1 max-h-[80vh] overflow-y-auto">
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
            {loading ? (
              <div className="flex flex-col xs:flex-row gap-3 mt-2">
                <div className="h-11 bg-muted animate-pulse rounded-xl" />
                <div className="h-11 bg-muted animate-pulse rounded-xl" />
              </div>
            ) : user ? (
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
                  <>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground"
                    >
                      <User className="w-4 h-4" />
                      Profile & Settings
                    </Link>
                    <Link
                      href="/admin/approvals"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground"
                    >
                      <Settings className="w-4 h-4" />
                      My Requests
                    </Link>
                  </>
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
              <div className="flex flex-col xs:flex-row gap-3 mt-2">
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
