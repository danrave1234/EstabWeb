const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.sxedjyocmyqdxscrxtzx:8LM0t4hQ0IkiAeuY@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres', ssl: { rejectUnauthorized: false } });
const sql = `
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, avatar_url)
  VALUES (
    new.id,
    new.email,
    'client',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$;
`;
client.connect().then(() => client.query(sql)).then(() => { console.log('trigger updated'); client.end(); }).catch(e => { console.error(e.message); client.end(); });
