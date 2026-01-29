import { Router } from 'express';
import { SyncJob, SyncLog } from '../types';
import { generateSyncLogs } from '../services/syncEngine';

const router = Router();

// In-memory storage for sync jobs and logs
let syncJobs: SyncJob[] = [];
let syncLogs: SyncLog[] = [];
let currentSyncJob: SyncJob | null = null;

// Generate some historical sync jobs on startup
const initializeHistoricalJobs = () => {
  const now = Date.now();
  for (let i = 0; i < 5; i++) {
    const jobTime = now - (i + 1) * 86400000; // 1 day intervals
    const job: SyncJob = {
      id: `job-${jobTime}`,
      status: 'completed',
      startTime: new Date(jobTime).toISOString(),
      endTime: new Date(jobTime + 8000 + Math.random() * 5000).toISOString(),
      duration: 8000 + Math.floor(Math.random() * 5000),
      progress: 100,
      stats: {
        totalRecords: 120 + Math.floor(Math.random() * 50),
        newRecords: Math.floor(Math.random() * 10),
        updatedRecords: 110 + Math.floor(Math.random() * 40),
        failedRecords: Math.floor(Math.random() * 3),
      },
    };
    syncJobs.push(job);
  }
};

initializeHistoricalJobs();

// POST /api/sync/trigger - Start a sync job
router.post('/trigger', (req, res) => {
  if (currentSyncJob && currentSyncJob.status === 'running') {
    return res.status(400).json({ error: 'A sync job is already running' });
  }
  
  const jobId = `job-${Date.now()}`;
  currentSyncJob = {
    id: jobId,
    status: 'running',
    startTime: new Date().toISOString(),
    progress: 0,
    stats: {
      totalRecords: 0,
      newRecords: 0,
      updatedRecords: 0,
      failedRecords: 0,
    },
  };
  
  syncJobs.unshift(currentSyncJob);
  
  // Simulate sync progress
  let progress = 0;
  const interval = setInterval(() => {
    if (!currentSyncJob) {
      clearInterval(interval);
      return;
    }
    
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      currentSyncJob.status = 'completed';
      currentSyncJob.endTime = new Date().toISOString();
      currentSyncJob.duration = new Date(currentSyncJob.endTime).getTime() - 
                                new Date(currentSyncJob.startTime).getTime();
      currentSyncJob.stats = {
        totalRecords: 145,
        newRecords: 12,
        updatedRecords: 128,
        failedRecords: 5,
      };
      
      // Generate logs for this job
      const logs = generateSyncLogs(currentSyncJob);
      syncLogs.push(...logs);
      
      clearInterval(interval);
    }
    
    currentSyncJob.progress = Math.min(progress, 100);
  }, 1000);
  
  res.json(currentSyncJob);
});

// GET /api/sync/status - Get current sync status
router.get('/status', (req, res) => {
  if (!currentSyncJob) {
    return res.json({ status: 'idle' });
  }
  res.json(currentSyncJob);
});

// GET /api/sync/history - Get historical sync jobs
router.get('/history', (req, res) => {
  res.json(syncJobs);
});

// GET /api/sync/logs/:jobId - Get logs for a specific job
router.get('/logs/:jobId', (req, res) => {
  const { jobId } = req.params;
  const logs = syncLogs.filter(log => log.jobId === jobId);
  res.json(logs);
});

// POST /api/sync/retry - Retry failed records
router.post('/retry', (req, res) => {
  const { jobId, recordIds } = req.body;
  
  // Simulate retry
  setTimeout(() => {
    res.json({
      success: true,
      retriedCount: recordIds?.length || 0,
      message: 'Retry completed successfully',
    });
  }, 1000);
});

export default router;
