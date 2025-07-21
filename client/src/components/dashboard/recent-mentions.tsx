import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Mention } from "@shared/schema";

const getSentimentColor = (sentiment: string | null) => {
  switch (sentiment) {
    case "positive":
      return "bg-green-100 text-green-800";
    case "negative":
      return "bg-red-100 text-red-800";
    case "neutral":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSentimentDot = (sentiment: string | null) => {
  switch (sentiment) {
    case "positive":
      return "bg-green-500";
    case "negative":
      return "bg-red-500";
    case "neutral":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "há poucos minutos";
  if (diffInHours === 1) return "há 1 hora";
  if (diffInHours < 24) return `há ${diffInHours} horas`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "há 1 dia";
  return `há ${diffInDays} dias`;
};

export default function RecentMentions() {
  const { data: mentions, isLoading } = useQuery<Mention[]>({
    queryKey: ["/api/mentions/recent"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Menções Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Menções Recentes</CardTitle>
          <button className="text-sm text-blue-600 hover:text-blue-800">Ver todas</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentions && mentions.length > 0 ? (
            mentions.slice(0, 5).map((mention) => (
              <div key={mention.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 ${getSentimentDot(mention.sentiment)} rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{mention.source}</span>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(mention.publishedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{mention.content}</p>
                  <div className="flex items-center space-x-2">
                    {mention.sentiment && (
                      <Badge className={getSentimentColor(mention.sentiment)}>
                        {mention.sentiment === "positive" ? "Positivo" :
                         mention.sentiment === "negative" ? "Negativo" : "Neutro"}
                      </Badge>
                    )}
                    {mention.tags && mention.tags.length > 0 && (
                      mention.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma menção encontrada. Execute uma coleta para ver os dados.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}