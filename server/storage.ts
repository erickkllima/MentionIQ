// server/storage.ts
import db from "./db"; 
import { mentions } from "@shared/schema"; 
import { eq } from "drizzle-orm";

// Tipo de uma menção
export type Mention = {
  id: number;
  content: string;
  source: string;
  sourceUrl: string;
  author: string | null;
  publishedAt: Date;
  sentiment: "positive" | "negative" | "neutral" | null;
  sentimentScore: number | null;
  tags: string[] | null;
  isProcessed: boolean;
  isStarred: boolean;
};

// Criar uma nova menção
export async function createMention(data: Omit<Mention, "id">) {
  const result = await db.insert(mentions).values(data).returning();
  return result[0];
}

// Buscar todas as menções
export async function getMentions() {
  return db.select().from(mentions).all();
}

// Buscar uma menção por ID
export async function getMentionById(id: number) {
  return db.select().from(mentions).where(eq(mentions.id, id)).get();
}

// Atualizar uma menção
export async function updateMention(id: number, data: Partial<Mention>) {
  return db.update(mentions).set(data).where(eq(mentions.id, id)).run();
}

// Deletar uma menção
export async function deleteMention(id: number) {
  return db.delete(mentions).where(eq(mentions.id, id)).run();
}

// Estatísticas para o dashboard
export async function getDashboardStats() {
  const allMentions = await db.select().from(mentions).all();

  const total = allMentions.length;
  const positive = allMentions.filter(m => m.sentiment === "positive").length;
  const negative = allMentions.filter(m => m.sentiment === "negative").length;
  const neutral = allMentions.filter(m => m.sentiment === "neutral").length;

  return {
    total,
    positive,
    negative,
    neutral,
    engagementRate: total > 0 ? (positive + negative) / total : 0,
  };
}
