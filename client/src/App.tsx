import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AppLayout from "@/components/layout/app-layout";

import CustomSearch from "@/components/search/custom-search";

import Register from "./pages/Register";
// ... outros imports

<Route path="/register" component={Register} />

import Login from "./pages/Login";
// ... outros imports

<Route path="/login" component={Login} />

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
// ... outros imports

<Route
  path="/"
  component={() => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )}
/>

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/search" component={() => (
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Busca de Menções</h1>
            <p className="text-gray-600">Busque menções em tempo real na internet sobre qualquer termo</p>
          </div>
          <CustomSearch />
        </div>
      )} />
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
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AppLayout>
            <Router />
          </AppLayout>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
