import { motion } from "framer-motion";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { useLogs } from "@/hooks/useLogs";
import { useUser } from "@/hooks/useUser";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

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
    // Plus or minus ~5% for range representation
    const lower = Math.round(cals * 0.95 / 10) * 10;
    const upper = Math.round(cals * 1.05 / 10) * 10;
    return `${lower} - ${upper} kcal`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col h-full bg-background/50"
    >
      <div className="p-6 pt-12 text-center space-y-2">
        <h1 className="text-xl font-medium text-muted-foreground">Rolling 7-Day Average</h1>
        <div className="text-5xl font-light tracking-tight text-primary mt-2">
          {formatCalories(average7Day)}
        </div>
        <p className="text-sm text-muted-foreground/80 my-2">
          {user.isGoodEnoughMode ? "Looks good! You're trending well." : "Exact tracking mode active."}
        </p>
      </div>

      <div className="flex-1 mt-8 mb-4 px-4 min-h-[300px]">
        <h2 className="text-md font-medium text-muted-foreground mb-4 ml-2">14-Day Trend</h2>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={data}>
            <XAxis 
              dataKey="dateStr" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              tickMargin={10}
              minTickGap={20}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover text-popover-foreground rounded-lg p-2 shadow-sm border border-border text-sm">
                      <div className="font-medium">{payload[0].payload.dateStr}</div>
                      <div className="text-primary mt-1">
                        {formatCalories(payload[0].value as number)}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: 'var(--muted)', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="calories" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'var(--background)', strokeWidth: 2 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
