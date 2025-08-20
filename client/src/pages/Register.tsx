import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter";

export default function Register() {
  const { register } = useAuth();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await register(form.username, form.password);
      setSuccess("Cadastro realizado com sucesso! Você já pode fazer login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError("Erro ao cadastrar. Tente outro usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "40px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Cadastro</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Usuário:
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <label>
            Senha:
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}
        <button type="submit" style={{ marginTop: 16, width: "100%" }} disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
<div style={{ marginTop: 10 }}>
  <a href="/login">Já tem conta? Entrar</a>
</div>
