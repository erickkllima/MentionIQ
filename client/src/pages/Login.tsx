import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter";

export default function Login() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.username, form.password);
      navigate("/"); // redireciona para a home após login
    } catch (err) {
      setError("Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "40px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Login</h2>
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
        <button type="submit" style={{ marginTop: 16, width: "100%" }} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
<div style={{ marginTop: 10 }}>
  <a href="/register">Criar nova conta</a>
</div>

