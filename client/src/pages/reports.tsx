import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Reports() {
  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Relatórios</h2>
            <p className="text-sm text-gray-500">Gere relatórios detalhados sobre suas menções e análises</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Esta página permitirá gerar relatórios personalizados, agendar relatórios automáticos e exportar dados em diferentes formatos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
