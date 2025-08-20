import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Search, RefreshCw, Plus } from "lucide-react";
import type { Mention } from "@shared/schema";

export default function Mentions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customResults, setCustomResults] = useState<Mention[]>([]);
  const [sentimentFilter, setSentimentFilter] = useState<string>("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const { toast } = useToast();

  // Query para menções já salvas no banco
  const { data: mentions, isLoading } = useQuery<Mention[]>({
    queryKey: ["/api/mentions", { sentiment: sentimentFilter, source: sourceFilter }],
  });

  // Coleta geral
  const collectMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/collect"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Coleta realizada",
        description: "Novas menções foram coletadas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao coletar menções.",
        variant: "destructive",
      });
    },
  });

  // Nova busca personalizada (preview)
  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      return await apiRequest("POST", "/api/search-preview", { query });
    },
    onSuccess: (data) => {
      setCustomResults(data);
      toast({
        title: "Busca concluída",
        description: `${data.length} menções encontradas.`,
      });
    },
    onError: () => {
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Decide qual lista mostrar (menções do banco ou busca personalizada)
  const displayMentions = customResults.length > 0 ? customResults : mentions || [];

  const filteredMentions = displayMentions.filter(mention =>
    mention.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mention.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Buscar Menções</h2>
            <p className="text-sm text-gray-500">Gerencie e analise todas as menções coletadas</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => collectMutation.mutate()}
              disabled={collectMutation.isPending}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${collectMutation.isPending ? 'animate-spin' : ''}`} />
              <span>Coletar Agora</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2"
              onClick={() => searchMutation.mutate(searchTerm)}
              disabled={searchMutation.isPending || !searchTerm}
            >
              <Plus className="h-4 w-4" />
              <span>Nova Busca</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar por conteúdo ou autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>

              <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por sentimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os sentimentos</SelectItem>
                  <SelectItem value="positive">Positivo</SelectItem>
                  <SelectItem value="neutral">Neutro</SelectItem>
                  <SelectItem value="negative">Negativo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as fontes</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSentimentFilter("");
                setSourceFilter("");
                setCustomResults([]);
              }}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mentions List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Menções Encontradas ({filteredMentions.length})
              </CardTitle>
              <Button variant="outline" size="sm">
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && !customResults.length ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : filteredMentions.length > 0 ? (
              <div className="space-y-4">
                {filteredMentions.map((mention) => (
                  <div key={mention.id || mention.content} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">{mention.source || "Fonte desconhecida"}</span>
                        {mention.author && (
                          <span className="text-sm text-gray-500">por {mention.author}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {mention.publishedAt ? formatDate(mention.publishedAt) : "Data não informada"}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3">{mention.content}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {mention.sentiment && (
                          <Badge className={getSentimentColor(mention.sentiment)}>
                            {mention.sentiment === "positive" ? "Positivo" :
                              mention.sentiment === "negative" ? "Negativo" : "Neutro"}
                            {mention.sentimentScore && (
                              <span className="ml-1">
                                ({Math.round(mention.sentimentScore * 100)}%)
                              </span>
                            )}
                          </Badge>
                        )}
                        {mention.tags && mention.tags.length > 0 && (
                          mention.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {!mention.isProcessed && (
                          <Button variant="outline" size="sm">
                            Analisar
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Nenhuma menção encontrada</p>
                <Button onClick={() => collectMutation.mutate()}>
                  Coletar Menções
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
