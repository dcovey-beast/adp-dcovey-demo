export interface SalesforceConnection {
  connected: boolean;
  orgName?: string;
  orgId?: string;
  edition?: string;
  username?: string;
  instanceUrl?: string;
  connectedAt?: string;
}

export interface SalesforceField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

export interface SalesforceObject {
  name: string;
  label: string;
  fields: SalesforceField[];
}

export interface SalesforceMetadata {
  objects: SalesforceObject[];
}

export interface AddeparEntity {
  type: string;
  label: string;
  attributes: AddeparAttribute[];
}

export interface AddeparAttribute {
  name: string;
  label: string;
  type: string;
  description?: string;
}

export interface FieldMapping {
  id: string;
  addeparEntity: string;
  addeparField: string;
  salesforceObject: string;
  salesforceField: string;
  syncDirection: 'toSalesforce' | 'toAddepar' | 'bidirectional';
  conflictResolution: 'addepar-wins' | 'salesforce-wins' | 'manual';
  createdAt: string;
}

export interface SyncJob {
  id: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  progress: number;
  stats: {
    totalRecords: number;
    newRecords: number;
    updatedRecords: number;
    failedRecords: number;
  };
}

export interface SyncLog {
  id: string;
  jobId: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  recordId?: string;
  entityType?: string;
  details?: any;
  stackTrace?: string;
}
