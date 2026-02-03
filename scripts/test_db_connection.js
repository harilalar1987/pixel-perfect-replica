// Diagnostic script to test database connectivity (Supabase). Run with:
//   npm install dotenv --save-dev (if you want to use a .env file)
//   node -r dotenv/config scripts/test_db_connection.js
// Optionally append --insert to attempt a test insert and cleanup.

(async () => {
  try {
    // Try loading dotenv if present
    try { await import('dotenv/config'); } catch (e) {}

    const { createClient } = await import('@supabase/supabase-js');

    // Accept both server-side names and VITE-prefixed envs used by the frontend dev setup
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('Missing Supabase environment variables. The diagnostic needs a URL and a key.');
      console.error('Detected env vars (partial):', Object.keys(process.env).filter(k => /SUPABASE|VITE_SUPABASE/i.test(k)).join(', ') || '(none)');
      console.error('\nQuick fixes:');
      console.error('  • Add these to your .env: SUPABASE_URL and SUPABASE_ANON_KEY OR VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
      console.error("  • Or run inline: node scripts/test_db_connection.js with env vars:\n      SUPABASE_URL=https://xyz.supabase.co SUPABASE_ANON_KEY=anon_key node scripts/test_db_connection.js");
      console.error('\nRequired keys: SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY).');
      process.exit(1);
    }

    console.log('Supabase URL:', SUPABASE_URL);

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

    console.log('Attempting to query the "loans" table...');

    const { data, error, count } = await supabase.from('loans').select('*', { count: 'exact' });

    if (error) {
      console.error('Error querying loans table:');
      console.error(error);

      // Common diagnostics
      if (error.message && error.message.toLowerCase().includes('relation')) {
        console.error('It looks like the "loans" table might not exist or the DB user lacks privileges.');
      }

      process.exit(1);
    }

    console.log('Query successful. Row count:', count ?? (Array.isArray(data) ? data.length : 'unknown'));
    if (Array.isArray(data)) {
      console.log('Sample rows (up to 5):', data.slice(0, 5));
      const sample = data[0];
      if (sample && typeof sample === 'object') {
        console.log('Detected columns:', Object.keys(sample).join(', '));
      } else {
        console.log('No sample row to infer columns from. Table may be empty.');
      }
    }

    // Optional insert test
    if (process.argv.includes('--insert')) {
      console.log('Attempting a test insert into "loans" (this will try to delete the inserted row afterwards).');
      // NOTE: Adjust fields below if your schema differs. This is a safe minimal test but may fail if required fields differ.
      const testRow = { applicant_name: 'diag_test', amount: 1 };
      try {
        const { data: insData, error: insErr } = await supabase.from('loans').insert(testRow).select();
        if (insErr) {
          console.error('Insert error:', insErr);
        } else {
          console.log('Insert succeeded:', insData);
          const id = insData && insData[0] && (insData[0].id || insData[0].loan_id);
          if (id) {
            const { error: delErr } = await supabase.from('loans').delete().eq('id', id);
            if (delErr) console.error('Cleanup delete error:', delErr);
            else console.log('Cleanup delete succeeded.');
          } else {
            console.log('Could not determine inserted row id for cleanup; you may need to remove the test row manually.');
          }
        }
      } catch (e) {
        console.error('Unexpected error during insert test:', e);
      }
    }

    console.log('Diagnostic script completed successfully.');
    process.exit(0);
  } catch (e) {
    console.error('Fatal error during DB diagnostic:', e);
    process.exit(2);
  }
})();
