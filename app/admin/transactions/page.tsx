import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table"
import {
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Calendar,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const dynamic = 'force-dynamic'

interface PaymentWithProject {
  id: string
  amount: number
  currency: string
  status: string
  paymongo_payment_id: string
  paymongo_link_id: string
  created_at: string
  projects: {
    id: string
    subdomain: string
    custom_domain: string | null
    auto_renew: boolean
    profiles: {
      email: string
    }
  } | null
}

export default async function AdminTransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // Admin check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return redirect('/dashboard')

  // Fetch payments with project info
  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      *,
      projects (
        id,
        client_id,
        subdomain,
        custom_domain,
        auto_renew
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching payments:', JSON.stringify(error, null, 2))
  }

  // Fetch client profiles manually to avoid foreign key errors
  const clientIds = [...new Set(payments?.map(p => (p.projects as any)?.client_id).filter(Boolean))] as string[]
  let profiles: any[] = []
  if (clientIds.length > 0) {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', clientIds)
    profiles = profilesData || []
  }

  // Merge profiles into payments
  const mappedPayments = (payments || []).map(p => {
    const proj = p.projects as any
    if (proj) {
      proj.profiles = profiles.find(prof => prof.id === proj.client_id) || null
    }
    return p
  })

  const typedPayments = mappedPayments as unknown as PaymentWithProject[]


  // Stats calculation
  const totalRevenue = typedPayments.reduce((sum, p) => sum + Number(p.amount), 0)
  const monthlyRevenue = typedPayments
    .filter(p => {
      const date = new Date(p.created_at)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const last30DaysRevenue = typedPayments
    .filter(p => {
      const date = new Date(p.created_at)
      const now = new Date()
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
      return date >= thirtyDaysAgo
    })
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const recentTransactions = typedPayments.slice(0, 5)

  const stats = [
    {
      title: "Total Revenue",
      value: `₱${totalRevenue.toLocaleString()}`,
      description: "Lifetime earnings",
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Monthly Revenue",
      value: `₱${monthlyRevenue.toLocaleString()}`,
      description: "Current month",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Last 30 Days",
      value: `₱${last30DaysRevenue.toLocaleString()}`,
      description: "Rolling 30-day period",
      icon: Calendar,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Transactions",
      value: typedPayments.length.toString(),
      description: "Total successful payments",
      icon: CreditCard,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Transactions</h1>
            <p className="text-muted-foreground mt-2">
              Monitor revenue, payment history, and subscription performance.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Transactions Table */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Payment History</CardTitle>
                  <CardDescription>A detailed list of all processed payments.</CardDescription>
                </div>
                <div className="relative w-64 hidden md:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-9 h-9 text-xs"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-bold text-xs uppercase tracking-wider h-12">Date</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider h-12">Project / Client</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider h-12">Amount</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider h-12">Auto Renew</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider h-12">Status</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider h-12">Reference</TableHead>
                      <TableHead className="text-right font-bold text-xs uppercase tracking-wider h-12">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {typedPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-20">
                          <div className="flex flex-col items-center gap-2">
                            <div className="p-3 rounded-full bg-muted/50">
                              <CreditCard className="w-6 h-6 opacity-20" />
                            </div>
                            <p className="text-sm">No transactions recorded yet.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      typedPayments.map((p) => (
                        <TableRow key={p.id} className="group hover:bg-muted/30 transition-colors">
                          <TableCell className="whitespace-nowrap py-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-medium">
                                {new Date(p.created_at).toLocaleDateString('en-PH', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(p.created_at).toLocaleTimeString('en-PH', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-col min-w-[150px]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-sm text-foreground">
                                  {p.projects?.custom_domain || p.projects?.subdomain || 'Unknown'}
                                </span>
                                {p.projects?.custom_domain && (
                                  <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[9px] h-4 py-0 px-1.5">
                                    CUSTOM
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground truncate">{p.projects?.profiles?.email || 'Unknown Client'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="font-bold text-sm">
                              {p.currency} {Number(p.amount).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            {p.projects?.auto_renew ? (
                              <Badge className="bg-blue-500/10 text-blue-600 border-none font-bold text-[10px] py-0 px-2 h-5">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                ACTIVE
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground border-border/50 font-bold text-[10px] py-0 px-2 h-5 bg-muted/20">
                                <Clock className="w-3 h-3 mr-1" />
                                OFF
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[10px] py-0 px-2 h-5">
                              {p.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <code className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                              {(p.paymongo_payment_id || p.paymongo_link_id || '—').slice(0, 15)}...
                            </code>
                          </TableCell>
                          <TableCell className="text-right py-4">
                            {p.paymongo_payment_id && (
                              <Button asChild variant="ghost" size="sm" className="h-8 px-2 hover:bg-primary/10 hover:text-primary">
                                <Link
                                  href={`https://dashboard.paymongo.com/payments/${p.paymongo_payment_id}`}
                                  target="_blank"
                                  className="font-bold text-[10px] uppercase tracking-wider"
                                >
                                  PayMongo
                                  <ExternalLink className="ml-1.5 h-3 w-3" />
                                </Link>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
