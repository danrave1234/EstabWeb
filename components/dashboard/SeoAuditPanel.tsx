import { runSeoAudit, SeoAuditResult, AuditIssue, PageAuditResult } from '@/lib/seo/seoAudit'
import { Search, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function scoreColor(pct: number): string {
  if (pct >= 90) return 'text-green-600'
  if (pct >= 75) return 'text-lime-600'
  if (pct >= 50) return 'text-orange-500'
  return 'text-red-500'
}

function scoreBg(pct: number): string {
  if (pct >= 90) return 'bg-green-500/10 border-green-500/30'
  if (pct >= 75) return 'bg-lime-500/10 border-lime-500/30'
  if (pct >= 50) return 'bg-orange-500/10 border-orange-500/30'
  return 'bg-red-500/10 border-red-500/30'
}

function scoreLabel(pct: number): string {
  if (pct >= 90) return 'Excellent'
  if (pct >= 75) return 'Good'
  if (pct >= 50) return 'Needs Improvement'
  return 'Poor'
}

function SeverityIcon({ severity }: { severity: AuditIssue['severity'] }) {
  if (severity === 'high')
    return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
  if (severity === 'medium')
    return <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
  return <Info className="w-4 h-4 text-blue-400 shrink-0" />
}

function severityLabel(severity: AuditIssue['severity']): string {
  if (severity === 'high') return 'High'
  if (severity === 'medium') return 'Medium'
  return 'Low'
}

function severityBadge(severity: AuditIssue['severity']): string {
  if (severity === 'high') return 'bg-red-500/10 text-red-600'
  if (severity === 'medium') return 'bg-orange-500/10 text-orange-600'
  return 'bg-blue-500/10 text-blue-600'
}

function pageScoreBar(score: number, maxScore: number) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${pct >= 90 ? 'bg-green-500' : pct >= 75 ? 'bg-lime-500' : pct >= 50 ? 'bg-orange-400' : 'bg-red-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${scoreColor(pct)}`}>{pct}%</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component (server-renderable)
// ---------------------------------------------------------------------------
interface SeoAuditPanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>
}

export default function SeoAuditPanel({ config }: SeoAuditPanelProps) {
  const audit: SeoAuditResult = runSeoAudit(config)
  const { percentage, score, maxScore, issues, pageResults } = audit

  const highCount = issues.filter((i) => i.severity === 'high').length
  const medCount = issues.filter((i) => i.severity === 'medium').length

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">SEO Audit</h2>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground">{issues.length} issue{issues.length !== 1 ? 's' : ''} found</span>
      </div>

      <div className="p-6 space-y-6">
        {/* Score Card */}
        <div className={`rounded-xl border p-5 flex items-center gap-5 ${scoreBg(percentage)}`}>
          <div className="text-center shrink-0">
            <div className={`text-4xl font-black tabular-nums ${scoreColor(percentage)}`}>{percentage}</div>
            <div className="text-[10px] font-bold text-muted-foreground mt-0.5">/ 100</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-base font-black ${scoreColor(percentage)}`}>{scoreLabel(percentage)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {score} / {maxScore} points
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {highCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-red-600">
                  <AlertCircle className="w-3 h-3" /> {highCount} critical
                </span>
              )}
              {medCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500">
                  <AlertTriangle className="w-3 h-3" /> {medCount} warnings
                </span>
              )}
              {issues.length === 0 && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                  <CheckCircle className="w-3 h-3" /> No issues
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Issue List */}
        {issues.length > 0 && (
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Issues</h3>
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
              {/* Table header */}
              <div className="grid grid-cols-[auto_1fr_auto] gap-3 px-4 py-2 bg-muted/40">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Severity</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Issue</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Page</span>
              </div>
              {issues.map((issue, i) => (
                <div key={i} className="grid grid-cols-[auto_1fr_auto] gap-3 px-4 py-3 items-start hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <SeverityIcon severity={issue.severity} />
                    <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${severityBadge(issue.severity)}`}>
                      {severityLabel(issue.severity)}
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-snug">{issue.message}</p>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {issue.page ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page Breakdown */}
        {pageResults.length > 0 && (
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Page Breakdown</h3>
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
              <div className="grid grid-cols-[1fr_2fr_auto] gap-3 px-4 py-2 bg-muted/40">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Page</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Score</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Issues</span>
              </div>
              {pageResults.map((pr: PageAuditResult) => (
                <div key={pr.page} className="grid grid-cols-[1fr_2fr_auto] gap-3 px-4 py-3 items-center hover:bg-muted/20 transition-colors">
                  <span className="text-xs font-bold text-foreground truncate">{pr.page}</span>
                  {pageScoreBar(pr.score, pr.maxScore)}
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {pr.issues.length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All clear */}
        {issues.length === 0 && (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mb-3" />
            <p className="text-sm font-bold text-foreground">SEO looks great!</p>
            <p className="text-xs text-muted-foreground mt-1">No issues detected across your pages.</p>
          </div>
        )}
      </div>
    </div>
  )
}
