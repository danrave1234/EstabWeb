"use client";

import { useState, useEffect } from "react";
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
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

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
  status: 'active' | 'revoked' | 'expired';
}

export default function AdminCodesPage() {
  const [codes, setCodes] = useState<TemplateCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingCode, setEditingCode] = useState<TemplateCode | null>(null);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/codes");
      const data = await res.json();
      if (res.ok) {
        setCodes(data);
      } else {
        toast.error(data.error || "Failed to fetch codes");
      }
    } catch (err) {
      toast.error("An error occurred while fetching codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this code? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/codes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Code deleted successfully");
        fetchCodes();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete code");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the code");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Code ${newStatus === 'active' ? 'activated' : 'revoked'} successfully`);
        fetchCodes();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      toast.error("An error occurred while updating status");
    }
  };

  const handleUpdateLimits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCode) return;

    try {
      const res = await fetch("/api/codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: editingCode.id, 
          max_uses: editingCode.max_uses,
          expires_at: editingCode.expires_at 
        }),
      });
      if (res.ok) {
        toast.success("Limits updated successfully");
        setEditingCode(null);
        fetchCodes();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update limits");
      }
    } catch (err) {
      toast.error("An error occurred while updating limits");
    }
  };

  const filteredCodes = codes.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) || 
    (c.label?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const getStatusBadge = (code: TemplateCode) => {
    const isExpired = code.expires_at && new Date(code.expires_at) < new Date();
    const isMaxed = code.usage_count >= code.max_uses;
    
    if (code.status === 'revoked') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="w-3 h-3" /> Revoked
        </span>
      );
    }
    
    if (isExpired || code.status === 'expired') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Clock className="w-3 h-3" /> Expired
        </span>
      );
    }

    if (isMaxed) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          <AlertTriangle className="w-3 h-3" /> Maxed Out
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
        <CheckCircle className="w-3 h-3" /> Active
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Codes</h1>
          <p className="text-muted-foreground mt-1">Manage and track generated project codes.</p>
        </div>
        <button 
          onClick={fetchCodes}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-background border rounded-xl overflow-hidden">
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search codes or labels..." 
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                      <span className="text-sm text-muted-foreground">Loading codes...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCodes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-muted-foreground">No template codes found.</p>
                  </td>
                </tr>
              ) : filteredCodes.map((code) => (
                <tr key={code.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-lg text-primary">{code.code}</span>
                      <span className="text-sm text-muted-foreground">{code.label || "No label"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(code)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {code.usage_count} / {code.max_uses}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {code.expires_at ? format(new Date(code.expires_at), 'MMM d, yyyy') : 'Never'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingCode(code)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                        title="Edit limits"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(code.id, code.status === 'revoked' ? 'active' : 'revoked')}
                        className={`p-2 rounded-lg transition-all ${
                          code.status === 'revoked' 
                            ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20' 
                            : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                        }`}
                        title={code.status === 'revoked' ? "Activate code" : "Revoke code"}
                      >
                        {code.status === 'revoked' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleDelete(code.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                        title="Delete code"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingCode && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-background border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">Edit Code Limits</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Updating limits for code: <span className="font-mono text-primary font-bold">{editingCode.code}</span>
              </p>
            </div>
            <form onSubmit={handleUpdateLimits} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Max Redemptions</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full px-4 py-2 bg-muted/50 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  value={editingCode.max_uses}
                  onChange={(e) => setEditingCode({...editingCode, max_uses: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Expiration Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 bg-muted/50 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  value={editingCode.expires_at ? editingCode.expires_at.split('T')[0] : ""}
                  onChange={(e) => setEditingCode({...editingCode, expires_at: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setEditingCode(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium border rounded-xl hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
