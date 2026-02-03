import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function DbConnectionCheck() {
  const [status, setStatus] = useState('idle');
  const [details, setDetails] = useState(null);

  const checkConnection = async () => {
    setStatus('checking');
    setDetails(null);
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_PUBLIC_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

      const keyEnvName = import.meta.env.VITE_SUPABASE_ANON_KEY
        ? 'VITE_SUPABASE_ANON_KEY'
        : import.meta.env.VITE_SUPABASE_KEY
        ? 'VITE_SUPABASE_KEY'
        : import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
        ? 'VITE_SUPABASE_PUBLISHABLE_KEY'
        : import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
        ? 'VITE_PUBLIC_SUPABASE_ANON_KEY'
        : 'none';

      if (!SUPABASE_URL || !SUPABASE_KEY) {
        const msg = 'Missing VITE_SUPABASE_URL or SUPABASE key in your environment. See docs.';
        console.error(msg);
        setStatus('missing_env');
        setDetails(msg + '\nDetected key variable: ' + keyEnvName);
        return;
      }

      console.log('Creating Supabase client with URL:', SUPABASE_URL, 'using key env:', keyEnvName);
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

      console.log('Querying loans table (limit 1) to test connectivity...');
      const { data, error } = await supabase.from('loans').select('*').limit(1);

      if (error) {
        console.error('Error querying loans table:', error);
        setStatus('error');
        setDetails(JSON.stringify(error));
        return;
      }

      console.log('Query succeeded. Sample data:', data);
      setStatus('ok');
      setDetails(Array.isArray(data) ? JSON.stringify(data.slice(0, 5), null, 2) : String(data));
    } catch (e) {
      console.error('Unexpected error during DB check:', e);
      setStatus('exception');
      setDetails(String(e));
    }
  };

  return (
    <div style={{ padding: 8, border: '1px solid #e5e7eb', borderRadius: 6, display: 'inline-block' }}>
      <button onClick={checkConnection} style={{ padding: '8px 12px', cursor: 'pointer' }}>
        Check DB Connection
      </button>
      <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 13 }}>
        <strong>Status:</strong> {status}
        {details ? (
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 6, background: '#f8fafc', padding: 8, borderRadius: 4 }}>{details}</pre>
        ) : null}
      </div>
    </div>
  );
}
