"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import DynamicIcon from "@/components/shared/DynamicIcon"
import { AWARD_ICON_NAMES } from "@/config/dashboard-config"

interface AwardIconPickerProps {
  value: string
  onChange: (val: string) => void
  compact?: boolean
}

export default function AwardIconPicker({ value, onChange, compact }: AwardIconPickerProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])

  const displayName = value || "Award"

  if (compact) {
    return (
      <div ref={ref} className="relative inline-block">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-primary hover:border-primary/30 focus:ring-2 focus:ring-primary/20 outline-none shrink-0"
          title={displayName}
        >
          <DynamicIcon name={displayName} className="w-5 h-5" />
        </button>
        {open && (
          <div className="absolute z-[100] mt-2 left-1/2 -translate-x-1/2 min-w-[220px] max-w-[280px] max-h-72 overflow-y-auto overflow-x-hidden scrollbar-hide bg-background border border-border rounded-xl shadow-xl p-3 grid grid-cols-5 gap-2">
            {AWARD_ICON_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onChange(name)
                  setOpen(false)
                }}
                className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border text-[9px] font-medium transition-colors min-w-0 ${
                  value === name
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border hover:bg-muted/50 hover:border-primary/30"
                }`}
              >
                <DynamicIcon name={name} className="w-5 h-5 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 flex items-center gap-3 text-left"
      >
        <div className="w-8 h-8 rounded-full bg-muted/50 border border-border flex items-center justify-center shrink-0 text-primary">
          <DynamicIcon name={displayName} className="w-4 h-4" />
        </div>
        <span className="flex-1 truncate">{displayName}</span>
        <ChevronRight
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute z-[100] mt-2 left-0 right-0 min-w-[240px] max-h-72 overflow-y-auto overflow-x-hidden scrollbar-hide bg-background border border-border rounded-xl shadow-xl p-3 grid grid-cols-5 sm:grid-cols-6 gap-2">
          {AWARD_ICON_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                onChange(name)
                setOpen(false)
              }}
              className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border text-[10px] font-medium transition-colors min-w-0 hover:bg-muted/50 ${
                value === name
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border hover:border-primary/30"
              }`}
              title={name}
            >
              <div className="w-8 h-8 rounded-full bg-muted/30 border border-border flex items-center justify-center text-primary">
                <DynamicIcon name={name} className="w-4 h-4" />
              </div>
              <span className="truncate w-full text-center">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
