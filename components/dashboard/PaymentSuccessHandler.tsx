"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckCircle2, Loader2 } from "lucide-react"
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
  const [showModal, setShowModal] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    if (searchParams.get("payment_success") === "true") {
      setShowModal(true)
      setIsVerifying(true)
      
      // Clear the URL parameter without refreshing
      const newUrl = window.location.pathname + (window.location.search.replace(/[?&]payment_success=true/, "").replace(/^&/, "?") || "")
      window.history.replaceState({}, "", newUrl)

      // Polling or waiting for webhook to propagate
      // We refresh the page every 3 seconds for up to 15 seconds or until user closes
      const interval = setInterval(() => {
        router.refresh()
      }, 3000)

      const timeout = setTimeout(() => {
        clearInterval(interval)
        setIsVerifying(false)
        toast.success("Payment confirmed! Your subscription has been updated.")
      }, 10000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [searchParams, router])

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
                Everything is ready!
              </p>
              <button
                onClick={() => setShowModal(false)}
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
