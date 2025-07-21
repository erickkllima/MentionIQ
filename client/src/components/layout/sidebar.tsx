import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Search,
  Heart,
  Tags,
  FileText,
  Settings,
  User,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Busca Personalizada", href: "/search", icon: Search },
  { name: "Análise de Sentimento", href: "/sentiment", icon: Heart },
  { name: "Gerenciar Tags", href: "/tags", icon: Tags },
  { name: "Relatórios", href: "/reports", icon: FileText },
  { name: "Configurações", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-72 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo/Brand */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div className="ml-3">
          <h1 className="text-xl font-semibold text-gray-900">MentionIQ</h1>
          <p className="text-sm text-gray-500">Análise de Sentimento</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "text-primary bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">João Silva</p>
            <p className="text-xs text-gray-500">joao@empresa.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
