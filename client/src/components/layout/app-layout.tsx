import { ReactNode } from "react";
import Sidebar from "./sidebar";
import { useAuth } from "../../context/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { logout, user } = useAuth();
  return (
    <>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 }}>
        <div>
          <strong>Meu Sistema</strong>
          {user && <span style={{ marginLeft: 16 }}>Bem-vindo, {user.username}</span>}
        </div>
        {user && (
          <button onClick={logout} style={{ padding: "6px 14px", background: "#e33", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
            Sair
          </button>
        )}
      </header>
      {/* ...restante da página/layout... */}
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </>
  );
}
