import { faker } from '@faker-js/faker';
import { SyncJob, SyncLog } from '../types';

export const generateSyncLogs = (job: SyncJob): SyncLog[] => {
  const logs: SyncLog[] = [];
  const baseTime = new Date(job.startTime).getTime();
  
  // Info log - sync started
  logs.push({
    id: `log-${faker.string.alphanumeric(8)}`,
    jobId: job.id,
    timestamp: new Date(baseTime).toISOString(),
    level: 'info',
    message: 'Sync job started',
    details: {
      mappingsCount: 12,
      estimatedRecords: 145,
    },
  });
  
  // Info logs - processing records
  for (let i = 0; i < job.stats.newRecords; i++) {
    logs.push({
      id: `log-${faker.string.alphanumeric(8)}`,
      jobId: job.id,
      timestamp: new Date(baseTime + 1000 + i * 200).toISOString(),
      level: 'info',
      message: 'Created new record in Salesforce',
      recordId: `HH-${faker.string.alphanumeric(8)}`,
      entityType: 'Household',
      details: {
        salesforceId: `001${faker.string.alphanumeric(15)}`,
        fieldsUpdated: ['Name', 'TotalAUM__c', 'Rating'],
      },
    });
  }
  
  // Warning logs
  const warningCount = Math.floor(Math.random() * 3);
  for (let i = 0; i < warningCount; i++) {
    logs.push({
      id: `log-${faker.string.alphanumeric(8)}`,
      jobId: job.id,
      timestamp: new Date(baseTime + 3000 + i * 500).toISOString(),
      level: 'warning',
      message: 'Field mapping skipped due to null value',
      recordId: `HH-${faker.string.alphanumeric(8)}`,
      entityType: 'Household',
      details: {
        field: 'Phone',
        reason: 'Source field is null',
      },
    });
  }
  
  // Error logs
  for (let i = 0; i < job.stats.failedRecords; i++) {
    const errorTypes = [
      {
        message: 'Failed to update Salesforce record',
        error: 'REQUIRED_FIELD_MISSING',
        details: 'Required field Name is missing',
      },
      {
        message: 'Data transformation failed',
        error: 'INVALID_DATA_TYPE',
        details: 'Cannot convert string to currency',
      },
      {
        message: 'Salesforce API error',
        error: 'API_LIMIT_EXCEEDED',
        details: 'Daily API limit reached',
      },
    ];
    
    const errorType = faker.helpers.arrayElement(errorTypes);
    
    logs.push({
      id: `log-${faker.string.alphanumeric(8)}`,
      jobId: job.id,
      timestamp: new Date(baseTime + 5000 + i * 400).toISOString(),
      level: 'error',
      message: errorType.message,
      recordId: `HH-${faker.string.alphanumeric(8)}`,
      entityType: faker.helpers.arrayElement(['Household', 'Account', 'Owner']),
      details: {
        errorCode: errorType.error,
        errorMessage: errorType.details,
      },
      stackTrace: `Error: ${errorType.details}\n  at SyncEngine.transform (syncEngine.ts:45)\n  at SyncEngine.processRecord (syncEngine.ts:78)\n  at async SyncJob.run (syncJob.ts:23)`,
    });
  }
  
  // Info log - sync completed
  logs.push({
    id: `log-${faker.string.alphanumeric(8)}`,
    jobId: job.id,
    timestamp: job.endTime || new Date().toISOString(),
    level: 'info',
    message: 'Sync job completed',
    details: {
      duration: job.duration,
      stats: job.stats,
    },
  });
  
  return logs;
};
