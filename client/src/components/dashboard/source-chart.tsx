import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { SourceVolumeData } from "@shared/schema";

const COLORS = {
  Twitter: "#1DA1F2",
  Facebook: "#4267B2",
  Instagram: "#E4405F",
  LinkedIn: "#0A66C2",
  Outros: "#757575",
};

export default function SourceChart() {
  const { data: sourceData, isLoading } = useQuery<SourceVolumeData[]>({
    queryKey: ["/api/dashboard/source-volume"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Volume por Fonte</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = sourceData?.map(item => ({
    name: item.source,
    value: item.percentage,
    count: item.count,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Volume por Fonte</CardTitle>
          <button className="text-sm text-blue-600 hover:text-blue-800">Ver todos</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Outros} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value}% (${props.payload.count} menções)`,
                  name
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}