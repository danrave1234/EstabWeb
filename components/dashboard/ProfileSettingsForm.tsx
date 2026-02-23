"use client"

import React, { useState, useTransition } from "react"
import { updateProfile, updatePassword } from "@/app/actions/profile"
import { User, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface ProfileData {
  id: string
  email: string | null
  role: string | null
  full_name: string | null
  phone: string | null
  bio: string | null
  created_at: string | null
}

interface Props {
  profile: ProfileData
}

function Alert({ type, message }: { type: "success" | "error"; message: string }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${
      type === "success"
        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
        : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
    }`}>
      {type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      {message}
    </div>
  )
}

export default function ProfileSettingsForm({ profile }: Props) {
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "settings">("profile")

  // Profile form state
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [profilePending, startProfileTransition] = useTransition()

  // Password form state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [passwordPending, startPasswordTransition] = useTransition()

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProfileMsg(null)
    const formData = new FormData(e.currentTarget)
    startProfileTransition(async () => {
      const result = await updateProfile(formData)
      if (result?.error) {
        setProfileMsg({ type: "error", text: result.error })
        toast.error(result.error)
      } else if (result?.success) {
        setProfileMsg({ type: "success", text: result.success })
        toast.success(result.success)
      }
    })
  }

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordMsg(null)
    const formData = new FormData(e.currentTarget)
    startPasswordTransition(async () => {
      const result = await updatePassword(formData)
      if (result?.error) {
        setPasswordMsg({ type: "error", text: result.error })
        toast.error(result.error)
      } else if (result?.success) {
        setPasswordMsg({ type: "success", text: result.success })
        toast.success(result.success)
        ;(e.target as HTMLFormElement).reset()
      }
    })
  }

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "password" as const, label: "Password", icon: Lock },
    { id: "settings" as const, label: "Settings", icon: null },
  ]

  const userInitials = profile.email?.split("@")[0].slice(0, 2).toUpperCase() || "U"
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—"

  return (
    <div className="max-w-2xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg shrink-0">
          {userInitials}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-foreground truncate">
            {profile.full_name || profile.email?.split("@")[0] || "User"}
          </h2>
          <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
              {profile.role || "client"}
            </span>
            <span className="text-xs text-muted-foreground">Member since {memberSince}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-base font-semibold text-foreground mb-1">Personal Information</h3>
          <p className="text-sm text-muted-foreground mb-6">Update your name, phone, and bio.</p>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={profile.email || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-muted-foreground text-sm cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here.</p>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-1.5">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                defaultValue={profile.full_name || ""}
                placeholder="Your full name"
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={profile.phone || ""}
                placeholder="+63 912 345 6789"
                maxLength={30}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1.5">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio || ""}
                placeholder="Tell us a little about yourself..."
                maxLength={500}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              />
            </div>

            {profileMsg && <Alert type={profileMsg.type} message={profileMsg.text} />}

            <button
              type="submit"
              disabled={profilePending}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {profilePending ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-base font-semibold text-foreground mb-1">Change Password</h3>
          <p className="text-sm text-muted-foreground mb-6">Choose a strong password with at least 8 characters.</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {passwordMsg && <Alert type={passwordMsg.type} message={passwordMsg.text} />}

            <button
              type="submit"
              disabled={passwordPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              {passwordPending ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1">Notifications</h3>
            <p className="text-sm text-muted-foreground mb-5">Manage how you receive updates.</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Receive updates about your website and requests</p>
                </div>
                <button
                  onClick={() => setEmailNotifications((v) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    emailNotifications ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      emailNotifications ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Marketing Emails</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Receive tips, product updates, and promotions</p>
                </div>
                <button
                  onClick={() => setMarketingEmails((v) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    marketingEmails ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      marketingEmails ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground mb-1">Account</h3>
            <p className="text-sm text-muted-foreground mb-5">Manage your account details.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Account ID</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{profile.id}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Account Role</p>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">{profile.role || "client"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
