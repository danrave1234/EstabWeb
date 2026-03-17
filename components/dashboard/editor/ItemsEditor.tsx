"use client"

import * as React from "react"
import { Plus, Expand, Shrink, Layout, Search, Filter } from "lucide-react"
import { ItemCard } from "./ItemCard"

interface ItemsEditorProps {
  items: any[]
  updateItems: (items: any[]) => void
  label: string
  fieldLimits: (key: string) => { suggested: number; max: number }
}

export function ItemsEditor({
  items,
  updateItems,
  label,
  fieldLimits
}: ItemsEditorProps) {
  const [expandedIndices, setExpandedIndices] = React.useState<number[]>(items.length > 0 ? [0] : [])
  const [searchQuery, setSearchQuery] = React.useState("")

  const toggleExpand = (index: number) => {
    setExpandedIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    )
  }

  const expandAll = () => setExpandedIndices(items.map((_, i) => i))
  const collapseAll = () => setExpandedIndices([])

  const addItem = () => {
    let newItem: any
    const firstItem = items[0]
    if (firstItem !== null && typeof firstItem === 'object' && !Array.isArray(firstItem)) {
      newItem = { ...firstItem }
      Object.keys(newItem).forEach(k => {
        if (typeof newItem[k] === 'string') newItem[k] = ''
        if (typeof newItem[k] === 'number') newItem[k] = 0
        if (Array.isArray(newItem[k])) newItem[k] = []
        if (typeof newItem[k] === 'boolean') newItem[k] = true
      })
    } else {
      newItem = typeof firstItem === 'string' ? '' : {}
    }
    const nextItems = [...items, newItem]
    updateItems(nextItems)
    setExpandedIndices([...expandedIndices, nextItems.length - 1])
  }

  const deleteItem = (index: number) => {
    const nextItems = items.filter((_, i) => i !== index)
    updateItems(nextItems)
    setExpandedIndices(expandedIndices.filter(i => i !== index).map(i => i > index ? i - 1 : i))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const nextItems = [...items]
    const temp = nextItems[index]
    nextItems[index] = nextItems[index - 1]
    nextItems[index - 1] = temp
    updateItems(nextItems)
    setExpandedIndices(expandedIndices.map(i => {
      if (i === index) return index - 1
      if (i === index - 1) return index
      return i
    }))
  }

  const moveDown = (index: number) => {
    if (index === items.length - 1) return
    const nextItems = [...items]
    const temp = nextItems[index]
    nextItems[index] = nextItems[index + 1]
    nextItems[index + 1] = temp
    updateItems(nextItems)
    setExpandedIndices(expandedIndices.map(i => {
      if (i === index) return index + 1
      if (i === index + 1) return index
      return i
    }))
  }

  const filteredItems = items.filter(item => {
    if (!searchQuery) return true
    if (typeof item === 'string') return item.toLowerCase().includes(searchQuery.toLowerCase())
    if (typeof item === 'object') {
       return Object.values(item).some(v => 
         typeof v === 'string' && v.toLowerCase().includes(searchQuery.toLowerCase())
       )
    }
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2 px-1">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{label}</span>
           <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[9px] font-black uppercase">
             {items.length} items
           </span>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {items.length > 5 && (
            <div className="relative flex-1 sm:flex-none sm:w-[180px]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-7 pr-3 py-1 text-[10px] bg-muted/20 border border-border/60 rounded-lg outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="p-1.5 hover:bg-primary/5 rounded-lg text-primary transition-all"
              title="Expand All"
            >
              <Expand className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="p-1.5 hover:bg-primary/5 rounded-lg text-primary transition-all"
              title="Collapse All"
            >
              <Shrink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredItems.map((item, idx) => (
          <ItemCard
            key={idx}
            index={idx}
            item={item}
            isExpanded={expandedIndices.includes(idx)}
            onToggleExpand={() => toggleExpand(idx)}
            onChange={(val) => {
              const nextItems = [...items]
              nextItems[idx] = val
              updateItems(nextItems)
            }}
            onDelete={() => deleteItem(idx)}
            onMoveUp={() => moveUp(idx)}
            onMoveDown={() => moveDown(idx)}
            isFirst={idx === 0}
            isLast={idx === items.length - 1}
            label={label}
            fieldLimits={fieldLimits}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="w-full py-4 border-2 border-dashed border-border/60 rounded-2xl text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group mt-2"
      >
        <div className="w-7 h-7 rounded-full bg-muted/40 group-hover:bg-primary/10 flex items-center justify-center transition-all">
           <Plus className="w-4 h-4" />
        </div>
        Add New Item
      </button>
    </div>
  )
}
