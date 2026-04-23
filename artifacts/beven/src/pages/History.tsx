import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isYesterday } from "date-fns";
import { useLogs } from "@/hooks/useLogs";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Edit3, Clock, ChevronRight, Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";

export default function History() {
  const { logs, deleteLog } = useLogs();
  const { user } = useUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter(log => 
    log.text.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleExport = () => {
    const textData = logs.map(log => 
      `[${format(new Date(log.date), 'yyyy-MM-dd HH:mm')}] ${log.text} -> ${log.estimatedCalories} kcal`
    ).join('\n');
    
    navigator.clipboard.writeText(textData);
    toast({
      title: "Exported successfully",
      description: "Copied your log history to clipboard."
    });
  };

  const formatCalories = (cals: number) => {
    if (!user.isGoodEnoughMode) return `${cals} kcal`;
    const lower = Math.round(cals * 0.95 / 10) * 10;
    const upper = Math.round(cals * 1.05 / 10) * 10;
    return `${lower} - ${upper}`;
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-background"
    >
      <div className="sticky top-0 z-40 ios-nav-blur px-6 py-4 flex flex-col justify-end min-h-[100px]">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">History</h1>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">Your nutritional timeline.</p>
          </div>
          {logs.length > 0 && (
            <button 
              onClick={handleExport} 
              className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <Download className="w-5 h-5 text-primary" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1 pb-32">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search your meals..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl border-none bg-muted focus:bg-muted/80 transition-all font-medium"
          />
        </div>

        {filteredLogs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 opacity-50">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 border">
               <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-lg tracking-tight">No records found.</p>
            <p className="text-sm mt-1">Try a different search or start logging.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-[1fr_auto] gap-4 p-3 bg-muted/30 border-b">
                <span className="text-[11px] font-semibold uppercase tracking-tight text-muted-foreground ml-1">Meal & Time</span>
                <span className="text-[11px] font-semibold uppercase tracking-tight text-muted-foreground mr-1">Calories</span>
              </div>
              
              <div className="divide-y">
                {filteredLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group flex items-center justify-between p-4 hover:bg-muted/30 transition-all cursor-pointer"
                    onClick={() => setLocation(`/log`)}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest whitespace-nowrap">
                          {format(new Date(log.date), "h:mm a")}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                          • {getDateLabel(new Date(log.date))}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-foreground truncate pr-4">
                        {log.text}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="font-black text-base text-foreground tracking-tighter leading-none">
                          {formatCalories(log.estimatedCalories)}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => { e.stopPropagation(); deleteLog(log.id); }} 
                          className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
