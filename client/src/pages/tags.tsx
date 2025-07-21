import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Tags() {
  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Gerenciar Tags</h2>
            <p className="text-sm text-gray-500">Organize e categorize suas menções com tags personalizadas</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Esta página permitirá criar, editar e excluir tags, além de visualizar estatísticas de uso e atribuir tags automaticamente às menções.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
