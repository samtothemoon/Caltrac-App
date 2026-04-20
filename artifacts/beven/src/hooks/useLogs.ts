import { useLocalStorage } from '@/lib/storage';

export type LogEntry = {
  id: string;
  date: string; // ISO string
  text: string;
  estimatedCalories: number;
  confidence: 'High' | 'Medium' | 'Low';
  protein?: number;
  carbs?: number;
  fat?: number;
};

export function useLogs() {
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('beven_logs', []);

  const addLog = (log: Omit<LogEntry, 'id'>) => {
    const newLog = {
      ...log,
      id: crypto.randomUUID(),
    };
    setLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const editLog = (id: string, updates: Partial<Omit<LogEntry, 'id'>>) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, ...updates } : log));
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return { logs, addLog, editLog, deleteLog, clearLogs };
}
