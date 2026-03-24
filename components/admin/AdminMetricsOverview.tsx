import { AdminMetrics } from "@/lib/utils/admin-metrics"
import { Users, CreditCard, Activity, Briefcase, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminMetricsOverview({ metrics }: { metrics: AdminMetrics }) {
    const formatCurrency = (centavos: number) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(centavos / 100)
    }

    const cards = [
        {
            title: "MRR",
            value: formatCurrency(metrics.mrrCentavos),
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            description: "Monthly recurring revenue"
        },
        {
            title: "Active Subscriptions",
            value: metrics.activeSubscriptions.toString(),
            icon: Activity,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            description: `${metrics.trialSubscriptions} active trials`
        },
        {
            title: "Total Users",
            value: metrics.totalUsers.toString(),
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            description: "Registered platform users"
        },
        {
            title: "Total Projects",
            value: metrics.totalProjects.toString(),
            icon: Briefcase,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            description: "Generated websites"
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
                <Card key={card.title} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                            <card.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight">{card.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {card.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
