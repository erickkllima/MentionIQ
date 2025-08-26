// server/seed.ts
import { storage } from "./storage";
import type { Mention } from "../shared/schema";

async function seed() {
  try {
    console.log("🌱 Iniciando seed do banco...");

    const mockMentions: Omit<Mention, "id">[] = [
      {
        content: "Adorei o atendimento, muito rápido e eficiente!",
        source: "Twitter",
        sourceUrl: "https://twitter.com/user/status/1",
        author: "@cliente_feliz",
        publishedAt: new Date().toISOString(),
        collectedAt: new Date().toISOString(),
        sentiment: "positive",
        sentimentScore: 0.9,
        tags: JSON.stringify(["atendimento", "satisfação"]),
        isProcessed: 1,
        isStarred: 0,
      },
      {
        content: "O produto demorou demais para chegar. Não recomendo.",
        source: "Facebook",
        sourceUrl: "https://facebook.com/post/2",
        author: "João Silva",
        publishedAt: new Date().toISOString(),
        collectedAt: new Date().toISOString(),
        sentiment: "negative",
        sentimentScore: 0.2,
        tags: JSON.stringify(["atraso", "logística"]),
        isProcessed: 1,
        isStarred: 0,
      },
      {
        content: "O produto é bom, mas nada de especial. Cumpre o que promete.",
        source: "Instagram",
        sourceUrl: "https://instagram.com/p/3",
        author: "@avaliadora",
        publishedAt: new Date().toISOString(),
        collectedAt: new Date().toISOString(),
        sentiment: "neutral",
        sentimentScore: 0.5,
        tags: JSON.stringify(["produto"]),
        isProcessed: 1,
        isStarred: 0,
      },
    ];

    for (const mention of mockMentions) {
      await storage.createMention(mention);
    }

    console.log("✅ Seed concluído com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao executar seed:", err);
    process.exit(1);
  }
}

seed();
