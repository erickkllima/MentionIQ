import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ==== USERS ====
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// ==== MENTIONS ====
export const mentions = sqliteTable("mentions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  source: text("source").notNull(),
  sourceUrl: text("source_url"),
  author: text("author"),
  publishedAt: text("published_at").notNull(),      // ISO string
  collectedAt: text("collected_at").notNull().default("CURRENT_TIMESTAMP"),
  sentiment: text("sentiment"),
  sentimentScore: real("sentiment_score"),
  tags: text("tags"),                              // JSON string, se quiser múltiplas tags
  isProcessed: integer("is_processed").default(0), // boolean (0/1)
  isStarred: integer("is_starred").default(0),     // boolean (0/1)
});

// ==== TAGS ====
export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  color: text("color").default("#3B82F6"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  usageCount: integer("usage_count").default(0),
});

// ==== SEARCH QUERIES ====
export const searchQueries = sqliteTable("search_queries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  query: text("query").notNull(),
  isActive: integer("is_active").default(1), // boolean (0/1)
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  lastExecuted: text("last_executed"),
});

// ==== REPORTS ====
export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  dateRange: text("date_range").notNull(),
  filters: text("filters"), // JSON string de filtros aplicados
  generatedAt: text("generated_at").notNull().default("CURRENT_TIMESTAMP"),
  totalMentions: integer("total_mentions").default(0),
  positiveCount: integer("positive_count").default(0),
  neutralCount: integer("neutral_count").default(0),
  negativeCount: integer("negative_count").default(0),
});

// ============== ZOD INSERT SCHEMAS ==============
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMentionSchema = createInsertSchema(mentions).omit({
  id: true,
  collectedAt: true,
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
  usageCount: true,
});

export const insertSearchQuerySchema = createInsertSchema(searchQueries).omit({
  id: true,
  createdAt: true,
  lastExecuted: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  generatedAt: true,
});

// ============== TYPES ==============
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMention = z.infer<typeof insertMentionSchema>;
export type Mention = typeof mentions.$inferSelect;

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export type InsertSearchQuery = z.infer<typeof insertSearchQuerySchema>;
export type SearchQuery = typeof searchQueries.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

// ============== DASHBOARD METRICS TYPES ==============
export type DashboardMetrics = {
  totalMentions: number;
  totalGrowth: string;
  positive: number;
  positiveGrowth: string;
  negative: number;
  negativeGrowth: string;
  engagement: number;
  engagementGrowth: string;
};

export type SentimentTrendData = {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
};

export type SourceVolumeData = {
  source: string;
  count: number;
  percentage: number;
};
