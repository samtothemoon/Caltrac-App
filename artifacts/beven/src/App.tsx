import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import BottomNav from "@/components/BottomNav";

// Pages
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import LogEntry from "@/pages/LogEntry";
import History from "@/pages/History";
import Settings from "@/pages/Settings";

import { useUser } from "@/hooks/useUser";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user } = useUser();
  if (!user.isComplete) {
    return <Redirect to="/onboarding" />;
  }
  return <Component {...rest} />;
}

function Router() {
  return (
    <div className="w-full max-w-md mx-auto bg-background min-h-[100dvh] relative shadow-2xl sm:border-x pb-20 overflow-x-hidden">
      <AnimatePresence mode="wait">
        <Switch>
          <Route path="/onboarding" component={Onboarding} />

          <Route path="/">
            <ProtectedRoute component={Dashboard} />
          </Route>

          <Route path="/log">
            <ProtectedRoute component={LogEntry} />
          </Route>

          <Route path="/history">
            <ProtectedRoute component={History} />
          </Route>
          
          <Route path="/settings">
            <ProtectedRoute component={Settings} />
          </Route>

          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <div className="min-h-[100dvh] bg-muted/30 flex justify-center">
              <Router />
            </div>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
