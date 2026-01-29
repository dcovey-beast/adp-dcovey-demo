import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useSyncStatus, useSyncHistory, useTriggerSync } from '../hooks/useQuery';
import { Play, RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { formatDateTime, formatDuration } from '../lib/utils';
import { SyncJob } from '../types/integration';

interface SyncDashboardProps {
  onViewLogs: (jobId: string) => void;
}

export function SyncDashboard({ onViewLogs }: SyncDashboardProps) {
  const { data: status } = useSyncStatus();
  const { data: history } = useSyncHistory();
  const triggerSync = useTriggerSync();

  const isRunning = status && 'progress' in status && status.status === 'running';
  const currentJob = status && 'progress' in status ? (status as SyncJob) : null;

  const handleTriggerSync = async () => {
    await triggerSync.mutateAsync();
  };

  const getStatusBadge = (status: SyncJob['status']) => {
    switch (status) {
      case 'running':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="h-3 w-3 animate-spin" />
            Running
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sync Dashboard</h2>
          <p className="text-muted-foreground mt-2">
            Monitor and manage data synchronization between Addepar and Salesforce
          </p>
        </div>
        <Button onClick={handleTriggerSync} disabled={isRunning || triggerSync.isPending}>
          <Play className="mr-2 h-4 w-4" />
          Trigger Sync
        </Button>
      </div>

      {/* Current Sync Status */}
      {currentJob && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Sync Job</CardTitle>
              {getStatusBadge(currentJob.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentJob.status === 'running' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{Math.round(currentJob.progress)}%</span>
                </div>
                <Progress value={currentJob.progress} />
              </div>
            )}

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{currentJob.stats.totalRecords}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">New</p>
                <p className="text-2xl font-bold text-green-600">{currentJob.stats.newRecords}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Updated</p>
                <p className="text-2xl font-bold text-blue-600">{currentJob.stats.updatedRecords}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{currentJob.stats.failedRecords}</p>
              </div>
            </div>

            {currentJob.status === 'completed' && currentJob.duration && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{formatDuration(currentJob.duration)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Historical Sync Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Sync History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Started</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">New</TableHead>
                <TableHead className="text-right">Updated</TableHead>
                <TableHead className="text-right">Failed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history?.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{formatDateTime(job.startTime)}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>
                    {job.duration ? formatDuration(job.duration) : '-'}
                  </TableCell>
                  <TableCell className="text-right">{job.stats.totalRecords}</TableCell>
                  <TableCell className="text-right text-green-600">
                    {job.stats.newRecords}
                  </TableCell>
                  <TableCell className="text-right text-blue-600">
                    {job.stats.updatedRecords}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {job.stats.failedRecords}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewLogs(job.id)}
                    >
                      View Logs
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
