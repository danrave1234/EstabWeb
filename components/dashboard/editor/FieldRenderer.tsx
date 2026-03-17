"use client"

import * as React from "react"
import ImageUpload from "@/components/shared/ImageUpload"
import AwardIconPicker from "@/components/dashboard/AwardIconPicker"

interface FieldRendererProps {
  label: string
  fieldKey?: string
  value: any
  onChange: (val: any) => void
  type?: 'string' | 'number' | 'boolean' | 'image' | 'icon' | 'textarea' | 'array' | 'object'
  max?: number
  suggested?: number
  placeholder?: string
  className?: string
}

export function FieldRenderer({
  label,
  fieldKey,
  value,
  onChange,
  type = 'string',
  max,
  suggested,
  placeholder,
  className
}: FieldRendererProps) {
  const k = (fieldKey || '').toLowerCase()
  const l = label.toLowerCase()

  const isImageKey = k.includes('image') || 
                     k.includes('photo') || 
                     k.includes('logo') || 
                     k.includes('avatar') || 
                     k.includes('src') ||
                     k.includes('headshot') ||
                     k.includes('before') ||
                     k.includes('after')

  const isLabelImage = l.includes('image') || 
                       l.includes('photo') || 
                       l.includes('logo') || 
                       l.includes('avatar')

  const isLinkKey = k.includes('link') || 
                    k.includes('url') || 
                    k.includes('href') || 
                    k.includes('id') ||
                    k.includes('cta')

  const isActuallyImage = (isImageKey || isLabelImage) && 
                          (!isLinkKey || k.includes('image') || k.includes('photo') || k.includes('avatar') || k.includes('logo'))

  const isIcon = type === 'icon' || k.includes('icon') || l.includes('icon')
  const isTextarea =
    type === 'textarea' ||
    (typeof value === 'string' && value.length > 80) ||
    k.includes('description') ||
    k.includes('content') ||
    k.includes('body') ||
    k.includes('bio') ||
    k.includes('about') ||
    k.includes('answer') ||
    k.includes('subtitle') ||
    k.includes('summary') ||
    k.includes('excerpt') ||
    l.includes('description') ||
    l.includes('content') ||
    l.includes('body') ||
    l.includes('bio') ||
    l.includes('about') ||
    l.includes('answer') ||
    l.includes('subtitle') ||
    l.includes('summary') ||
    l.includes('excerpt')
  
  if (type === 'image' || isActuallyImage) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{label}</label>
        <ImageUpload value={value || ''} onChange={onChange} />
      </div>
    )
  }

  if (isIcon) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{label}</label>
        <AwardIconPicker value={value || 'Award'} onChange={onChange} />
      </div>
    )
  }

  if (isTextarea) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{label}</label>
          {max && (
            <span className={`text-[9px] font-bold ${value?.length > max ? 'text-red-500' : 'text-muted-foreground/60'}`}>
              {value?.length || 0}/{max}
            </span>
          )}
        </div>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          maxLength={max}
          placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
          rows={3}
          className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/40 transition-all min-h-[80px]"
        />
      </div>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <div className={`flex items-center justify-between p-3 bg-muted/10 border border-border/60 rounded-xl ${className}`}>
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{label}</label>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
        />
      </div>
    )
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{label}</label>
        {max && (
          <span className={`text-[9px] font-bold ${value?.length > max ? 'text-red-500' : 'text-muted-foreground/60'}`}>
            {value?.length || 0}/{max}
          </span>
        )}
      </div>
      <input
        type={typeof value === 'number' ? 'number' : 'text'}
        value={value || ''}
        onChange={(e) => onChange(typeof value === 'number' ? Number(e.target.value) : e.target.value)}
        maxLength={max}
        placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
        className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/40 transition-all h-9"
      />
    </div>
  )
}
