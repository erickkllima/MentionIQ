import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { SentimentTrendData } from "@shared/schema";

export default function SentimentChart() {
  const { data: trendData, isLoading } = useQuery<SentimentTrendData[]>({
    queryKey: ["/api/dashboard/sentiment-trend"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Sentimento</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tendência de Sentimento</CardTitle>
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Positivo
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
              Neutro
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
              Negativo
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => [`${value}%`, ""]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="positive"
                stroke="#10B981"
                strokeWidth={2}
                name="Positivo"
                dot={{ fill: "#10B981" }}
              />
              <Line
                type="monotone"
                dataKey="neutral"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Neutro"
                dot={{ fill: "#F59E0B" }}
              />
              <Line
                type="monotone"
                dataKey="negative"
                stroke="#EF4444"
                strokeWidth={2}
                name="Negativo"
                dot={{ fill: "#EF4444" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}