import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select } from './ui/select';
import { useSyncLogs } from '../hooks/useQuery';
import { AlertCircle, Info, AlertTriangle, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import { SyncLog } from '../types/integration';

interface LogsViewerProps {
  jobId: string | null;
  onClose: () => void;
}

export function LogsViewer({ jobId, onClose }: LogsViewerProps) {
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const { data: logs } = useSyncLogs(jobId);

  const filteredLogs = logs?.filter((log) => {
    if (levelFilter === 'all') return true;
    return log.level === levelFilter;
  });

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const getLevelIcon = (level: SyncLog['level']) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getLevelBadge = (level: SyncLog['level']) => {
    switch (level) {
      case 'info':
        return <Badge variant="outline">Info</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sync-logs-${jobId}.json`;
    link.click();
  };

  if (!jobId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sync Logs</h2>
          <p className="text-muted-foreground mt-2">
            Select a sync job from the dashboard to view its logs
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sync Logs</h2>
          <p className="text-muted-foreground mt-2">Job ID: {jobId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
          <Button variant="outline" onClick={onClose}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter by Level:</label>
          <Select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value as any)}>
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredLogs?.length || 0} of {logs?.length || 0} logs
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredLogs?.map((log) => (
              <div key={log.id} className="border rounded-md">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleLogExpansion(log.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getLevelIcon(log.level)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{log.message}</span>
                        {getLevelBadge(log.level)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDateTime(log.timestamp)}
                        {log.recordId && ` • Record: ${log.recordId}`}
                        {log.entityType && ` • ${log.entityType}`}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedLogs.has(log.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {expandedLogs.has(log.id) && (
                  <div className="px-4 pb-4 space-y-3">
                    {log.details && (
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                          Details
                        </div>
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}

                    {log.stackTrace && (
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                          Stack Trace
                        </div>
                        <pre className="text-xs overflow-x-auto font-mono">
                          {log.stackTrace}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {(!filteredLogs || filteredLogs.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No logs found for the selected filter
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
