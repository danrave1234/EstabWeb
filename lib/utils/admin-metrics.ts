import { SupabaseClient } from '@supabase/supabase-js'
import { getPlansConfig } from '@/lib/plans-config-server'
import { unstable_cache } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'

export interface AdminMetrics {
    mrrCentavos: number
    totalRevenueCentavos: number
    activeSubscriptions: number
    trialSubscriptions: number
    totalProjects: number
    totalUsers: number
}

// Internal cached fetcher
const getCachedAdminMetrics = unstable_cache(
    async () => {
        try {
            const supabase = createServiceClient()

            const [
                totalUsersRes,
                totalProjectsRes,
                paymentsRes,
                projectsRes,
                plansConfig
            ] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('projects').select('*', { count: 'exact', head: true }),
                supabase.from('payments').select('amount').eq('status', 'paid'),
                supabase.from('projects').select('subscription_status, subscription_plan_id, subscription_interval').in('subscription_status', ['active', 'trial']),
                getPlansConfig()
            ])

            const totalUsers = totalUsersRes.count || 0
            const totalProjects = totalProjectsRes.count || 0
            const payments = paymentsRes.data || []
            const projects = projectsRes.data || []
            const PLANS = plansConfig.PLANS

            const totalRevenueCentavos = payments.reduce((acc: number, p: any) => acc + (p.amount || 0), 0)

            let activeSubscriptions = 0
            let trialSubscriptions = 0
            let mrrCentavos = 0

            for (const proj of projects) {
                if (proj.subscription_status === 'trial') {
                    trialSubscriptions++
                    continue
                }

                if (proj.subscription_status === 'active') {
                    activeSubscriptions++

                    const planId = proj.subscription_plan_id || 'basic'
                    const plan = PLANS[planId] || PLANS.basic

                    if (proj.subscription_interval === 'yearly') {
                        const yearly = (plan as any).yearlyAmount || 0
                        mrrCentavos += Math.round(yearly / 12)
                    } else {
                        const monthly = (plan as any).recurringAmount || 0
                        mrrCentavos += monthly
                    }
                }
            }

            return {
                mrrCentavos,
                totalRevenueCentavos,
                activeSubscriptions,
                trialSubscriptions,
                totalProjects,
                totalUsers,
            }
        } catch (error) {
            console.error('Error fetching admin metrics:', error)
            return {
                mrrCentavos: 0,
                totalRevenueCentavos: 0,
                activeSubscriptions: 0,
                trialSubscriptions: 0,
                totalProjects: 0,
                totalUsers: 0,
            }
        }
    },
    ['admin-metrics-cache'],
    {
        revalidate: 300, // 5 minutes
        tags: ['admin-metrics']
    }
)

export async function getAdminMetrics(supabase: SupabaseClient): Promise<AdminMetrics> {
    // We ignore the passed supabase client because unstable_cache 
    // requires serializable arguments and closure purity. 
    // The inner function will construct its own client.
    return getCachedAdminMetrics()
}
