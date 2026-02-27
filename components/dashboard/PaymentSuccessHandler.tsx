"use client"

import { useEffect, useMemo, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function PaymentSuccessHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchString = useMemo(() => searchParams?.toString() ?? "", [searchParams])

  const paymentSuccess = useMemo(() => {
    if (!searchString) return false
    return new URLSearchParams(searchString).get("payment_success") === "true"
  }, [searchString])

  const projectId = useMemo(() => {
    if (!searchString) return null
    return new URLSearchParams(searchString).get("projectId")
  }, [searchString])

  const doneRef = useRef(false)

  useEffect(() => {
    if (!paymentSuccess || !projectId || doneRef.current) return

    // Mark as started to prevent double intervals/toasts if effect re-runs
    doneRef.current = true

    // Clear the URL parameter without refreshing the page
    const url = new URL(window.location.href)
    url.searchParams.delete("payment_success")
    window.history.replaceState({}, "", url.pathname + url.search)

    toast.info("Payment received! Activating your subscription…")

    const supabase = createClient()

    const isPaidStatus = (status: string | null | undefined) => {
      const s = (status || "free").toLowerCase()
      return s === "active" || s === "admin_granted"
    }

    const onActivated = () => {
      toast.success("Subscription activated! Welcome to Pro.")
      router.refresh()
    }

    // 1. Check immediately (maybe the webhook already finished)
    const checkOnce = async () => {
      const { data } = await supabase
        .from("projects")
        .select("subscription_status")
        .eq("id", projectId)
        .maybeSingle()
      if (isPaidStatus((data as any)?.subscription_status)) {
        onActivated()
        return true
      }
      return false
    }

    // 2. Listen for Realtime changes (Instant gratification)
    const channel = supabase
      .channel(`payment-success-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "projects",
          filter: `id=eq.${projectId}`,
        },
        (payload) => {
          if (isPaidStatus(payload.new.subscription_status)) {
            channel.unsubscribe()
            window.clearTimeout(timeout)
            onActivated()
          }
        }
      )
      .subscribe()

    // 3. Fallback: refresh after 30s if nothing happened
    const timeout = window.setTimeout(() => {
      channel.unsubscribe()
      toast.info("Still processing — please refresh in a moment.")
      router.refresh()
    }, 30000)

    // Run the initial check
    checkOnce()

    return () => {
      supabase.removeChannel(channel)
      window.clearTimeout(timeout)
    }
  }, [paymentSuccess, projectId, router])

  return null
}

