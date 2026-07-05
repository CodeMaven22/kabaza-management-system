import { useState, useEffect, useCallback } from 'react';
import { transportService } from '@/lib/api/transportService';

export interface TaskState {
  status: 'pending' | 'progress' | 'success' | 'failure' | 'idle';
  result?: any;
  error?: string;
  progress?: number;
}

interface UseCeleryTaskOptions {
  autoStart?: boolean;
  pollInterval?: number; // ms
  maxRetries?: number;
}

export function useCeleryTask(
  taskId: string | null,
  options: UseCeleryTaskOptions = {}
) {
  const {
    autoStart = true,
    pollInterval = 1000,
    maxRetries = 30,
  } = options;

  const [state, setState] = useState<TaskState>({ status: 'idle' });
  const [retryCount, setRetryCount] = useState(0);

  const pollTask = useCallback(async () => {
    if (!taskId) return;

    try {
      const response = await transportService.getTaskStatus(taskId);

      setState({
        status: response.status as TaskState['status'],
        result: response.result,
        error: response.error,
      });

      // Stop polling on success or failure
      if (response.status === 'success' || response.status === 'failure') {
        return response.status;
      }

      return 'polling';
    } catch (error) {
      if (retryCount >= maxRetries) {
        setState({
          status: 'failure',
          error: 'Max retries exceeded',
        });
        return 'failure';
      }

      setRetryCount((prev) => prev + 1);
      return 'polling';
    }
  }, [taskId, retryCount, maxRetries]);

  useEffect(() => {
    if (!autoStart || !taskId) return;

    setState({ status: 'progress' });
    setRetryCount(0);

    const pollInterval_id = setInterval(async () => {
      const result = await pollTask();
      if (result !== 'polling') {
        clearInterval(pollInterval_id);
      }
    }, pollInterval);

    return () => clearInterval(pollInterval_id);
  }, [taskId, autoStart, pollInterval, pollTask]);

  return state;
}

export function useQRCodeGeneration(vehicleId: number | null) {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const taskState = useCeleryTask(taskId);

  const generateQRCode = useCallback(async () => {
    if (!vehicleId) return;

    try {
      setIsGenerating(true);
      const response = await transportService.generateQRCode(vehicleId);
      setTaskId(response.task_id);
    } catch (error) {
      console.error('[v0] QR generation error:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [vehicleId]);

  return {
    taskId,
    isGenerating,
    status: taskState.status,
    error: taskState.error,
    result: taskState.result,
    generateQRCode,
  };
}

export function usePDFGeneration(vehicleId: number | null) {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const taskState = useCeleryTask(taskId);

  const generatePDF = useCallback(async () => {
    if (!vehicleId) return;

    try {
      setIsGenerating(true);
      const response = await transportService.generatePDF(vehicleId);
      setTaskId(response.task_id);
    } catch (error) {
      console.error('[v0] PDF generation error:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [vehicleId]);

  return {
    taskId,
    isGenerating,
    status: taskState.status,
    error: taskState.error,
    result: taskState.result,
    generatePDF,
  };
}
