"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  Hash,
  Search,
  RefreshCw,
  AlertTriangle,
  Tag,
  Copy,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TemplateCode {
  id: string;
  code: string;
  label: string | null;
  payload: any;
  preset_key: string | null;
  created_at: string;
  expires_at: string | null;
  max_uses: number;
  usage_count: number;
  status: "active" | "revoked" | "expired";
}

interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  plan_id: "basic" | "pro" | "ecommerce" | "custom";
  months: number;
  max_uses: number;
  usage_count: number;
  status: "active" | "revoked";
  expires_at: string | null;
  created_at: string;
  promo_redemptions?: { count: number }[];
}

const PLAN_LABELS: Record<string, string> = {
  basic: "Basic",
  pro: "Pro",
  ecommerce: "Ecommerce",
  custom: "Custom",
};

const PLAN_COLORS: Record<string, string> = {
  basic: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pro: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  ecommerce: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  custom: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const EXPIRY_OPTIONS = [
  { label: "No expiry", value: "" },
  { label: "7 days", days: 7 },
  { label: "14 days", days: 14 },
  { label: "30 days", days: 30 },
  { label: "3 months", days: 90 },
  { label: "6 months", days: 180 },
  { label: "1 year", days: 365 },
];

function expiryToDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function dateToExpiryOption(dateStr: string | null): string {
  if (!dateStr) return "";
  const target = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const match = EXPIRY_OPTIONS.find((o) => "days" in o && Math.abs((o as any).days - diffDays) <= 1);
  return match && "days" in match ? String((match as any).days) : "";
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function StatusBadge({ status, expires_at, usage_count, max_uses }: { status: string; expires_at: string | null; usage_count: number; max_uses: number }) {
  const isExpired = expires_at && new Date(expires_at) < new Date();
  const isMaxed = usage_count >= max_uses;
  if (status === "revoked")
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3" /> Revoked</span>;
  if (isExpired || status === "expired")
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><Clock className="w-3 h-3" /> Expired</span>;
  if (isMaxed)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><AlertTriangle className="w-3 h-3" /> Maxed Out</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><CheckCircle className="w-3 h-3" /> Active</span>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Copy code">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ─── Template Codes Tab ───────────────────────────────────────────────────────

function TemplateCodesTab() {
  const { data: codes = [], isLoading: loading, mutate } = useSWR<TemplateCode[]>("/api/codes", fetcher);
  const [search, setSearch] = useState("");
  const [editingCode, setEditingCode] = useState<TemplateCode | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this code? This cannot be undone.")) return;
    const res = await fetch(`/api/codes?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Code deleted"); mutate(); }
    else { const d = await res.json(); toast.error(d.error || "Failed to delete"); }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const res = await fetch("/api/codes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: newStatus }) });
    if (res.ok) { toast.success(`Code ${newStatus === "active" ? "activated" : "revoked"}`); mutate(); }
    else { const d = await res.json(); toast.error(d.error || "Failed to update"); }
  };

  const handleUpdateLimits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCode) return;
    const res = await fetch("/api/codes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingCode.id, max_uses: editingCode.max_uses, expires_at: editingCode.expires_at }) });
    if (res.ok) { toast.success("Limits updated"); setEditingCode(null); mutate(); }
    else { const d = await res.json(); toast.error(d.error || "Failed to update"); }
  };

  const filtered = codes.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.label?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <>
      <div className="bg-background border rounded-xl overflow-hidden">
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search codes or labels…" className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Code Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Usage</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Expires</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center"><div className="flex flex-col items-center gap-2"><RefreshCw className="w-8 h-8 text-primary animate-spin" /><span className="text-sm text-muted-foreground">Loading…</span></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No template codes found.</td></tr>
              ) : filtered.map((code) => (
                <tr key={code.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-base text-primary">{code.code}</span>
                      <CopyButton text={code.code} />
                    </div>
                    <span className="text-sm text-muted-foreground">{code.label || "No label"}</span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={code.status} expires_at={code.expires_at} usage_count={code.usage_count} max_uses={code.max_uses} /></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2"><Hash className="w-4 h-4 text-muted-foreground" /><span className="text-sm font-medium">{code.usage_count} / {code.max_uses}</span></div></td>
                  <td className="px-6 py-4"><span className="text-sm text-muted-foreground">{code.expires_at ? format(new Date(code.expires_at), "MMM d, yyyy") : "Never"}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingCode(code)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all" title="Edit limits"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleUpdateStatus(code.id, code.status === "revoked" ? "active" : "revoked")} className={`p-2 rounded-lg transition-all ${code.status === "revoked" ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20" : "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20"}`} title={code.status === "revoked" ? "Activate" : "Revoke"}>{code.status === "revoked" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}</button>
                      <button onClick={() => handleDelete(code.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingCode && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-background border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">Edit Code Limits</h3>
              <p className="text-sm text-muted-foreground mt-1">Code: <span className="font-mono text-primary font-bold">{editingCode.code}</span></p>
            </div>
            <form onSubmit={handleUpdateLimits} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Max Redemptions</label>
                <input type="number" min="1" className="w-full px-4 py-2 bg-muted/50 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" value={editingCode.max_uses} onChange={(e) => setEditingCode({ ...editingCode, max_uses: parseInt(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Expiration Date</label>
                <input type="date" className="w-full px-4 py-2 bg-muted/50 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" value={editingCode.expires_at ? editingCode.expires_at.split("T")[0] : ""} onChange={(e) => setEditingCode({ ...editingCode, expires_at: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingCode(null)} className="flex-1 px-4 py-2.5 text-sm font-medium border rounded-xl hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Promo Codes Tab ──────────────────────────────────────────────────────────

const DEFAULT_PROMO_FORM = { description: "", plan_id: "basic", months: 1, max_uses: 1, expires_at: "", prefix: "" };

function PromoCodesTab() {
  const { data: promos = [], isLoading: loading, mutate } = useSWR<PromoCode[]>("/api/admin/promo-codes", fetcher);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [form, setForm] = useState(DEFAULT_PROMO_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = promos.filter((p) =>
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    (p.description?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, months: Number(form.months), max_uses: Number(form.max_uses), expires_at: form.expires_at || null, prefix: form.prefix || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to create"); return; }
      toast.success(`Promo code created: ${data.code}`);
      setShowCreate(false);
      setForm(DEFAULT_PROMO_FORM);
      mutate();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPromo.id,
          description: editingPromo.description,
          plan_id: editingPromo.plan_id,
          months: Number(editingPromo.months),
          max_uses: Number(editingPromo.max_uses),
          expires_at: editingPromo.expires_at || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to update"); return; }
      toast.success("Promo code updated");
      setEditingPromo(null);
      mutate();
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (promo: PromoCode) => {
    const newStatus = promo.status === "active" ? "revoked" : "active";
    const res = await fetch("/api/admin/promo-codes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: promo.id, status: newStatus }) });
    if (res.ok) { toast.success(`Promo ${newStatus === "active" ? "activated" : "revoked"}`); mutate(); }
    else { const d = await res.json(); toast.error(d.error || "Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/promo-codes?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Promo code deleted"); mutate(); }
    else { const d = await res.json(); toast.error(d.error || "Failed to delete"); }
  };

  return (
    <>
      <div className="bg-background border rounded-xl overflow-hidden">
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search promo codes or descriptions…" className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all shrink-0">
            <Plus className="w-4 h-4" /> New Promo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Code</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Usage</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Expires</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center"><div className="flex flex-col items-center gap-2"><RefreshCw className="w-8 h-8 text-primary animate-spin" /><span className="text-sm text-muted-foreground">Loading…</span></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Tag className="w-10 h-10 text-muted-foreground/40" />
                    <p className="text-muted-foreground text-sm">No promo codes yet. Create one to get started.</p>
                  </div>
                </td></tr>
              ) : filtered.map((promo) => (
                <tr key={promo.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-base text-primary">{promo.code}</span>
                      <CopyButton text={promo.code} />
                    </div>
                    {promo.description && <p className="text-xs text-muted-foreground mt-0.5">{promo.description}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${PLAN_COLORS[promo.plan_id]}`}>
                      {PLAN_LABELS[promo.plan_id]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{promo.months} {promo.months === 1 ? "month" : "months"}</span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={promo.status} expires_at={promo.expires_at} usage_count={promo.usage_count} max_uses={promo.max_uses} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{promo.usage_count} / {promo.max_uses}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm text-muted-foreground">{promo.expires_at ? format(new Date(promo.expires_at), "MMM d, yyyy") : "Never"}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingPromo(promo)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleToggleStatus(promo)} className={`p-2 rounded-lg transition-all ${promo.status === "revoked" ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20" : "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20"}`} title={promo.status === "revoked" ? "Activate" : "Revoke"}>{promo.status === "revoked" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}</button>
                      <button onClick={() => handleDelete(promo.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-background border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">Create Promo Code</h3>
              <p className="text-sm text-muted-foreground mt-1">Generate a subscription promo code for clients.</p>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Code Prefix <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input type="text" placeholder="e.g. LAUNCH → LAUNCH-XXXXXXXX" className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none uppercase" value={form.prefix} onChange={(e) => setForm({ ...form, prefix: e.target.value })} maxLength={12} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input type="text" placeholder="e.g. Launch promo — March 2026" className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Plan</label>
                  <select className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={form.plan_id} onChange={(e) => setForm({ ...form, plan_id: e.target.value })}>
                    <option value="basic">Basic</option>
                    <option value="pro">Pro</option>
                    <option value="ecommerce">Ecommerce</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Months</label>
                  <input type="number" min="1" max="36" className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={form.months} onChange={(e) => setForm({ ...form, months: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Max Uses</label>
                  <input type="number" min="1" className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Expires On <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <select className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={form.expires_at ? (() => { const d = new Date(form.expires_at); const now = new Date(); const diff = Math.round((d.getTime() - now.getTime()) / (1000*60*60*24)); const m = EXPIRY_OPTIONS.find(o => "days" in o && Math.abs((o as any).days - diff) <= 1); return m && "days" in m ? String((m as any).days) : ""; })() : ""} onChange={(e) => setForm({ ...form, expires_at: e.target.value ? expiryToDate(Number(e.target.value)) : "" })}>
                    {EXPIRY_OPTIONS.map((o) => (
                      <option key={"days" in o ? (o as any).days : "none"} value={"days" in o ? String((o as any).days) : ""}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreate(false); setForm(DEFAULT_PROMO_FORM); }} className="flex-1 px-4 py-2.5 text-sm font-medium border rounded-xl hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all disabled:opacity-60">
                  {saving ? "Creating…" : "Create Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPromo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-background border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">Edit Promo Code</h3>
              <p className="text-sm text-muted-foreground mt-1">Code: <span className="font-mono text-primary font-bold">{editingPromo.code}</span></p>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <input type="text" className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={editingPromo.description || ""} onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Plan</label>
                  <select className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={editingPromo.plan_id} onChange={(e) => setEditingPromo({ ...editingPromo, plan_id: e.target.value as any })}>
                    <option value="basic">Basic</option>
                    <option value="pro">Pro</option>
                    <option value="ecommerce">Ecommerce</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Months</label>
                  <input type="number" min="1" max="36" className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={editingPromo.months} onChange={(e) => setEditingPromo({ ...editingPromo, months: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Max Uses</label>
                  <input type="number" min="1" className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={editingPromo.max_uses} onChange={(e) => setEditingPromo({ ...editingPromo, max_uses: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Expires On</label>
                  <select className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={editingPromo.expires_at ? (() => { const d = new Date(editingPromo.expires_at!); const now = new Date(); const diff = Math.round((d.getTime() - now.getTime()) / (1000*60*60*24)); const m = EXPIRY_OPTIONS.find(o => "days" in o && Math.abs((o as any).days - diff) <= 1); return m && "days" in m ? String((m as any).days) : ""; })() : ""} onChange={(e) => setEditingPromo({ ...editingPromo, expires_at: e.target.value ? expiryToDate(Number(e.target.value)) : null })}>
                    {EXPIRY_OPTIONS.map((o) => (
                      <option key={"days" in o ? (o as any).days : "none"} value={"days" in o ? String((o as any).days) : ""}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingPromo(null)} className="flex-1 px-4 py-2.5 text-sm font-medium border rounded-xl hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all disabled:opacity-60">
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "template" | "promo";

export default function AdminCodesPage() {
  const [tab, setTab] = useState<Tab>("template");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Codes</h1>
          <p className="text-muted-foreground mt-1">Manage template setup codes and subscription promo codes.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-xl w-fit mb-6 border">
        <button
          onClick={() => setTab("template")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "template" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Template Codes
        </button>
        <button
          onClick={() => setTab("promo")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${tab === "promo" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Tag className="w-3.5 h-3.5" />
          Promo Codes
        </button>
      </div>

      {tab === "template" ? <TemplateCodesTab /> : <PromoCodesTab />}
    </div>
  );
}
