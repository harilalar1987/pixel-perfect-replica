import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DbConnectionCheck from '@/components/DbConnectionCheck';

export default function SettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      // Fetch all profiles and include the 'approved' flag if present
      const { data, error } = await supabase
        .from('profiles')
        .select('*') as any;

      if (error) {
        toast.error('Failed to fetch users');
        console.error(error);
        setLoading(false);
        return;
      }

      // If `approved` is missing, treat as not approved
      const list = (data || []).map((p: any) => ({
        ...p,
        approved: typeof p.approved === 'undefined' ? false : p.approved,
      }));

      setUsers(list);
    } catch (e) {
      console.error('Error fetching profiles', e);
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
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
        <h1 className="font-display text-2xl font-bold mb-4">Settings</h1>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Approvals</TabsTrigger>
            <TabsTrigger value="db">DB Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="p-4">
              <h2 className="font-semibold">Pending Users</h2>
              <p className="text-sm text-muted-foreground mb-4">Approve or reject new accounts.</p>

              {loading ? (
                <p>Loading...</p>
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
                          <button
                            className="btn-approve px-3 py-1 rounded bg-green-600 text-white"
                            onClick={() => updateApproval(u.id, true)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-reject px-3 py-1 rounded bg-red-600 text-white"
                            onClick={() => updateApproval(u.id, false)}
                          >
                            Reject
                          </button>
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
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
