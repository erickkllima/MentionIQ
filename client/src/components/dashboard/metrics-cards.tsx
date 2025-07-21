import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Smile, Frown, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardMetrics } from "@shared/schema";

interface MetricsCardsProps {
  metrics?: DashboardMetrics;
  isLoading: boolean;
}

export default function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total de Menções",
      value: metrics?.totalMentions?.toLocaleString() || "0",
      growth: metrics?.totalGrowth || "+0%",
      icon: MessageCircle,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      growthColor: "text-green-600",
    },
    {
      title: "Sentimento Positivo",
      value: `${metrics?.positive || 0}%`,
      growth: metrics?.positiveGrowth || "+0%",
      icon: Smile,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      growthColor: "text-green-600",
    },
    {
      title: "Sentimento Negativo",
      value: `${metrics?.negative || 0}%`,
      growth: metrics?.negativeGrowth || "0%",
      icon: Frown,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      growthColor: "text-red-600",
    },
    {
      title: "Taxa de Engajamento",
      value: `${metrics?.engagement || 0}%`,
      growth: metrics?.engagementGrowth || "+0%",
      icon: TrendingUp,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      growthColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{card.value}</p>
                <p className={`text-sm flex items-center mt-1 ${card.growthColor}`}>
                  <span>↗️</span>
                  <span className="ml-1">{card.growth}</span>
                </p>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}