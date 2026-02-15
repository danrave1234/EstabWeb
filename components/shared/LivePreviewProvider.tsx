"use client"

import * as React from 'react'

const LivePreviewContext = React.createContext<any>(null)

export function useLivePreview() {
  return React.useContext(LivePreviewContext)
}

interface LivePreviewProviderProps {
  initialData: any
  children: React.ReactNode
}

function deepMerge(target: any, source: any): any {
  if (!source) return target
  if (typeof source !== 'object' || Array.isArray(source)) return source
  
  const out = { ...target }
  for (const key of Object.keys(source)) {
    const a = out[key]
    const b = source[key]
    
    if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
      out[key] = deepMerge(a, b)
    } else {
      out[key] = b
    }
  }
  return out
}

export default function LivePreviewProvider({ initialData, children }: LivePreviewProviderProps) {
  const [data, setData] = React.useState(initialData)
  const lastActiveRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      let message = event.data
      
      // Handle stringified messages if necessary
      if (typeof message === 'string') {
        try {
          message = JSON.parse(message)
        } catch {
          return
        }
      }

      if (message?.type === 'LIVE_PREVIEW_PATCH') {
        const patch = message.patch
        setData((current: any) => deepMerge(current, patch))
      }
      if (message?.type === 'LIVE_PREVIEW_FULL') {
        setData(message.data)
      }
      if (message?.type === 'SCROLL_TO_SECTION') {
        const sectionId = message.sectionId as string | undefined
        const sectionIndex = message.sectionIndex as number | undefined
        if (!sectionId || typeof document === 'undefined') return
        const selector = typeof sectionIndex === 'number'
          ? `[data-section-id="${sectionId}"][data-section-index="${sectionIndex}"]`
          : `[data-section-id="${sectionId}"]`
        const target = document.querySelector(selector)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Tell the parent we are ready for data
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'LIVE_PREVIEW_READY' }, '*')
    }

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  React.useEffect(() => {
    if (!data || typeof window === 'undefined' || typeof document === 'undefined') return

    const sections = Array.from(document.querySelectorAll('[data-section-id]'))
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio - a.intersectionRatio))
        const top = visible[0]
        const nextId = (top?.target as HTMLElement | undefined)?.dataset?.sectionId || null
        if (!nextId || nextId === lastActiveRef.current) return
        lastActiveRef.current = nextId
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'PREVIEW_ACTIVE_SECTION', sectionId: nextId }, '*')
        }
      },
      { root: null, rootMargin: '-20% 0px -60% 0px', threshold: [0.1, 0.25, 0.5, 0.75] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [data])

  // Apply Global Site Settings (theme, colors, typography, dark mode) to the document
  // so they take effect in the iframe when the user changes them in the dashboard.
  React.useEffect(() => {
    if (!data || typeof document === 'undefined') return
    const root = document.documentElement
    const colorTheme = data.colorTheme || 'partner'
    const mode = data.darkMode ? 'dark' : 'light'
    const typography = data.typographyStyle || 'elegant'
    root.setAttribute('data-theme', colorTheme)
    root.setAttribute('data-mode', mode)
    root.setAttribute('data-typography', typography)
  }, [data])

  return (
    <LivePreviewContext.Provider value={data}>
      {children}
    </LivePreviewContext.Provider>
  )
}
