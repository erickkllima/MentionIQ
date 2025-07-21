import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Sentiment() {
  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Análise de Sentimento</h2>
            <p className="text-sm text-gray-500">Análise detalhada dos sentimentos das menções</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Análise de Sentimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Esta página permitirá análise detalhada de sentimentos, configuração de parâmetros de análise e visualização de insights avançados.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
