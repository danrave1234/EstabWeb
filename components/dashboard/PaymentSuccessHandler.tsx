"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckCircle2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

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
  const [showModal, setShowModal] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [tookTooLong, setTookTooLong] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    if (paymentSuccess) {
      setShowModal(true)
      setIsVerifying(true)
      setTookTooLong(false)
      doneRef.current = false
      
      // Clear the URL parameter without refreshing
      const newUrl = window.location.pathname + (window.location.search.replace(/[?&]payment_success=true/, "").replace(/^&/, "?") || "")
      window.history.replaceState({}, "", newUrl)

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

      // Poll for DB update (webhook propagation). Once active, refresh once and stop.
      const interval = window.setInterval(async () => {
        if (doneRef.current) return
        const paid = await checkOnce()
        if (!paid) return
        doneRef.current = true
        setIsVerifying(false)
        toast.success("Payment confirmed! Your subscription is now Pro.")
        router.refresh()
      }, 2000)

      // Safety timeout: stop polling but keep UX informative.
      const timeout = window.setTimeout(() => {
        if (doneRef.current) return
        window.clearInterval(interval)
        setIsVerifying(false)
        setTookTooLong(true)
      }, 60000)

      return () => {
        window.clearInterval(interval)
        window.clearTimeout(timeout)
      }
    }
  }, [paymentSuccess, projectId, router])

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            Thank You for Upgrading!
          </DialogTitle>
          <DialogDescription className="pt-4 text-base">
            Your payment was successful. We are currently activating your premium features.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          {isVerifying ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground animate-pulse">
                Updating your dashboard...
              </p>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-emerald-600 mb-4">
                {tookTooLong ? "Still processing…" : "Everything is ready!"}
              </p>
              {tookTooLong && (
                <p className="text-xs text-muted-foreground mb-4">
                  Activation can take up to a minute. If your plan still looks Free, click below or refresh once.
                </p>
              )}
              <button
                onClick={() => {
                  setShowModal(false)
                  router.refresh()
                }}
                className="px-8 py-2.5 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
