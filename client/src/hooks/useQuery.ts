import { useQuery as useReactQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesforceAPI, addeparAPI, mappingsAPI, syncAPI } from '../services/api';

// Salesforce queries
export const useSalesforceStatus = () => {
  return useReactQuery({
    queryKey: ['salesforce', 'status'],
    queryFn: salesforceAPI.getStatus,
    refetchInterval: 5000,
  });
};

export const useSalesforceMetadata = () => {
  return useReactQuery({
    queryKey: ['salesforce', 'metadata'],
    queryFn: salesforceAPI.getMetadata,
    enabled: false,
  });
};

export const useSalesforceConnect = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: salesforceAPI.connect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesforce', 'status'] });
    },
  });
};

// Addepar queries
export const useAddeparEntities = () => {
  return useReactQuery({
    queryKey: ['addepar', 'entities'],
    queryFn: addeparAPI.getEntities,
  });
};

// Mappings queries
export const useMappings = () => {
  return useReactQuery({
    queryKey: ['mappings'],
    queryFn: mappingsAPI.getAll,
  });
};

export const useCreateMapping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mappingsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
    },
  });
};

export const useDeleteMapping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mappingsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
    },
  });
};

// Sync queries
export const useSyncStatus = () => {
  return useReactQuery({
    queryKey: ['sync', 'status'],
    queryFn: syncAPI.getStatus,
    refetchInterval: 1000,
  });
};

export const useSyncHistory = () => {
  return useReactQuery({
    queryKey: ['sync', 'history'],
    queryFn: syncAPI.getHistory,
    refetchInterval: 5000,
  });
};

export const useSyncLogs = (jobId: string | null) => {
  return useReactQuery({
    queryKey: ['sync', 'logs', jobId],
    queryFn: () => syncAPI.getLogs(jobId!),
    enabled: !!jobId,
  });
};

export const useTriggerSync = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncAPI.trigger,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync'] });
    },
  });
};
