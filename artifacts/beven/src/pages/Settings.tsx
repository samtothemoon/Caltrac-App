import { motion } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { useLogs } from "@/hooks/useLogs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { LogOut, Trash2, Moon, Sun, Monitor, User, Target, Settings as SettingsIcon, Bell, Shield, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Settings() {
  const { user, saveUser, clearUser } = useUser();
  const { clearLogs } = useLogs();
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      clearLogs();
      clearUser();
      setLocation("/onboarding");
    }
  };

  const SettingRow = ({ icon: Icon, label, value, onClick }: { icon: any, label: string, value?: string, onClick?: () => void }) => (
    <div 
      className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors cursor-pointer border-b last:border-0"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-muted-foreground">{value}</span>}
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-background"
    >
      <div className="sticky top-0 z-40 ios-nav-blur px-6 py-4 flex flex-col justify-end min-h-[100px]">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">Manage your profile and preferences.</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 p-4 space-y-8">
        {/* Profile Section */}
        <div className="space-y-2">
          <h2 className="text-[13px] font-medium uppercase tracking-tight text-muted-foreground ml-4">Profile</h2>
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <SettingRow icon={User} label="Name" value={user.name} />
            <SettingRow icon={User} label="Sex" value={user.sex} />
            <SettingRow icon={User} label="Date of Birth" value={user.dob} />
            <div className="flex items-center justify-between p-4 bg-card border-b">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Height</span>
              </div>
              <span className="text-sm text-muted-foreground">{user.height?.value || "--"} {user.height?.unit || ""}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Weight</span>
              </div>
              <span className="text-sm text-muted-foreground">{user.weight?.value || "--"} {user.weight?.unit || ""}</span>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="space-y-2">
          <h2 className="text-[13px] font-medium uppercase tracking-tight text-muted-foreground ml-4">Goals</h2>
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <SettingRow icon={Target} label="Goal" value={user.goal} />
            <SettingRow icon={Target} label="Activity Level" value={user.activityLevel} />
            <div className="flex items-start justify-between p-4 bg-card border-t">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <SettingsIcon className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-medium block">"Good Enough" Mode</span>
                  <p className="text-[10px] text-muted-foreground leading-tight max-w-[180px]">Show estimated ranges to reduce perfection anxiety.</p>
                </div>
              </div>
              <Switch
                checked={user.isGoodEnoughMode}
                onCheckedChange={(checked) => saveUser({ isGoodEnoughMode: checked })}
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-2">
          <h2 className="text-[13px] font-medium uppercase tracking-tight text-muted-foreground ml-4">Preferences</h2>
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sun className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Appearance</span>
              </div>
              <ToggleGroup type="single" value={theme} onValueChange={(v) => v && setTheme(v)} size="sm" className="bg-muted p-0.5 rounded-lg border h-8">
                <ToggleGroupItem value="light" className="px-2 h-7 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm">
                  <Sun className="w-3.5 h-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" className="px-2 h-7 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm">
                  <Moon className="w-3.5 h-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="system" className="px-2 h-7 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm">
                  <Monitor className="w-3.5 h-3.5" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <SettingRow icon={Bell} label="Notifications" value="Enabled" />
            <SettingRow icon={Shield} label="Privacy" />
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="space-y-2">
          <h2 className="text-[13px] font-medium uppercase tracking-tight text-muted-foreground ml-4">Data Management</h2>
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={handleClearAll}
              className="w-full flex items-center gap-3 p-4 hover:bg-destructive/5 text-destructive transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Delete All Data</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
