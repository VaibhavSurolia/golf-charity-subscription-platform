
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('.env.local')) {
  const env = dotenv.parse(fs.readFileSync('.env.local'));
  process.env.NEXT_PUBLIC_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: payouts, error } = await supabase.from('charity_payouts').select('*').limit(10);
  console.log('--- Historical Payouts ---');
  console.log(JSON.stringify(payouts, null, 2));
  
  const { data: users, error: uErr } = await supabase.from('users').select('id, name, charity_id').limit(5);
  console.log('--- Users ---');
  console.log(JSON.stringify(users, null, 2));

  if (error || uErr) console.error('Errors:', error, uErr);
}

checkData();
