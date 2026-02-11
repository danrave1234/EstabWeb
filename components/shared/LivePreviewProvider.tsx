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
    }

    window.addEventListener('message', handleMessage)
    
    // Tell the parent we are ready for data
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'LIVE_PREVIEW_READY' }, '*')
    }

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <LivePreviewContext.Provider value={data}>
      {children}
    </LivePreviewContext.Provider>
  )
}
