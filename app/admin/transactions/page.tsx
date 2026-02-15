import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/Table'
import { 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Calendar,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

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

  // Fetch payments with project and client info
  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      *,
      projects (
        id,
        subdomain,
        profiles:client_id (
          email
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching payments:', error)
  }

  const typedPayments = (payments || []) as unknown as PaymentWithProject[]

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transaction Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor revenue, payment history, and subscription performance.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium">Total Revenue</p>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">₱{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime earnings
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium">Monthly Revenue</p>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">₱{monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Current month
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium">Last 30 Days</p>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">₱{last30DaysRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Rolling 30-day period
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium">Transactions</p>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{typedPayments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total successful payments
                </p>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Payment History</h2>
              <p className="text-sm text-muted-foreground">A detailed list of all processed payments.</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Project / Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typedPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                        No transactions recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    typedPayments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(p.created_at).toLocaleDateString('en-PH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{p.projects?.subdomain || 'Unknown Project'}</span>
                            <span className="text-xs text-muted-foreground">{p.projects?.profiles?.email || 'Unknown Client'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {p.currency} {Number(p.amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                            {p.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {p.paymongo_payment_id || p.paymongo_link_id || '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          {p.paymongo_payment_id && (
                             <Link 
                               href={`https://dashboard.paymongo.com/payments/${p.paymongo_payment_id}`}
                               target="_blank"
                               className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                             >
                               PayMongo <ExternalLink className="h-3 w-3" />
                             </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
