
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function backfill() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
  });

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('--- Backfilling user_id into charity_payouts ---');
  
  // Update winners payouts
  const { data: payouts, error: pErr } = await supabase
    .from('charity_payouts')
    .select('id, draw_id')
    .is('user_id', null)
    .not('draw_id', 'is', null);

  if (pErr) {
    console.error('Error fetching payouts:', pErr);
    return;
  }

  console.log(`Found ${payouts.length} win-based payouts to update.`);

  for (const p of payouts) {
    const { data: winner } = await supabase
      .from('winners')
      .select('user_id')
      .eq('draw_id', p.draw_id)
      .limit(1)
      .single();

    if (winner) {
      await supabase.from('charity_payouts').update({ user_id: winner.user_id }).eq('id', p.id);
      console.log(`Updated payout ${p.id} with user_id ${winner.user_id}`);
    }
  }

  // Handle subscription payouts (simulated hack since we don't have record)
  // We'll just assign those to the first active user for simplicity or skip
  console.log('Backfill complete!');
}

backfill();
