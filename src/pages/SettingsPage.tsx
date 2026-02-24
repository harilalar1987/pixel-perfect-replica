import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DbConnectionCheck from '@/components/DbConnectionCheck';
import { Home } from 'lucide-react';

export default function SettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*') as any;
      if (error) {
        setError('Failed to fetch users: ' + error.message);
        setLoading(false);
        return;
      }
      const list = (data || []).map((p: any) => ({
        ...p,
        approved: typeof p.approved === 'undefined' ? false : p.approved,
      }));
      setUsers(list);
    } catch (e) {
      setError('Error fetching users: ' + String(e));
    } finally {
      setLoading(false);
    }
  };

  // Admin tool: fetch audit logs (placeholder)
  const fetchAuditLogs = async () => {
    setLogsLoading(true);
    setLogsError(null);
    try {
      // Placeholder: simulate logs
      setTimeout(() => {
        setAuditLogs([
          { id: 1, action: 'User approved', user: 'admin', timestamp: new Date().toISOString() },
          { id: 2, action: 'Loan created', user: 'analyst', timestamp: new Date().toISOString() },
        ]);
        setLogsLoading(false);
      }, 1000);
    } catch (e) {
      setLogsError('Failed to fetch logs: ' + String(e));
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const updateApproval = async (id: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ approved })
        .eq('id', id) as any;

      if (error) {
        toast.error('Failed to update user');
        console.error(error);
        return;
      }

      toast.success('Updated');
      fetchPendingUsers();
    } catch (e) {
      console.error(e);
      toast.error('Error updating user');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center mb-4">
          <Home className="mr-2 text-primary" size={28} />
          <h1 className="font-display text-2xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Approvals</TabsTrigger>
            <TabsTrigger value="db">DB Settings</TabsTrigger>
            <TabsTrigger value="admin">Admin Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="p-4">
              <h2 className="font-semibold">Pending Users</h2>
              <p className="text-sm text-muted-foreground mb-4">Approve or reject new accounts.</p>

              {loading ? (
                <p className="text-blue-600">Loading users...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                <div className="space-y-3">
                  {users.length === 0 ? (
                    <p className="text-muted-foreground">No users found.</p>
                  ) : (
                    users.map((u) => (
                      <div key={u.id} className="flex items-center justify-between bg-card border border-border rounded p-3">
                        <div>
                          <div className="font-medium">{u.full_name || 'Unnamed'}</div>
                          <div className="text-sm text-muted-foreground">User ID: {u.user_id}</div>
                          <div className="text-sm text-muted-foreground">Approved: {String(u.approved)}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
                            onClick={async () => {
                              await updateApproval(u.id, true);
                              toast.info('CPV file creation will be implemented soon.');
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1"
                            onClick={() => updateApproval(u.id, false)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="db">
            <Card className="p-4">
              <h2 className="font-semibold">Database Settings</h2>
              <p className="text-sm text-muted-foreground mb-4">DB connectivity and cleanup tools.</p>
              <DbConnectionCheck />
              <div className="mt-6">
                <Button
                  onClick={async () => {
                    // Check if credits_usage table exists
                    const { data, error } = await supabase.rpc('check_table_exists', { table_name: 'credits_usage' });
                    if (error) {
                      toast.error('Error checking table: ' + error.message);
                      return;
                    }
                    if (data && data.exists) {
                      toast.success('credits_usage table already exists!');
                      return;
                    }
                    // If not exists, run SQL to create
                    const sql = `\
create table if not exists credits_usage (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(user_id) on delete cascade,
  used integer not null default 0,
  last_used_at timestamp with time zone default now(),
  reset_at timestamp with time zone,
  context text
);
`;
                    // Supabase does not allow running arbitrary SQL from client, so show script for manual use
                    toast.info('Table does not exist. Please run the following SQL in Supabase SQL editor:', {
                      description: sql
                    });
                  }}
                  className="bg-blue-600 text-white font-medium"
                >
                  Check/Create credits_usage Table
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Admin Tools: Audit Logs */}
          <TabsContent value="admin">
            <Card className="p-4">
              <h2 className="font-semibold">Audit Logs (Admin)</h2>
              <Button onClick={fetchAuditLogs} className="mb-4">Fetch Audit Logs</Button>
              {logsLoading ? (
                <p className="text-blue-600">Loading logs...</p>
              ) : logsError ? (
                <p className="text-red-600">{logsError}</p>
              ) : (
                <ul className="text-sm">
                  {auditLogs.map((log) => (
                    <li key={log.id} className="mb-2">
                      <span className="font-medium">{log.action}</span> by <span className="text-muted-foreground">{log.user}</span> <span className="text-xs">({log.timestamp})</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
