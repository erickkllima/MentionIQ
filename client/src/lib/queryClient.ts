// client/src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

/**
 * Wrapper para chamadas de API com fetch.
 * Sempre retorna JSON já parseado.
 */
export async function apiRequest<T>(
  method: string,
  url: string,
  body?: any
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Erro na requisição: ${res.status}`);
  }

  return res.json(); // 🔹 Retorna JSON parseado automaticamente
}
