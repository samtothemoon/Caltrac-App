import { motion } from "framer-motion";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { useLogs } from "@/hooks/useLogs";
import { useUser } from "@/hooks/useUser";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Logo } from "@/components/Logo";
import { Apple, Flame, Target, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { logs } = useLogs();
  const { user } = useUser();

  // Calculate last 14 days of data
  const data = Array.from({ length: 14 }).map((_, i) => {
    const date = startOfDay(subDays(new Date(), 13 - i));
    
    // Sum calories for this date
    const dayLogs = logs.filter(log => isSameDay(new Date(log.date), date));
    const calories = dayLogs.reduce((sum, log) => sum + log.estimatedCalories, 0);

    return {
      date,
      dateStr: format(date, "MMM d"),
      calories,
    };
  });

  // Calculate 7-day rolling average
  const last7Days = data.slice(-7);
  const total7DayCalories = last7Days.reduce((sum, day) => sum + day.calories, 0);
  const average7Day = Math.round(total7DayCalories / 7);

  // Helper for "Good Enough" presentation
  const formatCalories = (cals: number) => {
    if (!user.isGoodEnoughMode) return `${cals} kcal`;
    if (cals === 0) return "0 kcal";
    const lower = Math.round(cals * 0.95 / 10) * 10;
    const upper = Math.round(cals * 1.05 / 10) * 10;
    return `${lower} - ${upper}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 z-40 ios-nav-blur px-6 py-4 flex flex-col justify-end min-h-[100px]">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Daily Insights</h1>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">AI Powered Nutrition</p>
      </div>

      <div className="p-4 space-y-6 flex-1 pb-32">
        {/* Main Stats Card */}
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-8 shadow-sm border"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wide">
              <TrendingUp className="w-3.5 h-3.5" />
              Weekly Average
            </div>
            
            <div className="space-y-0">
              <div className="text-6xl font-bold tracking-tight text-foreground tabular-nums">
                {formatCalories(average7Day).split(' ')[0]}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                calories / day
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <p className="text-xs font-medium text-muted-foreground/80 leading-relaxed max-w-[240px]">
                {user.isGoodEnoughMode 
                  ? "Your nutritional intake is within a healthy, sustainable range." 
                  : "Precise tracking mode is currently active for maximum detail."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Insights */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-5 rounded-2xl border shadow-sm flex flex-col gap-3 active:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/10">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Today</div>
              <div className="text-xl font-black text-foreground tracking-tighter tabular-nums">{data[13].calories} <span className="text-xs opacity-40 uppercase">kcal</span></div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-6 rounded-[2rem] border shadow-sm flex flex-col gap-4 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/10">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Status</div>
              <div className="text-xl font-black text-foreground tracking-tighter">Steady</div>
            </div>
          </motion.div>
        </div>

        {/* Chart Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-[2.5rem] p-8 border shadow-sm relative group overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              14-Day Progress
            </h2>
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
              Activity
            </div>
          </div>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="dateStr" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontWeight: 800 }}
                  tickMargin={12}
                  minTickGap={25}
                  hide={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover/90 backdrop-blur-xl text-popover-foreground rounded-2xl p-4 shadow-2xl border border-border/50 text-sm">
                          <div className="font-black tracking-widest text-[10px] text-muted-foreground uppercase mb-2 opacity-60">{payload[0].payload.dateStr}</div>
                          <div className="text-foreground font-black text-xl tracking-tighter tabular-nums">
                            {payload[0].value}
                            <span className="text-[10px] ml-1.5 opacity-40 uppercase font-black">kcal</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ stroke: 'var(--primary)', strokeWidth: 2, strokeDasharray: '6 6', opacity: 0.3 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorCals)"
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
