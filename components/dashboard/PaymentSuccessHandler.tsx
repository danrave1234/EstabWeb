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
    if (!paymentSuccess) return

    doneRef.current = false

    // Clear the URL parameter without refreshing
    const newUrl = window.location.pathname + (window.location.search.replace(/[?&]payment_success=true/, "").replace(/^&/, "?") || "")
    window.history.replaceState({}, "", newUrl)

    toast.info("Payment received! Activating your subscription…")

    const supabase = createClient()

    const isPaidStatus = (status: string | null | undefined) => {
      const s = (status || "free").toLowerCase()
      return s === "active" || s === "admin_granted"
    }

    const checkOnce = async () => {
      if (!projectId) return false
      const { data, error } = await supabase
        .from("projects")
        .select("subscription_status")
        .eq("id", projectId)
        .limit(1)
        .maybeSingle()
      if (error) return false
      return isPaidStatus((data as any)?.subscription_status)
    }

    const interval = window.setInterval(async () => {
      if (doneRef.current) return
      const paid = await checkOnce()
      if (!paid) return
      doneRef.current = true
      window.clearInterval(interval)
      window.clearTimeout(timeout)
      toast.success("Subscription activated! Welcome to Pro.")
      router.refresh()
    }, 2000)

    // After 30s, give up polling and just refresh
    const timeout = window.setTimeout(() => {
      if (doneRef.current) return
      window.clearInterval(interval)
      toast.info("Still processing — please refresh in a moment.")
      router.refresh()
    }, 30000)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [paymentSuccess, projectId, router])

  return null
}
