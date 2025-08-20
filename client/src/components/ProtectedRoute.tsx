import React from "react";
import { useAuth } from "../context/AuthContext";
import { Redirect } from "wouter";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Redirect to="/login" />;
  return <>{children}</>;
}
