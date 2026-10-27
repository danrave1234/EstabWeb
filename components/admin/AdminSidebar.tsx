"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Globe,
  CreditCard,
  Layout,
  KeyRound,
  Settings,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { User } from "@supabase/supabase-js"

interface AdminSidebarProps {
  user?: User | null
  role?: string
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export default function AdminSidebar({ user, role, collapsed = false, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const isSubAdmin = role === 'sub_admin'
  const adminRestrictedLinks = ['Transactions', 'Codes', 'Settings', 'Audit Logs']

  const navLinks = [
    { name: "Requests", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Clients", href: "/admin/clients", icon: Globe },
    { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
    { name: "Template", href: "/admin/template", icon: Layout },
    { name: "Codes", href: "/admin/codes", icon: KeyRound },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
  ].filter(link => !isSubAdmin || !adminRestrictedLinks.includes(link.name))

  const handleSignOut = () => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/auth/signout'
    document.body.appendChild(form)
    form.submit()
  }

  const toggleSidebar = () => onToggleCollapse?.()
  const toggleMobile = () => setMobileOpen(!mobileOpen)

  const sidebarClasses = cn(
    "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 ease-in-out lg:translate-x-0",
    collapsed ? "w-20" : "w-64",
    mobileOpen ? "translate-x-0" : "-translate-x-full"
  )

  return (
    <>
      {/* Mobile Trigger */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={toggleMobile}
          className="p-2 rounded-lg bg-primary text-primary-foreground shadow-lg focus:outline-none"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={toggleMobile}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center border-b border-border px-4 py-4">
            <Link href="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
              <div className="shrink-0">
                <Image
                  src="/Logo.png"
                  alt="EstabWeb Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              </div>
              {!collapsed && (
                <span className="text-lg font-bold tracking-tight text-foreground transition-all duration-300">
                  EstabWeb
                </span>
              )}
            </Link>
            
            {/* Collapse toggle (Desktop) */}
            <button
              onClick={toggleSidebar}
              className="ml-auto hidden h-6 w-6 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted lg:flex"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? link.name : undefined}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", !collapsed && "mr-3")} />
                  {!collapsed && <span>{link.name}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className={cn("flex items-center gap-3 overflow-hidden", collapsed ? "justify-center" : "")}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted border border-border">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              {!collapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium text-foreground">
                    {user?.email?.split('@')[0] || 'Admin'}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {role?.replace('_', ' ') || 'Admin'}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleSignOut}
              className={cn(
                "mt-4 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
                collapsed ? "justify-center px-2" : ""
              )}
              title={collapsed ? "Logout" : undefined}
            >
              <LogOut className={cn("h-5 w-5 shrink-0", !collapsed && "mr-3")} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
