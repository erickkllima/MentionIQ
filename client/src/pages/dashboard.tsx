import { useQuery } from "@tanstack/react-query";
import MetricsCards from "@/components/dashboard/metrics-cards";
import SentimentChart from "@/components/dashboard/sentiment-chart";
import SourceChart from "@/components/dashboard/source-chart";
import RecentMentions from "@/components/dashboard/recent-mentions";
import PopularTags from "@/components/dashboard/popular-tags";
import type { DashboardMetrics } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Bell } from "lucide-react";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-500">Visão geral das menções e sentimentos</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar menções..."
                className="w-80 pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            
            {/* Date Filter */}
            <Select defaultValue="7">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Key Metrics Cards */}
        <MetricsCards metrics={metrics} isLoading={metricsLoading} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SentimentChart />
          <SourceChart />
        </div>

        {/* Recent Mentions & Tag Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentMentions />
          </div>
          <div className="space-y-6">
            <PopularTags />
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="mr-3">📊</span>
                  Gerar Relatório
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <span className="mr-3">➕</span>
                  Nova Busca
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <span className="mr-3">🔔</span>
                  Configurar Alertas
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <span className="mr-3">⚙️</span>
                  Configurações
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer/Status Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="ml-2 text-sm text-gray-600">Sistema Online</span>
              </div>
              <div className="text-sm text-gray-500">
                Última atualização: há 15 minutos
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Próxima coleta em: 45 minutos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
