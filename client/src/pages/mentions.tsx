import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { RefreshCw, Plus } from "lucide-react";
import type { Mention } from "@shared/schema";

export default function Mentions() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [newQuery, setNewQuery] = useState("");
  const [results, setResults] = useState<Mention[]>([]);

  const { toast } = useToast();

  // 🔹 Buscar todas as menções do banco
  const { data: mentions } = useQuery<Mention[]>({
    queryKey: ["/api/mentions"],
  });

  // 🔹 Mutação para coletar (salva no banco)
  const collectMutation = useMutation({
    mutationFn: () =>
      apiRequest<{ collected: number }>("POST", "/api/collect", {
        queries: ["nossa empresa", "nosso produto"],
      }),
    onSuccess: async (data) => {
      const updated = await apiRequest<Mention[]>("GET", "/api/mentions");
      setResults(updated);
      toast({
        title: "Coleta realizada",
        description: `${data.collected} menções coletadas e salvas no banco.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/mentions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao coletar menções.",
        variant: "destructive",
      });
    },
  });

  // 🔹 Mutação para busca rápida (preview, não salva no banco)
  const searchMutation = useMutation({
    mutationFn: (query: string) =>
      apiRequest<Mention[]>("POST", "/api/search-preview", { query }),
    onSuccess: (data, variables) => {
  const mentions = Array.isArray(data) ? data : [];
  setResults(mentions);

  toast({
    title: "Busca realizada",
    description: `Encontradas ${mentions.length} menções para "${variables}"`,
  });

  setIsSearchModalOpen(false);
  setNewQuery(""); // agora só limpa depois do toast
},
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao buscar menções.",
        variant: "destructive",
      });
    },
  });

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
    return new Date(date).toLocaleString("pt-BR");
  };

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Menções</h2>
            <p className="text-sm text-gray-500">
              Gerencie e analise todas as menções coletadas ou buscadas
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => collectMutation.mutate()}
              disabled={collectMutation.isPending}
              className="flex items-center space-x-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  collectMutation.isPending ? "animate-spin" : ""
                }`}
              />
              <span>Coletar Agora</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Nova Busca</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Modal de Busca */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nova Busca</h3>
            <Input
              placeholder="Digite o termo da busca..."
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsSearchModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => searchMutation.mutate(newQuery)}
                disabled={searchMutation.isPending}
              >
                {searchMutation.isPending ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="p-6 space-y-6">
        {(results.length > 0 ? results : mentions || []).map((mention, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{mention.source}</CardTitle>
                <span className="text-xs text-gray-500">
                  {formatDate(new Date(mention.publishedAt))}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">{mention.content}</p>
              <div className="flex items-center space-x-2">
                {mention.sentiment && (
                  <Badge className={getSentimentColor(mention.sentiment)}>
                    {mention.sentiment === "positive"
                      ? "Positivo"
                      : mention.sentiment === "negative"
                      ? "Negativo"
                      : "Neutro"}
                  </Badge>
                )}
                {mention.author && (
                  <span className="text-sm text-gray-500">por {mention.author}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
