"use client"

import * as React from "react"
import { Trash2, GripVertical, ChevronDown, ChevronUp, Image as ImageIcon, Zap, Star, Layout, Users, Award, Shield, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldRenderer } from "./FieldRenderer"
import { fieldLabel } from "@/config/dashboard-config"

interface ItemCardProps {
  index: number
  item: any
  onChange: (val: any) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
  isExpanded?: boolean
  onToggleExpand?: () => void
  label?: string
  fieldLimits: (key: string) => { suggested: number; max: number }
}

export function ItemCard({
  index,
  item,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  isExpanded = true,
  onToggleExpand,
  label,
  fieldLimits
}: ItemCardProps) {
  const isObject = typeof item === 'object' && item !== null && !Array.isArray(item)
  
  // Find a suitable title for the card
  const cardTitle = React.useMemo(() => {
    if (!isObject) return `Item #${index + 1}`
    const titleCandidates = ['name', 'title', 'label', 'question', 'step', 'id']
    for (const key of titleCandidates) {
      if (item[key] && typeof item[key] === 'string') return item[key]
    }
    return `Item #${index + 1}`
  }, [item, index, isObject])

  // Find a suitable icon for the card
  const cardIcon = React.useMemo(() => {
    if (!isObject) return <Layout className="w-3.5 h-3.5 text-primary" />
    if (item.icon && typeof item.icon === 'string') {
       // Just a placeholder, ideally we'd map the icon name to a Lucide icon
       return <Zap className="w-3.5 h-3.5 text-primary" />
    }
    if (item.imageUrl || item.image || item.avatar) {
      return <ImageIcon className="w-3.5 h-3.5 text-primary" />
    }
    return <Layout className="w-3.5 h-3.5 text-primary" />
  }, [item, isObject])

  if (!isObject) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted/10 border border-border/60 rounded-xl group hover:border-primary/20 transition-all">
        <div className="flex flex-col gap-1">
          <button onClick={onMoveUp} disabled={isFirst} className="p-0.5 hover:bg-background rounded text-muted-foreground disabled:opacity-30 transition-colors">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={onMoveDown} disabled={isLast} className="p-0.5 hover:bg-background rounded text-muted-foreground disabled:opacity-30 transition-colors">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
        <input
          value={item as string}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 h-9 transition-all"
        />
        <button onClick={onDelete} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all opacity-0 group-hover:opacity-100">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <Card className={`overflow-hidden border transition-all duration-200 ${isExpanded ? 'border-primary/20 bg-primary/5 ring-1 ring-primary/10' : 'border-border/60 bg-muted/10 hover:border-primary/20'}`}>
      <CardHeader className="p-0">
        <div className="flex items-center justify-between p-3 cursor-pointer" onClick={onToggleExpand}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex flex-col gap-1 pr-2 border-r border-border/60">
              <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={isFirst} className="p-0.5 hover:bg-background rounded text-muted-foreground disabled:opacity-30 transition-colors">
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={isLast} className="p-0.5 hover:bg-background rounded text-muted-foreground disabled:opacity-30 transition-colors">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {cardIcon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-foreground truncate max-w-[150px]">{cardTitle}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Item #{index + 1}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className={`p-1.5 rounded-lg bg-muted/40 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
               <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(item).map(([key, val]) => {
              if (key === 'id') return null
              const isArray = Array.isArray(val)
              const isObject = typeof val === 'object' && val !== null && !isArray
              const limits = fieldLimits(key)
              
              const isFullWidth = isArray || isObject || (typeof val === 'string' && val.length > 50) || key.toLowerCase().includes('image') || key.toLowerCase().includes('url')
              
              return (
                <FieldRenderer
                  key={key}
                  label={fieldLabel(key)}
                  fieldKey={key}
                  value={val}
                  onChange={(newVal) => {
                    onChange({ ...item, [key]: newVal })
                  }}
                  max={limits.max}
                  suggested={limits.suggested}
                  className={isFullWidth ? "col-span-1 sm:col-span-2" : ""}
                />
              )
            })}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
