"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Calendar, 
  Users, 
  Tag, 
  MoreVertical, 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCcw,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface TemplateCode {
  id: string;
  code: string;
  label: string;
  expires_at: string | null;
  max_uses: number;
  usage_count: number;
  status: 'active' | 'revoked' | 'expired';
  created_at: string;
}

export default function AdminCodesPage() {
  const [codes, setCodes] = useState<TemplateCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCode, setEditingCode] = useState<TemplateCode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/codes');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCodes(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleUpdate = async (id: string, updates: Partial<TemplateCode>) => {
    try {
      const res = await fetch('/api/codes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success("Code updated successfully");
      fetchCodes();
      setIsModalOpen(false);
      setEditingCode(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update code");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this code? This cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/codes?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success("Code deleted");
      fetchCodes();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete code");
    }
  };

  const getStatusIcon = (status: string, expires_at: string | null) => {
    if (status === 'revoked') return <XCircle className="w-4 h-4 text-red-500" />;
    if (expires_at && new Date(expires_at) < new Date()) return <Clock className="w-4 h-4 text-orange-500" />;
    if (status === 'active') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Codes</h1>
          <p className="text-muted-foreground mt-1">
            Manage redemption codes for template-based projects.
          </p>
        </div>
        <button 
          onClick={() => {
            // Logic for creating new codes would go here or redirect to template page where codes are usually generated
            window.location.href = '/admin/template';
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Create New Code
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading codes...</p>
        </div>
      ) : codes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/30">
          <Tag className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-lg font-semibold">No codes found</h3>
          <p className="text-muted-foreground max-w-xs mx-auto mt-2">
            Generate your first template code from the Template Preview page.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {codes.map((item) => (
            <div 
              key={item.id} 
              className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow group relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    item.status === 'revoked' ? 'bg-red-500/10' : 'bg-primary/10'
                  }`}>
                    <Tag className={`w-6 h-6 ${
                      item.status === 'revoked' ? 'text-red-500' : 'text-primary'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-mono font-bold tracking-wider">{item.code}</span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold uppercase tracking-wider">
                        {getStatusIcon(item.status, item.expires_at)}
                        <span className={
                          item.status === 'revoked' ? 'text-red-500' : 
                          (item.expires_at && new Date(item.expires_at) < new Date()) ? 'text-orange-500' : 
                          'text-emerald-500'
                        }>
                          {item.status === 'revoked' ? 'Revoked' : 
                           (item.expires_at && new Date(item.expires_at) < new Date()) ? 'Expired' : 
                           'Active'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-foreground/80">{item.label}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created: {format(new Date(item.created_at), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Expires: {item.expires_at ? format(new Date(item.expires_at), 'MMM d, yyyy') : 'Never'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Usage: {item.usage_count} / {item.max_uses}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button 
                    onClick={() => {
                      setEditingCode(item);
                      setIsModalOpen(true);
                    }}
                    className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    title="Edit Code"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleUpdate(item.id, { status: item.status === 'revoked' ? 'active' : 'revoked' })}
                    className={`p-2 rounded-lg transition-colors ${
                      item.status === 'revoked' 
                        ? 'text-emerald-500 hover:bg-emerald-50' 
                        : 'text-orange-500 hover:bg-orange-50'
                    }`}
                    title={item.status === 'revoked' ? "Reactivate" : "Revoke"}
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && editingCode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Edit Code: {editingCode.code}</h2>
              <p className="text-sm text-muted-foreground mt-1">Update expiration and limits</p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdate(editingCode.id, {
                expires_at: formData.get('expires_at') ? new Date(formData.get('expires_at') as string).toISOString() : null,
                max_uses: parseInt(formData.get('max_uses') as string) || 1
              });
            }} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Expiration Date</label>
                <input 
                  type="date" 
                  name="expires_at"
                  defaultValue={editingCode.expires_at ? format(new Date(editingCode.expires_at), 'yyyy-MM-dd') : ''}
                  className="w-full bg-background border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-[10px] text-muted-foreground">Leave empty for no expiration</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Maximum Redemptions</label>
                <input 
                  type="number" 
                  name="max_uses"
                  min="1"
                  defaultValue={editingCode.max_uses}
                  className="w-full bg-background border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
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
