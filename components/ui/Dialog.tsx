"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[200] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  // Radix closes the dialog on "outside" interactions (pointer/focus).
  // We want: close on outside *click*, but NOT when the user starts a drag inside
  // the dialog content and releases outside.
  const pointerDownInsideRef = React.useRef(false)

  React.useEffect(() => {
    // If the pointer starts inside the dialog and ends outside, we may never
    // receive `onPointerUpCapture` on the dialog content. Clear the flag via
    // global listeners so future outside clicks can close normally.
    const clear = () => {
      pointerDownInsideRef.current = false
    }
    window.addEventListener("pointerup", clear)
    window.addEventListener("pointercancel", clear)
    window.addEventListener("blur", clear)
    return () => {
      window.removeEventListener("pointerup", clear)
      window.removeEventListener("pointercancel", clear)
      window.removeEventListener("blur", clear)
    }
  }, [])

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-[210] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl",
          className
        )}
        onPointerDownCapture={(e) => {
          pointerDownInsideRef.current = true
          props.onPointerDownCapture?.(e)
        }}
        onPointerUpCapture={(e) => {
          pointerDownInsideRef.current = false
          props.onPointerUpCapture?.(e)
        }}
        onPointerCancelCapture={(e) => {
          pointerDownInsideRef.current = false
          props.onPointerCancelCapture?.(e)
        }}
        onInteractOutside={(e) => {
          // If this "outside" interaction is happening after a pointer-down inside the dialog,
          // treat it as a drag-outside and keep the dialog open.
          if (pointerDownInsideRef.current) {
            e.preventDefault()
            pointerDownInsideRef.current = false
            return
          }
          props.onInteractOutside?.(e)
        }}
        onPointerDownOutside={(e) => {
          if (pointerDownInsideRef.current) {
            e.preventDefault()
            pointerDownInsideRef.current = false
            return
          }
          props.onPointerDownOutside?.(e)
        }}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}
