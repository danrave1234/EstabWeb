const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.sxedjyocmyqdxscrxtzx:8LM0t4hQ0IkiAeuY@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres', ssl: { rejectUnauthorized: false } });
client.connect()
  .then(() => client.query('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text'))
  .then(() => client.query("UPDATE profiles SET avatar_url = (SELECT raw_user_meta_data->>'avatar_url' FROM auth.users WHERE auth.users.id = profiles.id) WHERE avatar_url IS NULL"))
  .then(r => { console.log('done, rows updated:', r.rowCount); client.end(); })
  .catch(e => { console.error(e.message); client.end(); });
