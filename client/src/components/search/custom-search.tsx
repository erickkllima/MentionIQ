import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  content: string;
  source: string;
  sourceUrl?: string;
  author?: string;
  publishedAt: Date;
}

interface SearchResponse {
  results: SearchResult[];
  query: string;
  count: number;
}

export default function CustomSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [lastQuery, setLastQuery] = useState("");
  const { toast } = useToast();

  const searchMutation = useMutation({
    mutationFn: async (query: string): Promise<SearchResponse> => {
      const response = await fetch("/api/search-preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error("Erro na busca");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setResults(data.results);
      setLastQuery(data.query);
      toast({
        title: "Busca realizada",
        description: `Encontradas ${data.count} menções para "${data.query}"`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const collectMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await fetch("/api/collect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error("Erro na coleta");
      }
      
      return await response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Coleta realizada",
        description: data.message,
      });
      // Refresh results after collecting
      if (lastQuery) {
        searchMutation.mutate(lastQuery);
      }
    },
    onError: (error) => {
      toast({
        title: "Erro na coleta",
        description: "Não foi possível coletar as menções.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    searchMutation.mutate(searchTerm.trim());
  };

  const handleCollect = () => {
    if (!lastQuery) return;
    collectMutation.mutate(lastQuery);
  };

  const getSentimentColor = (content: string) => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("excelente") || lowerContent.includes("ótimo") || lowerContent.includes("recomendo")) {
      return "bg-green-100 text-green-800";
    } else if (lowerContent.includes("problema") || lowerContent.includes("ruim") || lowerContent.includes("péssimo")) {
      return "bg-red-100 text-red-800";
    }
    return "bg-blue-100 text-blue-800";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Busca Personalizada</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Digite o termo de busca (ex: sua marca, produto, empresa)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={searchMutation.isPending}
              />
            </div>
            <Button 
              type="submit" 
              disabled={searchMutation.isPending || !searchTerm.trim()}
              className="flex items-center space-x-2"
            >
              {searchMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>Buscar</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {lastQuery && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Resultados para "{lastQuery}"</CardTitle>
            <Button
              onClick={handleCollect}
              disabled={collectMutation.isPending || results.length === 0}
              variant="outline"
              size="sm"
            >
              {collectMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Coletar e Salvar
            </Button>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhuma menção encontrada para este termo.
              </p>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {results.length} menções encontradas
                </p>
                <div className="grid gap-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 mb-2">
                            {result.content}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Badge variant="secondary">{result.source}</Badge>
                            {result.author && (
                              <span>por {result.author}</span>
                            )}
                            <span>
                              {new Date(result.publishedAt).toLocaleString('pt-BR')}
                            </span>
                          </div>
                        </div>
                        {result.sourceUrl && (
                          <a
                            href={result.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 ml-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <Badge className={getSentimentColor(result.content)}>
                        {getSentimentColor(result.content).includes("green") ? "Positivo" :
                         getSentimentColor(result.content).includes("red") ? "Negativo" : "Neutro"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}