import { useLocalStorage } from '@/lib/storage';
import { format } from 'date-fns';

export type WeightEntry = {
  id: string;
  date: string;
  weight: number;
};

export function useWeightLog() {
  const [entries, setEntries] = useLocalStorage<WeightEntry[]>('beven_weight_log', []);

  const logWeight = (weight: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const existing = entries.find(e => e.date === today);
    if (existing) {
      setEntries(prev => prev.map(e => e.id === existing.id ? { ...e, weight } : e));
    } else {
      setEntries(prev => [
        ...prev,
        { id: crypto.randomUUID(), date: today, weight },
      ]);
    }
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1] ?? null;
  const previous = sorted[sorted.length - 2] ?? null;
  const trend = latest && previous ? latest.weight - previous.weight : 0;

  return { entries: sorted, logWeight, deleteEntry, latest, trend };
}
