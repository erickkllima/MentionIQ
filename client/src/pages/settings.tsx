import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Configurações</h2>
            <p className="text-sm text-gray-500">Configure as preferências do sistema e integrações</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Esta página permitirá configurar APIs externas, frequência de coleta, notificações e outras preferências do sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
