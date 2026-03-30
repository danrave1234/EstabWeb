'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

type AttentionBreakdownSection = {
  section_key: string
  section_label: string
  viewRateText: string
  sectionViews: number
  attentiveSessions: number
  avgAttentionText: string
  totalAttentionText: string
}

type SectionAttentionBreakdownProps = {
  sections: AttentionBreakdownSection[]
  totalTrackedSections: number
  visibleTrackedSections: number
  hasExtraAttentionRows: boolean
  sectionToggleHref: string
  sectionToggleLabel: string
  sectionToggleExpanded: boolean
  secondaryButtonClass: string
}

export default function SectionAttentionBreakdown({
  sections,
  totalTrackedSections,
  visibleTrackedSections,
  hasExtraAttentionRows,
  sectionToggleHref,
  sectionToggleLabel,
  sectionToggleExpanded,
  secondaryButtonClass,
}: SectionAttentionBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <div className="font-medium">All section attention</div>
          <div className="text-sm text-muted-foreground">
            See how long each section stayed on screen and how many visits truly paid attention.
          </div>
        </div>
        {!isOpen && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={secondaryButtonClass}
            >
              Show section breakdown
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {isOpen ? (
        <>
          <div className="border-t border-muted/60 space-y-0 px-4 py-2">
            {sections.map((section) => (
              <div
                key={`attention-${section.section_key}`}
                className="grid grid-cols-1 gap-2 border-b border-muted/50 py-3 last:border-0 md:grid-cols-12 md:items-center"
              >
                <div className="md:col-span-4 min-w-0">
                  <div className="truncate font-medium">{section.section_label}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {section.viewRateText} of visits reached this section.
                  </div>
                </div>
                <div className="md:col-span-4 text-sm text-muted-foreground">
                  Seen by {section.sectionViews} sessions → {section.attentiveSessions} paid close attention
                </div>
                <div className="md:col-span-2 text-sm text-muted-foreground md:text-right">
                  Avg. {section.avgAttentionText}
                </div>
                <div className="md:col-span-2 text-sm text-muted-foreground md:text-right">
                  Total {section.totalAttentionText}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-muted/60 px-4 py-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Showing {visibleTrackedSections} of {totalTrackedSections} tracked sections.
              </p>
              <p className="text-xs text-muted-foreground">
                Attention only counts while the visitor had the page visible and focused.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hasExtraAttentionRows && (
                <Link
                  href={sectionToggleHref}
                  className={secondaryButtonClass}
                >
                  {sectionToggleLabel}
                  <ArrowRight className={`h-4 w-4 transition-transform ${sectionToggleExpanded ? 'rotate-180' : ''}`} />
                </Link>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={secondaryButtonClass}
              >
                Hide section breakdown
                <ChevronDown className="h-4 w-4 rotate-180" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="border-t border-muted/60 px-4 py-3 text-sm text-muted-foreground">
          Section-by-section attention is hidden right now. Open it to see how many sessions reached each section and how long they stayed there.
        </div>
      )}
    </>
  )
}