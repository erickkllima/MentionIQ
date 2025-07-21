import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tag } from "@shared/schema";

export default function PopularTags() {
  const { data: tags, isLoading } = useQuery<Tag[]>({
    queryKey: ["/api/tags"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tags Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const popularTags = tags?.slice(0, 4) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags Populares</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {popularTags.length > 0 ? (
            popularTags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between">
                <Badge 
                  variant="secondary"
                  className="text-sm font-medium"
                  style={{ backgroundColor: `${tag.color || '#3B82F6'}20`, color: tag.color || '#3B82F6' }}
                >
                  {tag.name}
                </Badge>
                <span className="text-sm text-gray-500">{tag.usageCount}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              Nenhuma tag encontrada
            </div>
          )}
        </div>
        <Button variant="outline" className="w-full mt-4">
          Gerenciar Tags
        </Button>
      </CardContent>
    </Card>
  );
}
