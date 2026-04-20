import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useLogs } from "@/hooks/useLogs";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Edit3, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function History() {
  const { logs, deleteLog } = useLogs();
  const { user } = useUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleExport = () => {
    const textData = logs.map(log => 
      `[${format(new Date(log.date), 'yyyy-MM-dd HH:mm')}] ${log.text} -> ${log.estimatedCalories} kcal`
    ).join('\n');
    
    navigator.clipboard.writeText(textData);
    toast({
      title: "Exported successfully",
      description: "Copied your log history to clipboard as plain text."
    });
  };

  const formatCalories = (cals: number) => {
    if (!user.isGoodEnoughMode) return `${cals} kcal`;
    const lower = Math.round(cals * 0.95 / 10) * 10;
    const upper = Math.round(cals * 1.05 / 10) * 10;
    return `${lower} - ${upper}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 pt-12 flex flex-col h-full bg-background"
    >
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight mb-1">Your Logs</h1>
          <p className="text-muted-foreground text-sm">Your data, simple and accessible.</p>
        </div>
        {logs.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExport} className="h-8">
            <Copy className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-6">
        {logs.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p>No logs yet.</p>
            <Button variant="link" onClick={() => setLocation('/log')}>
              Add your first entry
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card border rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(log.date), "MMM d, h:mm a")}
                  </span>
                  <span className="font-semibold text-primary">
                    {formatCalories(log.estimatedCalories)}
                  </span>
                </div>
                
                <p className="text-foreground text-[15px] leading-relaxed mb-4">
                  "{log.text}"
                </p>

                <div className="flex justify-end gap-2 border-t pt-3">
                  <Button variant="ghost" size="sm" onClick={() => setLocation('/log')} className="h-8 text-xs">
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                    Re-enter
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteLog(log.id)} className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
