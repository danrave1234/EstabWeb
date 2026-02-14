const { Client } = require('pg');
const client = new Client({ 
  connectionString: "postgresql://postgres.sxedjyocmyqdxscrxtzx:8LM0t4hQ0IkiAeuY@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});
console.log('Connecting...');
client.connect()
  .then(() => {
    console.log('Connected. Inserting...');
    return client.query("INSERT INTO profiles (id, email, role) VALUES ('dc63fb09-2950-43aa-9c91-a5c172ff62a4', 'danravekeh123@gmail.com', 'client') ON CONFLICT DO NOTHING");
  })
  .then(() => {
    console.log('Success');
    process.exit(0);
  })
  .catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
  });
