import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Users, User, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { BureauRelationship } from '@/types/bureau';

interface BureauRelationshipsProps {
  relationships: BureauRelationship[];
}

const getRelationshipIcon = (relationship: string) => {
  switch (relationship) {
    case 'Proprietor':
    case 'Director':
      return Building2;
    case 'Partner':
      return Users;
    default:
      return User;
  }
};

const getRelationshipColor = (relationship: string) => {
  switch (relationship) {
    case 'Proprietor':
      return 'bg-primary/10 text-primary border-primary';
    case 'Director':
      return 'bg-accent/10 text-accent-foreground border-accent';
    case 'Partner':
      return 'bg-status-pass/10 text-status-pass border-status-pass';
    default:
      return 'bg-secondary text-muted-foreground';
  }
};

export function BureauRelationships({ relationships }: BureauRelationshipsProps) {
  const withBureauData = relationships.filter(r => r.bureauDataAvailable);
  const withoutBureauData = relationships.filter(r => !r.bureauDataAvailable);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <Users className="h-5 w-5 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{relationships.length}</p>
              <p className="text-xs text-muted-foreground">Total Relationships</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-5 w-5 mx-auto text-status-pass mb-2" />
              <p className="text-2xl font-bold text-status-pass">{withBureauData.length}</p>
              <p className="text-xs text-muted-foreground">Bureau Data Available</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-5 w-5 mx-auto text-status-warning mb-2" />
              <p className="text-2xl font-bold text-status-warning">{withoutBureauData.length}</p>
              <p className="text-xs text-muted-foreground">Bureau Data Missing</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Relationship Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {relationships.map((rel, index) => {
          const Icon = getRelationshipIcon(rel.relationship);
          return (
            <motion.div
              key={rel.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-border bg-card hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{rel.fullName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getRelationshipColor(rel.relationship)}>
                            {rel.relationship}
                          </Badge>
                          <Badge variant="outline" className={rel.status === 'Active' ? 'bg-status-pass/10 text-status-pass' : 'bg-secondary'}>
                            {rel.status}
                          </Badge>
                        </div>
                        {rel.dateOfBirth && (
                          <p className="text-xs text-muted-foreground mt-2">DOB: {rel.dateOfBirth}</p>
                        )}
                        {rel.type !== 'N/A' && (
                          <p className="text-xs text-muted-foreground">Type: {rel.type}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      {rel.bureauDataAvailable ? (
                        <Badge className="bg-status-pass text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Bureau Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-status-warning/10 text-status-warning border-status-warning">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Not Available
                        </Badge>
                      )}
                    </div>
                  </div>

                  {!rel.bureauDataAvailable && (
                    <div className="mt-3 p-2 rounded bg-secondary/50">
                      <p className="text-xs text-muted-foreground">
                        Individual credit scores and facilities are not available in the current bureau report. 
                        This information would be populated when individual bureau data is uploaded.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Risk Note */}
      {withoutBureauData.length > 0 && (
        <Card className="border-border bg-status-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-status-warning mt-0.5" />
              <div>
                <p className="font-medium text-sm">Bureau Data Missing</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {withoutBureauData.length} relationship(s) do not have individual bureau data available. 
                  This may delay final credit approval or trigger conditional approvals requiring additional documentation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
