// server/storage.ts
import { db } from "./db";
import {
  mentions,
  tags,
  searchQueries,
  reports,
  type Mention,
  type Tag,
  type SearchQuery,
  type Report,
} from "../shared/schema";
import { eq } from "drizzle-orm";

export class DatabaseStorage {
  // =======================
  // MENÇÕES
  // =======================

  async getMentions(limit = 50): Promise<Mention[]> {
    try {
    const result: Mention[] = await db.select().from(mentions).limit(limit);
    console.log(">>> getMentions result:", result);
    return result;
  } catch (err) {
    console.error(">>> Erro em getMentions:", err);
    throw err;
  }
}

  async createMention(newMention: Omit<Mention, "id">) {
    return await db.insert(mentions).values(newMention);
  }

  async deleteMention(id: number) {
    return await db.delete(mentions).where(eq(mentions.id, id));
  }

  // =======================
  // TAGS
  // =======================

  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags);
  }

  async createTag(newTag: Omit<Tag, "id">) {
    return await db.insert(tags).values(newTag);
  }

  async deleteTag(id: number) {
    return await db.delete(tags).where(eq(tags.id, id));
  }

  // =======================
  // SEARCH QUERIES
  // =======================

  async getSearchQueries(): Promise<SearchQuery[]> {
    return await db.select().from(searchQueries);
  }

  async createSearchQuery(newQuery: Omit<SearchQuery, "id">) {
    return await db.insert(searchQueries).values(newQuery);
  }

  async deleteSearchQuery(id: number) {
    return await db.delete(searchQueries).where(eq(searchQueries.id, id));
  }

  // =======================
  // REPORTS
  // =======================

  async getReports(): Promise<Report[]> {
    return await db.select().from(reports);
  }

  async createReport(newReport: Omit<Report, "id">) {
    return await db.insert(reports).values(newReport);
  }

  async deleteReport(id: number) {
    return await db.delete(reports).where(eq(reports.id, id));
  }

  // =======================
  // DASHBOARD
  // =======================

  async getDashboardStats() {
    const allMentions = await db.select().from(mentions);

    const positive = allMentions.filter(m => m.sentiment === "positive").length;
    const negative = allMentions.filter(m => m.sentiment === "negative").length;
    const neutral = allMentions.filter(m => m.sentiment === "neutral").length;

    return {
      totalMentions: allMentions.length,
      positive,
      negative,
      neutral,
    };
  }

  // =======================
  // SEED DE TESTE
  // =======================

  async seedMentions() {
    const existing = await db.select().from(mentions).limit(1);
    if (existing.length > 0) {
      console.log("Banco já tem menções, não precisa seed.");
      return;
    }

    await db.insert(mentions).values([
      {
        content: "Primeira menção de teste",
        source: "Twitter",
        author: "@erick",
        publishedAt: new Date().toISOString(),
        sentiment: "positive",
        sentimentScore: 0.9,
        tags: JSON.stringify(["teste"]),
        isProcessed: 1,
        isStarred: 0,
      }
    ]);

    console.log("Seed de menções criada com sucesso!");
  }
}

// Singleton export
export const storage = new DatabaseStorage();

// roda o seed automaticamente
storage.seedMentions();
