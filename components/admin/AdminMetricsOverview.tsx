import { AdminMetrics } from "@/lib/utils/admin-metrics"
import { Users, CreditCard, Activity, Briefcase, TrendingUp } from "lucide-react"

export default function AdminMetricsOverview({ metrics }: { metrics: AdminMetrics }) {
    const formatCurrency = (centavos: number) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(centavos / 100)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">Monthly Recurring Revenue</h3>
                </div>
                <p className="text-2xl font-bold tracking-tight">{formatCurrency(metrics.mrrCentavos)}</p>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">Active Subscriptions</h3>
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold tracking-tight">{metrics.activeSubscriptions}</p>
                    <span className="text-sm text-muted-foreground mb-1">
                        (+{metrics.trialSubscriptions} trials)
                    </span>
                </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
                </div>
                <p className="text-2xl font-bold tracking-tight">{metrics.totalUsers}</p>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <Briefcase className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Projects</h3>
                </div>
                <p className="text-2xl font-bold tracking-tight">{metrics.totalProjects}</p>
            </div>
        </div>
    )
}
