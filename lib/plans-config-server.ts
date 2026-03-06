import { createClient } from "@/lib/supabase/server"
import { PLANS as DEFAULT_PLANS, ENABLE_ANNUAL_PLANS as DEFAULT_ENABLE_ANNUAL } from "@/config/plans"

export async function getPlansConfig() {
    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from("site_config")
            .select("payload")
            .eq("key", "plans")
            .single()

        if (data && data.payload) {
            return {
                PLANS: (data.payload as any).PLANS || DEFAULT_PLANS,
                ENABLE_ANNUAL_PLANS: (data.payload as any).ENABLE_ANNUAL_PLANS ?? DEFAULT_ENABLE_ANNUAL
            }
        }
    } catch (e) {
        // console.error(e)
    }

    return { PLANS: DEFAULT_PLANS, ENABLE_ANNUAL_PLANS: DEFAULT_ENABLE_ANNUAL }
}
