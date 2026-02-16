import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function DbConnectionCheck() {
  const [status, setStatus] = useState('idle');
  const [details, setDetails] = useState(null);
  const [cleanupStatus, setCleanupStatus] = useState('idle');
  const [cleanupDetails, setCleanupDetails] = useState(null);
  const [clearAllStatus, setClearAllStatus] = useState('idle');
  const [clearAllDetails, setClearAllDetails] = useState(null);

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

  const clearOldData = async () => {
    setCleanupStatus('processing');
    setCleanupDetails(null);
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_PUBLIC_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

      if (!SUPABASE_URL || !SUPABASE_KEY) {
        setCleanupStatus('error');
        setCleanupDetails('Missing Supabase environment variables');
        return;
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

      // Calculate date 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const cutoffDate = sevenDaysAgo.toISOString();

      console.log('Clearing data older than 7 days (cutoff:', cutoffDate, ')');

      // Table configurations with their timestamp column names
      const tables = [
        { name: 'bank_statements', column: 'inserted_at' },
        { name: 'bank_transactions', column: 'inserted_at' },
        { name: 'documents', column: 'inserted_at' },
        { name: 'ingestion_jobs', column: 'inserted_at' },
        { name: 'loan_decisions', column: 'decided_at' },
        { name: 'loans', column: 'created_at' }
      ];

      let deletionSummary = '✓ Cleanup completed!\n\nDeleted records older than 7 days:\n';
      let totalDeleted = 0;

      // Delete from each table
      for (const table of tables) {
        try {
          const { count, error } = await supabase
            .from(table.name)
            .delete()
            .lt(table.column, cutoffDate)
            .select('id', { count: 'exact' });

          if (error) {
            console.warn(`Error deleting from ${table.name}:`, error);
            deletionSummary += `- ${table.name}: Error (${error.message})\n`;
          } else {
            const deletedCount = count || 0;
            totalDeleted += deletedCount;
            deletionSummary += `- ${table.name}: ${deletedCount} record(s) deleted\n`;
          }
        } catch (e) {
          console.warn(`Error deleting from ${table.name}:`, e);
          deletionSummary += `- ${table.name}: Exception\n`;
        }
      }

      deletionSummary += `\nCutoff date: ${cutoffDate}\nTotal records deleted: ${totalDeleted}`;

      setCleanupStatus('success');
      setCleanupDetails(deletionSummary);
    } catch (e) {
      console.error('Error during cleanup:', e);
      setCleanupStatus('error');
      setCleanupDetails('Error: ' + String(e));
    }
  };

  const clearAllData = async () => {
    setClearAllStatus('processing');
    setClearAllDetails(null);
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_PUBLIC_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

      if (!SUPABASE_URL || !SUPABASE_KEY) {
        setClearAllStatus('error');
        setClearAllDetails('Missing Supabase environment variables');
        return;
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

      console.log('Clearing ALL data from tables (respecting foreign key constraints)...');

      // Delete in order of foreign key dependencies (children before parents)
      // Each table configured with its correct timestamp column
      const tables = [
        { name: 'bank_transactions', column: 'inserted_at' },
        { name: 'gst_returns', column: 'inserted_at' },
        { name: 'bank_statements', column: 'inserted_at' },
        { name: 'gst_entities', column: 'inserted_at' },
        { name: 'bureau_records', column: 'inserted_at' },
        { name: 'ingestion_jobs', column: 'inserted_at' },
        { name: 'loan_decisions', column: 'decided_at' },
        { name: 'documents', column: 'inserted_at' },
        { name: 'loans', column: 'created_at' }
      ];

      let deletionSummary = '⚠️ All data cleared (respecting FK constraints)!\n\nRecords deleted (in order):\n';
      let totalDeleted = 0;

      // Delete ALL records from each table in correct order
      for (const table of tables) {
        try {
          // Delete all rows using a very old date filter that matches everything
          const { count, error } = await supabase
            .from(table.name)
            .delete()
            .gte(table.column, '1000-01-01') // Match all dates (all are >= year 1000)
            .select('id', { count: 'exact' });

          if (error) {
            console.warn(`Error deleting from ${table.name}:`, error);
            deletionSummary += `- ${table.name}: Error (${error.message})\n`;
          } else {
            const deletedCount = count || 0;
            totalDeleted += deletedCount;
            deletionSummary += `- ${table.name}: ${deletedCount} record(s) deleted\n`;
          }
        } catch (e) {
          console.warn(`Error deleting from ${table.name}:`, e);
          deletionSummary += `- ${table.name}: Exception (${String(e)})\n`;
        }
      }

      deletionSummary += `\nTotal records deleted: ${totalDeleted}\n\n✓ Ready for fresh start!`;

      setClearAllStatus('success');
      setClearAllDetails(deletionSummary);
    } catch (e) {
      console.error('Error during clearAll:', e);
      setClearAllStatus('error');
      setClearAllDetails('Error: ' + String(e));
    }
  };

  // Helper function for future use: clear data older than 7 days
  const clearOldDataByDays = async (days) => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - days);
    const cutoffDate = oldDate.toISOString();

    const tables = [
      { name: 'bank_statements', column: 'inserted_at' },
      { name: 'bank_transactions', column: 'inserted_at' },
      { name: 'documents', column: 'inserted_at' },
      { name: 'ingestion_jobs', column: 'inserted_at' },
      { name: 'loan_decisions', column: 'decided_at' },
      { name: 'loans', column: 'created_at' }
    ];

    // Note: This function is available for future use (e.g., clearOldDataByDays(7))
    console.log(`[Available] Clear data older than ${days} days using cutoff: ${cutoffDate}`);
  };

  return (
    <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6, display: 'inline-block' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button 
          onClick={checkConnection} 
          style={{ 
            padding: '8px 12px', 
            cursor: 'pointer',
            backgroundColor: status === 'ok' ? '#10b981' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
          disabled={status === 'checking'}
        >
          {status === 'checking' ? 'Checking...' : 'Check DB Connection'}
        </button>
        <button 
          onClick={clearOldData} 
          style={{ 
            padding: '8px 12px', 
            cursor: 'pointer',
            backgroundColor: cleanupStatus === 'success' ? '#ef4444' : '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
          disabled={cleanupStatus === 'processing'}
        >
          {cleanupStatus === 'processing' ? 'Clearing...' : 'Clear Old Data (7+ day)'}
        </button>
        <button 
          onClick={clearAllData} 
          style={{ 
            padding: '8px 12px', 
            cursor: 'pointer',
            backgroundColor: clearAllStatus === 'success' ? '#dc2626' : '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
          disabled={clearAllStatus === 'processing'}
          title="⚠️ This will delete ALL data from all tables. Use with caution!"
        >
          {clearAllStatus === 'processing' ? 'Clearing All...' : '⚠️ Clear All Data'}
        </button>
      </div>
      
      {/* DB Connection Status */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
          <strong>DB Status:</strong> {status}
          {details ? (
            <pre style={{ whiteSpace: 'pre-wrap', marginTop: 6, background: '#f8fafc', padding: 8, borderRadius: 4 }}>{details}</pre>
          ) : null}
        </div>
      </div>

      {/* Cleanup Status */}
      {cleanupStatus !== 'idle' && (
        <div style={{ fontFamily: 'monospace', fontSize: 13, borderTop: '1px solid #e5e7eb', paddingTop: 12, marginBottom: 12 }}>
          <strong>Cleanup Status (7+ day):</strong> {cleanupStatus}
          {cleanupDetails ? (
            <pre style={{ whiteSpace: 'pre-wrap', marginTop: 6, background: '#f8fafc', padding: 8, borderRadius: 4 }}>{cleanupDetails}</pre>
          ) : null}
        </div>
      )}

      {/* Clear All Status */}
      {clearAllStatus !== 'idle' && (
        <div style={{ fontFamily: 'monospace', fontSize: 13, borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
          <strong>Clear All Status:</strong> {clearAllStatus}
          {clearAllDetails ? (
            <pre style={{ whiteSpace: 'pre-wrap', marginTop: 6, background: '#fef2f2', padding: 8, borderRadius: 4, borderLeft: '4px solid #dc2626' }}>{clearAllDetails}</pre>
          ) : null}
        </div>
      )}
    </div>
  );
}
