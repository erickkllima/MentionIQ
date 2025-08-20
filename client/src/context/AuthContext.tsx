import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Tipo para usuário
type User = { username: string } | null;

// Tipo do contexto de autenticação
type AuthContextType = {
  user: User;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
};

// Cria o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMeAPI()
      .then(data => setUser(data?.user))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    await loginAPI(username, password);
    const data = await getMeAPI();
    setUser(data?.user);
  };

  const logout = async () => {
    await logoutAPI();
    setUser(null);
  };

  const register = async (username: string, password: string) => {
    await registerAPI(username, password);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para consumir o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Funções auxiliares (com tipagem)
async function loginAPI(username: string, password: string) {
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Usuário ou senha inválidos");
  return await res.json();
}

async function registerAPI(username: string, password: string) {
  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Erro ao registrar usuário");
  return await res.json();
}

async function logoutAPI() {
  await fetch("/logout", { method: "POST", credentials: "include" });
}

async function getMeAPI() {
  const res = await fetch("/api/me", { credentials: "include" });
  if (!res.ok) return null;
  return await res.json();
}
