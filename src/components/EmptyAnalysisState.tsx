import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';

interface EmptyAnalysisStateProps {
  module: string;
  description?: string;
}

export function EmptyAnalysisState({ module, description }: EmptyAnalysisStateProps) {
  return (
    <Card className="border-border bg-card shadow-card">
      <CardContent className="py-16 flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          No {module} Data Available
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {description || `Upload the relevant ${module.toLowerCase()} documents to see the analysis. Data will be automatically extracted and displayed here.`}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Supported formats: PDF, CSV, XLSX</span>
        </div>
      </CardContent>
    </Card>
  );
}
