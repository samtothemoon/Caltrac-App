import { Link, useLocation } from "wouter";
import { Activity, PlusCircle, List, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  if (location === '/onboarding') return null;

  const links = [
    { href: "/",        icon: Activity,   label: "Dashboard", testId: "tab-dashboard" },
    { href: "/log",     icon: PlusCircle, label: "Log",       testId: "tab-log" },
    { href: "/history", icon: List,       label: "History",   testId: "tab-history" },
    { href: "/settings", icon: Settings,  label: "Settings",  testId: "tab-settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {links.map(({ href, icon: Icon, label, testId }) => {
          const isActive = location === href || (href === '/' && location === ''); // Handle root edge case
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center gap-1" data-testid={testId}>
              <div
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
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
