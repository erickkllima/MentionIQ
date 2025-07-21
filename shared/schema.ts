import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const mentions = pgTable("mentions", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  source: text("source").notNull(), // Twitter, Facebook, Instagram, etc.
  sourceUrl: text("source_url"),
  author: text("author"),
  publishedAt: timestamp("published_at").notNull(),
  collectedAt: timestamp("collected_at").defaultNow().notNull(),
  sentiment: text("sentiment"), // positive, negative, neutral
  sentimentScore: real("sentiment_score"), // 0-1 confidence score
  tags: text("tags").array().default([]),
  isProcessed: boolean("is_processed").default(false),
  isStarred: boolean("is_starred").default(false),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").default("#3B82F6"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  usageCount: integer("usage_count").default(0),
});

export const searchQueries = pgTable("search_queries", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastExecuted: timestamp("last_executed"),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  dateRange: text("date_range").notNull(),
  filters: text("filters"), // JSON string of applied filters
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  totalMentions: integer("total_mentions").default(0),
  positiveCount: integer("positive_count").default(0),
  neutralCount: integer("neutral_count").default(0),
  negativeCount: integer("negative_count").default(0),
});

// Insert schemas
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

// Types
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Dashboard metrics type
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

// Sentiment trend data type
export type SentimentTrendData = {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
};

// Source volume data type
export type SourceVolumeData = {
  source: string;
  count: number;
  percentage: number;
};
