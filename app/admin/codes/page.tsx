"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Layout,
  User,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  code_redemptions?: {
    redeemed_at: string;
    redeemed_by: string;
    user_email?: string;
    projects: { subdomain: string };
  }[];
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
  promo_redemptions?: {
    redeemed_at: string;
    redeemed_by: string;
    user_email?: string;
    projects: { subdomain: string };
  }[];
}

const PLAN_LABELS: Record<string, string> = {
  basic: "Starter",
  pro: "Business",
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

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function parseDateParts(iso: string | null): { day: string; month: string; year: string } {
  if (!iso) return { day: "", month: "", year: "" };
  const d = new Date(iso);
  return { day: String(d.getDate()), month: String(d.getMonth() + 1), year: String(d.getFullYear()) };
}

function buildIso(day: string, month: string, year: string): string | null {
  if (!day || !month || !year) return null;
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toISOString().split("T")[0];
}

function DatePicker({ value, onChange, label, optional }: { value: string | null; onChange: (v: string | null) => void; label: string; optional?: boolean }) {
  const initial = parseDateParts(value);
  const [month, setMonth] = useState(initial.month);
  const [day, setDay] = useState(initial.day);
  const [year, setYear] = useState(initial.year);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const daysInMonth = month && year ? new Date(Number(year), Number(month), 0).getDate() : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const sel = "w-full px-3 py-2 bg-muted/20 border-border/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none cursor-pointer transition-all";
  const handleMonth = (m: string) => { setMonth(m); onChange(buildIso(day, m, year)); };
  const handleDay = (d: string) => { setDay(d); onChange(buildIso(d, month, year)); };
  const handleYear = (y: string) => { setYear(y); onChange(buildIso(day, month, y)); };
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">{label}{optional && <span className="text-muted-foreground/50 font-normal ml-1">(OPTIONAL)</span>}</label>
      <div className="grid grid-cols-3 gap-2">
        <select className={sel} value={month} onChange={(e) => handleMonth(e.target.value)}>
          <option value="">Month</option>
          {MONTHS.map((m, i) => <option key={i+1} value={String(i+1)}>{m}</option>)}
        </select>
        <select className={sel} value={day} onChange={(e) => handleDay(e.target.value)}>
          <option value="">Day</option>
          {days.map((d) => <option key={d} value={String(d)}>{d}</option>)}
        </select>
        <select className={sel} value={year} onChange={(e) => handleYear(e.target.value)}>
          <option value="">Year</option>
          {years.map((y) => <option key={y} value={String(y)}>{y}</option>)}
        </select>
      </div>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function StatusBadge({ status, expires_at, usage_count, max_uses }: { status: string; expires_at: string | null; usage_count: number; max_uses: number }) {
  const isExpired = expires_at && new Date(expires_at) < new Date();
  const isMaxed = usage_count >= max_uses;
  if (status === "revoked")
    return <Badge variant="secondary" className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-none font-bold text-[10px] uppercase tracking-wider"><XCircle className="w-3 h-3 mr-1" /> REVOKED</Badge>;
  if (isExpired || status === "expired")
    return <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-none font-bold text-[10px] uppercase tracking-wider"><Clock className="w-3 h-3 mr-1" /> EXPIRED</Badge>;
  if (isMaxed)
    return <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none font-bold text-[10px] uppercase tracking-wider"><AlertTriangle className="w-3 h-3 mr-1" /> MAXED OUT</Badge>;
  return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none font-bold text-[10px] uppercase tracking-wider"><CheckCircle className="w-3 h-3 mr-1" /> ACTIVE</Badge>;
}

function RedemptionList({ redemptions = [] }: { redemptions?: any[] }) {
  if (!redemptions || redemptions.length === 0) return <p className="text-xs text-muted-foreground p-4 text-center">No redemptions yet.</p>;

  return (
    <div className="max-h-[300px] overflow-y-auto space-y-2 p-1">
      {redemptions.map((r, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 text-xs">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <User className="w-3 h-3 text-muted-foreground" />
              {r.user_email || r.redeemed_by}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              {format(new Date(r.redeemed_at), "MMM d, yyyy HH:mm")}
            </div>
          </div>
          <div className="text-right">
            <a 
              href={`https://${r.projects?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-primary hover:underline font-medium"
            >
              {r.projects?.subdomain}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
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

function TemplateCodesWorkspace() {
  const { data, error, isLoading: loading, mutate } = useSWR<TemplateCode[]>("/api/codes", fetcher);
  const codes = Array.isArray(data) ? data : [];
  const apiError = error || (data && !Array.isArray(data) ? (data as any).error : null);
  const [search, setSearch] = useState("");
  const [editingCode, setEditingCode] = useState<TemplateCode | null>(null);
  const [viewingRedemptions, setViewingRedemptions] = useState<TemplateCode | null>(null);

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

  const filtered = Array.isArray(codes) ? codes.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.label?.toLowerCase() || "").includes(search.toLowerCase())
  ) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search codes or labels..."
            className="pl-9 h-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Code Info</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Usage</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Expires</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center"><RefreshCw className="w-6 h-6 animate-spin mx-auto opacity-20" /></td></tr>
                ) : apiError ? (
                  <tr><td colSpan={6} className="p-20 text-center text-rose-500">
                    <div className="flex flex-col items-center gap-3">
                      <AlertTriangle className="w-10 h-10" />
                      <p className="text-sm font-bold">Error loading codes: {apiError}</p>
                    </div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="p-20 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <Layout className="w-10 h-10 text-muted-foreground/40" />
                      <p className="text-sm">No template codes found.</p>
                    </div>
                  </td></tr>
                ) : (
                  filtered.map((code) => (
                    <tr key={code.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <code className="bg-primary/5 text-primary font-mono font-bold px-2 py-1 rounded border border-primary/10">{code.code}</code>
                            <CopyButton text={code.code} />
                          </div>
                          <span className="text-xs font-medium text-foreground">{code.label || "Untitled Snapshot"}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <StatusBadge status={code.status} expires_at={code.expires_at} usage_count={code.usage_count} max_uses={code.max_uses} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <Hash className="w-3 h-3 text-muted-foreground" />
                          <span>{code.usage_count} / {code.max_uses}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-medium text-muted-foreground">
                        {code.expires_at ? format(new Date(code.expires_at), "MMM d, yyyy") : "Never"}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setViewingRedemptions(code)} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" title="View Usage">
                            <User className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditingCode(code)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(code.id, code.status === "revoked" ? "active" : "revoked")} className={cn("h-8 w-8", code.status === "revoked" ? "text-emerald-500 hover:bg-emerald-500/10" : "text-amber-500 hover:bg-amber-500/10")}>
                            {code.status === "revoked" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(code.id)} className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingCode} onOpenChange={(o) => { if (!o) setEditingCode(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Code Limits</DialogTitle>
            <DialogDescription>Code: <span className="font-mono text-primary font-bold">{editingCode?.code}</span></DialogDescription>
          </DialogHeader>
          {editingCode && (
            <form onSubmit={handleUpdateLimits} className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Max Redemptions</label>
                <input type="number" min="1" className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={editingCode.max_uses} onChange={(e) => setEditingCode({ ...editingCode, max_uses: parseInt(e.target.value) })} />
              </div>
              <DatePicker label="Expiration Date" optional value={editingCode.expires_at} onChange={(v) => setEditingCode({ ...editingCode, expires_at: v })} />
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingCode(null)} className="flex-1 rounded-xl">Cancel</Button>
                <Button type="submit" className="flex-1 rounded-xl font-bold uppercase tracking-wider text-xs">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingRedemptions} onOpenChange={(open) => !open && setViewingRedemptions(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Usage History
            </DialogTitle>
            <DialogDescription>
              Who used the code <code className="font-bold text-foreground">{viewingRedemptions?.code}</code>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <RedemptionList redemptions={viewingRedemptions?.code_redemptions} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Promo Codes Tab ──────────────────────────────────────────────────────────

const DEFAULT_PROMO_FORM = { description: "", plan_id: "basic", months: 1, max_uses: 1, expires_at: "", prefix: "" };

function PromoCodesWorkspace() {
  const { data, error, isLoading: loading, mutate } = useSWR<PromoCode[]>("/api/admin/promo-codes", fetcher);
  const promos = Array.isArray(data) ? data : [];
  const apiError = error || (data && !Array.isArray(data) ? (data as any).error : null);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [viewingRedemptions, setViewingRedemptions] = useState<PromoCode | null>(null);
  const [form, setForm] = useState(DEFAULT_PROMO_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = Array.isArray(promos) ? promos.filter((p) =>
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    (p.description?.toLowerCase() || "").includes(search.toLowerCase())
  ) : [];

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
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Redemption Codes</h1>
          <p className="text-muted-foreground mt-2">Manage template snapshots and promotional subscription codes.</p>
        </div>

        <Tabs defaultValue="promo" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 border border-border/50 rounded-xl">
            <TabsTrigger value="promo" className="font-bold text-xs uppercase tracking-wider px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Promo Codes</TabsTrigger>
            <TabsTrigger value="template" className="font-bold text-xs uppercase tracking-wider px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Template Codes</TabsTrigger>
          </TabsList>

          {/* ─── Promo Codes Tab ─────────────────────────────────────────────────── */}
          <TabsContent value="promo" className="space-y-6 outline-none">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search promo codes..."
                  className="pl-9 h-9 text-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button onClick={() => setShowCreate(true)} className="h-9 font-bold text-xs uppercase tracking-wider rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                New Promo
              </Button>
            </div>

            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Code</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan Details</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Status</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Usage</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Expires</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {loading ? (
                        <tr><td colSpan={6} className="p-20 text-center"><RefreshCw className="w-6 h-6 animate-spin mx-auto opacity-20" /></td></tr>
                      ) : apiError ? (
                        <tr><td colSpan={6} className="p-20 text-center text-rose-500">
                          <div className="flex flex-col items-center gap-3">
                            <AlertTriangle className="w-10 h-10" />
                            <p className="text-sm font-bold">Error loading promos: {apiError}</p>
                          </div>
                        </td></tr>
                      ) : filtered.length === 0 ? (
                        <tr><td colSpan={6} className="p-20 text-center text-muted-foreground">
                          <div className="flex flex-col items-center gap-3">
                            <Tag className="w-10 h-10 text-muted-foreground/40" />
                            <p className="text-sm">No promo codes found.</p>
                          </div>
                        </td></tr>
                      ) : (
                        filtered.map((promo) => (
                          <tr key={promo.id} className="group hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <code className="bg-primary/5 text-primary font-mono font-bold px-2 py-1 rounded border border-primary/10">{promo.code}</code>
                                <CopyButton text={promo.code} />
                              </div>
                              {promo.description && <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[150px]">{promo.description}</p>}
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col gap-1">
                                <Badge className={`${PLAN_COLORS[promo.plan_id]} border-none font-bold text-[10px] py-0 px-2 h-5 w-fit`}>
                                  {PLAN_LABELS[promo.plan_id]?.toUpperCase()}
                                </Badge>
                                <span className="text-xs font-medium text-foreground">{promo.months} {promo.months === 1 ? "Month" : "Months"}</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <StatusBadge status={promo.status} expires_at={promo.expires_at} usage_count={promo.usage_count} max_uses={promo.max_uses} />
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-xs">
                                  <Hash className="w-3 h-3 text-muted-foreground" />
                                  <span className="font-bold">{promo.usage_count}</span>
                                  <span className="text-muted-foreground">/</span>
                                  <span className="text-muted-foreground">{promo.max_uses}</span>
                                </div>
                                <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all" 
                                    style={{ width: `${Math.min(100, (promo.usage_count / promo.max_uses) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-xs font-medium text-muted-foreground">
                              {promo.expires_at ? format(new Date(promo.expires_at), "MMM d, yyyy") : "Never"}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => setViewingRedemptions(promo)} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" title="View Usage">
                                  <User className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setEditingPromo(promo)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(promo)} className={cn("h-8 w-8", promo.status === "revoked" ? "text-emerald-500 hover:bg-emerald-500/10" : "text-amber-500 hover:bg-amber-500/10")}>
                                  {promo.status === "revoked" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(promo.id)} className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Template Codes Tab ─────────────────────────────────────────────── */}
          <TabsContent value="template" className="space-y-6 outline-none">
            <TemplateCodesWorkspace />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Modal */}
      <Dialog open={showCreate} onOpenChange={(o) => { if (!o) { setShowCreate(false); setForm(DEFAULT_PROMO_FORM); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Promo Code</DialogTitle>
            <DialogDescription>Generate a subscription promo code for clients.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
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
                  <select className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={form.plan_id} onChange={(e) => setForm({ ...form, plan_id: e.target.value as any })}>
                    <option value="basic">Starter</option>
                    <option value="pro">Business</option>
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
              </div>
              <DatePicker label="Expires On" optional value={form.expires_at || null} onChange={(v) => setForm({ ...form, expires_at: v || "" })} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreate(false); setForm(DEFAULT_PROMO_FORM); }} className="flex-1 px-4 py-2.5 text-sm font-medium border rounded-xl hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all disabled:opacity-60">
                  {saving ? "Creating…" : "Create Code"}
                </button>
              </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingPromo} onOpenChange={(o) => { if (!o) setEditingPromo(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Promo Code</DialogTitle>
            <DialogDescription>Code: <span className="font-mono text-primary font-bold">{editingPromo?.code}</span></DialogDescription>
          </DialogHeader>
          {editingPromo && <form onSubmit={handleEdit} className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <input type="text" className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={editingPromo.description || ""} onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Plan</label>
                  <select className="w-full px-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={editingPromo.plan_id} onChange={(e) => setEditingPromo({ ...editingPromo, plan_id: e.target.value as any })}>
                    <option value="basic">Starter</option>
                    <option value="pro">Business</option>
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
              </div>
              <DatePicker label="Expires On" optional value={editingPromo.expires_at} onChange={(v) => setEditingPromo({ ...editingPromo, expires_at: v })} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingPromo(null)} className="flex-1 px-4 py-2.5 text-sm font-medium border rounded-xl hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all disabled:opacity-60">
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
          </form>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingRedemptions} onOpenChange={(open) => !open && setViewingRedemptions(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Usage History
            </DialogTitle>
            <DialogDescription>
              Who used the code <code className="font-bold text-foreground">{viewingRedemptions?.code}</code>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <RedemptionList redemptions={viewingRedemptions?.promo_redemptions} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCodesPage() {
  return (
    <div className="flex flex-col gap-12">
      <PromoCodesWorkspace />
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Template Codes</h2>
          <p className="text-muted-foreground mt-1 text-sm">Snapshots used for site generation.</p>
        </div>
        <TemplateCodesWorkspace />
      </div>
    </div>
  );
}
