"use client"

import * as React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

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
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastRouteRef = React.useRef<string | null>(null)
  const searchString = React.useMemo(() => searchParams?.toString() ?? '', [searchParams])
  const previewParams = React.useMemo(() => new URLSearchParams(searchString), [searchString])

  const dataForRoute = React.useMemo(() => {
    if (!data) return data
    const pages = Array.isArray((data as any)?.pages) ? (data as any).pages : []
    if (pages.length === 0) return data

    const isPreview = Boolean(previewParams.get('preview')) || Boolean(previewParams.get('projectId'))
    const hasProjectId = Boolean(previewParams.get('projectId'))
    const segments = (pathname || '').split('/').filter(Boolean)
    let slug = ''
    if (isPreview && hasProjectId && segments.length >= 2) {
      slug = segments[1]
    } else if (segments.length >= 1) {
      slug = segments[0]
    }

    const cleanSlug = slug.replace(/^\/+|\/+$/g, '').toLowerCase()
    if (!cleanSlug) return data

    const match = pages.find((page: any) => {
      const rawSlug = typeof page?.slug === 'string' ? page.slug : ''
      return rawSlug.replace(/^\/+|\/+$/g, '').toLowerCase() === cleanSlug
    })

    if (!match) return data

    return {
      ...data,
      activeSections: match.activeSections ?? (data as any).activeSections,
      seo: match.seo ?? (data as any).seo,
    }
  }, [data, pathname, previewParams])

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
    if (typeof window === 'undefined') return
    const searchQuery = searchString ? `?${searchString}` : ''
    const routeKey = `${pathname}${searchQuery}`
    if (routeKey === lastRouteRef.current) return
    lastRouteRef.current = routeKey
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'PREVIEW_ROUTE_CHANGED', pathname, search: searchQuery }, '*')
    }
  }, [pathname, searchString])

  // Emit section bounding rects to parent for overlay positioning
  React.useEffect(() => {
    if (typeof window === 'undefined' || window.parent === window) return

    const emit = () => {
      const els = Array.from(document.querySelectorAll('[data-section-id]'))
      const rects = els
        .map((el) => {
          const htmlEl = el as HTMLElement
          const r = htmlEl.getBoundingClientRect()
          return {
            id: htmlEl.dataset.sectionId || '',
            index: Number(htmlEl.dataset.sectionIndex ?? 0),
            top: r.top,
            height: r.height,
          }
        })
        .filter((r) => r.id)
      window.parent.postMessage({ type: 'SECTION_RECTS', rects }, '*')
    }

    // Delay after data change to let DOM settle
    const timer = setTimeout(emit, 120)

    // Throttle scroll/resize via rAF so postMessage fires once per frame,
    // not on every individual scroll tick (removes jitter / message flood).
    let rafId: number | null = null
    const scheduleEmit = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        emit()
      })
    }
    window.addEventListener('scroll', scheduleEmit, { passive: true })
    window.addEventListener('resize', scheduleEmit, { passive: true })
    return () => {
      clearTimeout(timer)
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', scheduleEmit)
      window.removeEventListener('resize', scheduleEmit)
    }
  }, [data])

  // Emit SECTION_HOVERED and SECTION_CLICKED so parent toolbar tracks active section
  React.useEffect(() => {
    if (typeof window === 'undefined' || window.parent === window) return

    const onMouseOver = (e: MouseEvent) => {
      const section = (e.target as Element).closest('[data-section-id]') as HTMLElement | null
      if (!section) return
      const sectionId = section.dataset.sectionId
      if (sectionId) window.parent.postMessage({ type: 'SECTION_HOVERED', sectionId }, '*')
    }

    const onClick = (e: MouseEvent) => {
      const section = (e.target as Element).closest('[data-section-id]') as HTMLElement | null
      if (!section) return
      const sectionId = section.dataset.sectionId
      const idx = section.dataset.sectionIndex
      if (sectionId) {
        window.parent.postMessage(
          { type: 'SECTION_CLICKED', sectionId, index: idx ? Number(idx) : 0 },
          '*'
        )
      }
    }

    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('click', onClick)
    }
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
    <LivePreviewContext.Provider value={dataForRoute}>
      {children}
    </LivePreviewContext.Provider>
  )
}
