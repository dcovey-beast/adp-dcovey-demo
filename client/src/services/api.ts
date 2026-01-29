import {
  SalesforceConnection,
  SalesforceMetadata,
  AddeparEntity,
  FieldMapping,
  SyncJob,
  SyncLog,
} from '../types/integration';

const API_BASE_URL = '/api';

// Salesforce API
export const salesforceAPI = {
  connect: async (environment: 'production' | 'sandbox'): Promise<SalesforceConnection> => {
    const response = await fetch(`${API_BASE_URL}/salesforce/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ environment }),
    });
    return response.json();
  },

  getStatus: async (): Promise<SalesforceConnection> => {
    const response = await fetch(`${API_BASE_URL}/salesforce/status`);
    return response.json();
  },

  getMetadata: async (): Promise<SalesforceMetadata> => {
    const response = await fetch(`${API_BASE_URL}/salesforce/metadata`);
    return response.json();
  },

  disconnect: async (): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/salesforce/disconnect`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Addepar API
export const addeparAPI = {
  getEntities: async (): Promise<AddeparEntity[]> => {
    const response = await fetch(`${API_BASE_URL}/addepar/entities`);
    return response.json();
  },
};

// Mappings API
export const mappingsAPI = {
  getAll: async (): Promise<FieldMapping[]> => {
    const response = await fetch(`${API_BASE_URL}/mappings`);
    return response.json();
  },

  create: async (mapping: Omit<FieldMapping, 'id' | 'createdAt'>): Promise<FieldMapping> => {
    const response = await fetch(`${API_BASE_URL}/mappings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapping),
    });
    return response.json();
  },

  update: async (id: string, updates: Partial<FieldMapping>): Promise<FieldMapping> => {
    const response = await fetch(`${API_BASE_URL}/mappings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/mappings/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Sync API
export const syncAPI = {
  trigger: async (): Promise<SyncJob> => {
    const response = await fetch(`${API_BASE_URL}/sync/trigger`, {
      method: 'POST',
    });
    return response.json();
  },

  getStatus: async (): Promise<SyncJob | { status: 'idle' }> => {
    const response = await fetch(`${API_BASE_URL}/sync/status`);
    return response.json();
  },

  getHistory: async (): Promise<SyncJob[]> => {
    const response = await fetch(`${API_BASE_URL}/sync/history`);
    return response.json();
  },

  getLogs: async (jobId: string): Promise<SyncLog[]> => {
    const response = await fetch(`${API_BASE_URL}/sync/logs/${jobId}`);
    return response.json();
  },

  retry: async (jobId: string, recordIds?: string[]): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/sync/retry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, recordIds }),
    });
    return response.json();
  },
};
