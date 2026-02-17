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
  const intersectionMapRef = React.useRef<Map<Element, { id: string; ratio: number; top: number }>>(new Map())

  const scrollToElement = React.useCallback((el: Element) => {
    try {
      const element = el as HTMLElement
      const rect = element.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight || 0
      const isSmall = vh > 0 && rect.height > 0 && rect.height < vh * 0.6

      // For short sections, center them in the viewport.
      // For tall sections, keep the top aligned (respecting scroll-margin via CSS).
      if (isSmall) {
        const targetTop = window.scrollY + rect.top - (vh / 2 - rect.height / 2)
        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } catch {
      try {
        ;(el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' })
      } catch {}
    }
  }, [])

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

        // The preview can be mid-rerender after reordering/layout changes.
        // If we try to scroll immediately, the indexed node may not exist yet.
        // Retry briefly, then fall back to best-effort selectors.
        const tryScroll = () => {
          const indexedSelector = typeof sectionIndex === 'number'
            ? `[data-section-id="${sectionId}"][data-section-index="${sectionIndex}"]`
            : null

          // 1) Exact match (id + index)
          const exact = indexedSelector ? document.querySelector(indexedSelector) : null
          if (exact) {
            scrollToElement(exact)
            return true
          }

          // 2) Any match by id
          const anyById = document.querySelector(`[data-section-id="${sectionId}"]`)
          if (anyById) {
            scrollToElement(anyById)
            return true
          }

          // 3) Last resort: attempt to scroll to the element with matching index regardless of id
          if (typeof sectionIndex === 'number') {
            const anyByIndex = document.querySelector(`[data-section-index="${sectionIndex}"]`)
            if (anyByIndex) {
              scrollToElement(anyByIndex)
              return true
            }
          }

          return false
        }

        const start = Date.now()
        const maxMs = 900
        const tick = () => {
          if (tryScroll()) return
          if (Date.now() - start > maxMs) return
          window.setTimeout(tick, 60)
        }

        // Try immediately, then retry
        tick()
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

    intersectionMapRef.current.clear()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement | null
          const id = target?.dataset?.sectionId
          if (!id) return
          if (entry.isIntersecting) {
            intersectionMapRef.current.set(entry.target, {
              id,
              ratio: entry.intersectionRatio,
              top: entry.boundingClientRect.top,
            })
          } else {
            intersectionMapRef.current.delete(entry.target)
          }
        })

        const visible = Array.from(intersectionMapRef.current.values())
        if (visible.length === 0) return
        visible.sort((a, b) => {
          if (b.ratio !== a.ratio) return b.ratio - a.ratio
          return Math.abs(a.top) - Math.abs(b.top)
        })
        const nextId = visible[0]?.id || null
        if (!nextId || nextId === lastActiveRef.current) return
        lastActiveRef.current = nextId
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'PREVIEW_ACTIVE_SECTION', sectionId: nextId }, '*')
        }
      },
      { root: null, rootMargin: '-20% 0px -20% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => {
      observer.disconnect()
      intersectionMapRef.current.clear()
    }
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
