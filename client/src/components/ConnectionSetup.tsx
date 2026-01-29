import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select } from './ui/select';
import { useSalesforceStatus, useSalesforceConnect } from '../hooks/useQuery';
import { CheckCircle2, Loader2, Link as LinkIcon } from 'lucide-react';
import { formatDateTime } from '../lib/utils';

export function ConnectionSetup() {
  const [environment, setEnvironment] = useState<'production' | 'sandbox'>('production');
  const { data: status } = useSalesforceStatus();
  const connectMutation = useSalesforceConnect();

  const handleConnect = async () => {
    await connectMutation.mutateAsync(environment);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Connection Setup</h2>
        <p className="text-muted-foreground mt-2">
          Connect your Salesforce organization to enable data synchronization
        </p>
      </div>

      {!status?.connected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect to Salesforce</CardTitle>
            <CardDescription>
              Select your Salesforce environment and authorize the connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Environment</label>
              <Select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as 'production' | 'sandbox')}
                disabled={connectMutation.isPending}
              >
                <option value="production">Production</option>
                <option value="sandbox">Sandbox</option>
              </Select>
            </div>
            <Button
              onClick={handleConnect}
              disabled={connectMutation.isPending}
              className="w-full"
            >
              {connectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Connect to Salesforce
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Connected Organization</CardTitle>
                <CardDescription>Your Salesforce organization is connected</CardDescription>
              </div>
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Organization Name</p>
                <p className="text-base font-medium">{status.orgName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Edition</p>
                <p className="text-base font-medium">{status.edition}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Connected User</p>
                <p className="text-base font-medium">{status.username}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Connected At</p>
                <p className="text-base font-medium">
                  {status.connectedAt ? formatDateTime(status.connectedAt) : 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Instance URL</p>
                <p className="text-base font-medium text-blue-600 break-all">{status.instanceUrl}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Organization ID</p>
                <p className="text-base font-mono text-sm">{status.orgId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
