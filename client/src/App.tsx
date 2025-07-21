import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AppLayout from "@/components/layout/app-layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/mentions" component={() => <div>Página de Menções em desenvolvimento</div>} />
      <Route path="/sentiment" component={() => <div>Página de Análise de Sentimento em desenvolvimento</div>} />
      <Route path="/tags" component={() => <div>Página de Tags em desenvolvimento</div>} />
      <Route path="/reports" component={() => <div>Página de Relatórios em desenvolvimento</div>} />
      <Route path="/settings" component={() => <div>Página de Configurações em desenvolvimento</div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout>
          <Router />
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
