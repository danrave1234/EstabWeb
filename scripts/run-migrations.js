const { createClient } = require('@supabase/supabase-js');

// Use service role key if available, otherwise anon key
const supabaseUrl = 'https://sxedjyocmyqdxscrxtzx.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_2DSubgmznvyKbHfV_wRlGw_l90dlep1';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  console.log('Running migrations via Supabase...\n');

  // Migration 006
  const m006 = await supabase.from('projects').select('renewal_link').limit(1);
  if (m006.error && m006.error.message.includes('renewal_link')) {
    console.log('006: renewal_link column missing, needs manual migration in Supabase SQL editor');
  } else {
    console.log('006: renewal_link column already exists ✓');
  }

  // Migration 007
  const m007 = await supabase.from('projects').select('paymongo_customer_id').limit(1);
  if (m007.error && m007.error.message.includes('paymongo_customer_id')) {
    console.log('007: paymongo_customer_id column missing, needs manual migration in Supabase SQL editor');
  } else {
    console.log('007: paymongo_customer_id column already exists ✓');
  }

  // Check all subscription columns
  const check = await supabase.from('projects').select('renewal_link, renewal_link_id, renewal_link_created_at, paymongo_customer_id, paymongo_subscription_id, paymongo_plan_id').limit(1);
  if (check.error) {
    console.log('\nColumn check error:', check.error.message);
    console.log('\nMissing columns detected. Please run the following SQL in Supabase SQL Editor:');
    console.log('---');
    console.log('-- Migration 006');
    console.log('ALTER TABLE projects ADD COLUMN IF NOT EXISTS renewal_link text, ADD COLUMN IF NOT EXISTS renewal_link_id text, ADD COLUMN IF NOT EXISTS renewal_link_created_at timestamptz;');
    console.log('-- Migration 007');
    console.log('ALTER TABLE projects ADD COLUMN IF NOT EXISTS paymongo_customer_id text, ADD COLUMN IF NOT EXISTS paymongo_subscription_id text, ADD COLUMN IF NOT EXISTS paymongo_plan_id text;');
    console.log('---');
  } else {
    console.log('\nAll migration columns present ✓');
    console.log('Sample row:', JSON.stringify(check.data));
  }
}

runMigrations().catch(console.error);
