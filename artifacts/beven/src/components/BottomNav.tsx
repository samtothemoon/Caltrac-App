import { Link, useLocation } from "wouter";
import { LayoutDashboard, Plus, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  if (location === '/onboarding') return null;

  const links = [
    { href: "/",        icon: LayoutDashboard, label: "Home",    testId: "tab-dashboard" },
    { href: "/log",     icon: Plus,            label: "Log",     testId: "tab-log" },
    { href: "/history", icon: History,         label: "History", testId: "tab-history" },
    { href: "/settings", icon: Settings,        label: "Settings",testId: "tab-settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 ios-tab-blur pb-safe z-50 shadow-sm">
      <div className="flex justify-around items-center h-[52px] max-w-md mx-auto px-2">
        {links.map(({ href, icon: Icon, label, testId }) => {
          const isActive = location === href || (href === '/' && location === ''); 
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-opacity active:opacity-60" data-testid={testId}>
              <Icon 
                className={cn(
                  "w-[26px] h-[26px] transition-colors", 
                  isActive ? "text-primary" : "text-muted-foreground"
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
