import { motion } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { useLogs } from "@/hooks/useLogs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { LogOut, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Settings() {
  const { user, saveUser, clearUser } = useUser();
  const { clearLogs } = useLogs();
  const [, setLocation] = useLocation();

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      clearLogs();
      clearUser();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 pt-12 flex flex-col h-full bg-background"
    >
      <h1 className="text-2xl font-medium tracking-tight mb-8">Settings</h1>

      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            Philosophy
          </h2>

          <div className="flex items-start justify-between border bg-card rounded-xl p-4 shadow-sm">
            <div className="space-y-1">
              <Label className="text-base text-foreground font-medium">"Good Enough" Mode</Label>
              <p className="text-sm text-muted-foreground leading-snug pr-4">
                Instead of exact numbers, we show estimated ranges (e.g., 450–550 kcal) to reduce perfection anxiety.
              </p>
            </div>
            <Switch
              checked={user.isGoodEnoughMode}
              onCheckedChange={(checked) => saveUser({ isGoodEnoughMode: checked })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            Account
          </h2>
          <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="font-medium">{user.name || "Unknown"}</span>
            </div>
            
            <Button
              variant="destructive"
              className="w-full mt-2 bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none"
              onClick={handleClearAll}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All Data & Reset
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
