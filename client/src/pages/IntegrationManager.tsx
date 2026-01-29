import { useState } from 'react';
import { ConnectionSetup } from '../components/ConnectionSetup';
import { FieldMapper } from '../components/FieldMapper';
import { SyncDashboard } from '../components/SyncDashboard';
import { LogsViewer } from '../components/LogsViewer';
import { useSalesforceStatus } from '../hooks/useQuery';
import { Button } from '../components/ui/button';
import { Link2, Map, Activity, FileText } from 'lucide-react';

type Tab = 'connection' | 'mapping' | 'sync' | 'logs';

export function IntegrationManager() {
  const [activeTab, setActiveTab] = useState<Tab>('connection');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { data: salesforceStatus } = useSalesforceStatus();

  const handleViewLogs = (jobId: string) => {
    setSelectedJobId(jobId);
    setActiveTab('logs');
  };

  const handleCloseLogs = () => {
    setSelectedJobId(null);
    setActiveTab('sync');
  };

  const tabs = [
    { id: 'connection' as Tab, label: 'Connection', icon: Link2 },
    { id: 'mapping' as Tab, label: 'Field Mapping', icon: Map, disabled: !salesforceStatus?.connected },
    { id: 'sync' as Tab, label: 'Sync & Monitor', icon: Activity, disabled: !salesforceStatus?.connected },
    { id: 'logs' as Tab, label: 'Logs', icon: FileText, disabled: !salesforceStatus?.connected },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Addepar</h1>
              <p className="text-sm text-muted-foreground">Integration Manager</p>
            </div>
            {salesforceStatus?.connected && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Connected to Salesforce</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'connection' && <ConnectionSetup />}
        {activeTab === 'mapping' && <FieldMapper />}
        {activeTab === 'sync' && <SyncDashboard onViewLogs={handleViewLogs} />}
        {activeTab === 'logs' && <LogsViewer jobId={selectedJobId} onClose={handleCloseLogs} />}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-6 py-4">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 Addepar. Mock Integration Platform powered by MuleSoft.
          </p>
        </div>
      </footer>
    </div>
  );
}
