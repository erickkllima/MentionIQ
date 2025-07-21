import { 
  users, mentions, tags, searchQueries, reports,
  type User, type InsertUser,
  type Mention, type InsertMention,
  type Tag, type InsertTag,
  type SearchQuery, type InsertSearchQuery,
  type Report, type InsertReport,
  type DashboardMetrics, type SentimentTrendData, type SourceVolumeData
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, inArray, sql, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Mentions
  getMentions(filters?: {
    sentiment?: string;
    source?: string;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<Mention[]>;
  getMentionById(id: number): Promise<Mention | undefined>;
  createMention(mention: InsertMention): Promise<Mention>;
  updateMention(id: number, updates: Partial<Mention>): Promise<Mention>;
  deleteMention(id: number): Promise<boolean>;
  getRecentMentions(limit?: number): Promise<Mention[]>;

  // Tags
  getTags(): Promise<Tag[]>;
  getTagById(id: number): Promise<Tag | undefined>;
  getTagByName(name: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  updateTag(id: number, updates: Partial<Tag>): Promise<Tag>;
  deleteTag(id: number): Promise<boolean>;
  incrementTagUsage(name: string): Promise<void>;

  // Search Queries
  getSearchQueries(): Promise<SearchQuery[]>;
  getActiveSearchQueries(): Promise<SearchQuery[]>;
  createSearchQuery(query: InsertSearchQuery): Promise<SearchQuery>;
  updateSearchQuery(id: number, updates: Partial<SearchQuery>): Promise<SearchQuery>;
  deleteSearchQuery(id: number): Promise<boolean>;

  // Reports
  getReports(): Promise<Report[]>;
  getReportById(id: number): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  deleteReport(id: number): Promise<boolean>;

  // Analytics
  getDashboardMetrics(): Promise<DashboardMetrics>;
  getSentimentTrend(days?: number): Promise<SentimentTrendData[]>;
  getSourceVolume(): Promise<SourceVolumeData[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Mentions
  async getMentions(filters?: {
    sentiment?: string;
    source?: string;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<Mention[]> {
    let queryBuilder = db.select().from(mentions);
    
    if (filters) {
      const conditions = [];
      
      if (filters.sentiment) {
        conditions.push(eq(mentions.sentiment, filters.sentiment));
      }
      
      if (filters.source) {
        conditions.push(eq(mentions.source, filters.source));
      }
      
      if (filters.startDate) {
        conditions.push(gte(mentions.publishedAt, filters.startDate));
      }
      
      if (filters.endDate) {
        conditions.push(lte(mentions.publishedAt, filters.endDate));
      }
      
      if (conditions.length > 0) {
        queryBuilder = queryBuilder.where(and(...conditions));
      }
      
      if (filters.limit) {
        queryBuilder = queryBuilder.limit(filters.limit);
      }
      
      if (filters.offset) {
        queryBuilder = queryBuilder.offset(filters.offset);
      }
    }
    
    queryBuilder = queryBuilder.orderBy(desc(mentions.collectedAt));
    
    return await queryBuilder;
  }

  async getMentionById(id: number): Promise<Mention | undefined> {
    const [mention] = await db.select().from(mentions).where(eq(mentions.id, id));
    return mention || undefined;
  }

  async createMention(insertMention: InsertMention): Promise<Mention> {
    const [mention] = await db
      .insert(mentions)
      .values(insertMention)
      .returning();
    return mention;
  }

  async updateMention(id: number, updates: Partial<Mention>): Promise<Mention> {
    const [mention] = await db
      .update(mentions)
      .set(updates)
      .where(eq(mentions.id, id))
      .returning();
    return mention;
  }

  async deleteMention(id: number): Promise<boolean> {
    const result = await db.delete(mentions).where(eq(mentions.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getRecentMentions(limit: number = 10): Promise<Mention[]> {
    return await db
      .select()
      .from(mentions)
      .orderBy(desc(mentions.collectedAt))
      .limit(limit);
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return await db
      .select()
      .from(tags)
      .orderBy(desc(tags.usageCount), tags.name);
  }

  async getTagById(id: number): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag || undefined;
  }

  async getTagByName(name: string): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.name, name));
    return tag || undefined;
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const [tag] = await db
      .insert(tags)
      .values(insertTag)
      .returning();
    return tag;
  }

  async updateTag(id: number, updates: Partial<Tag>): Promise<Tag> {
    const [tag] = await db
      .update(tags)
      .set(updates)
      .where(eq(tags.id, id))
      .returning();
    return tag;
  }

  async deleteTag(id: number): Promise<boolean> {
    const result = await db.delete(tags).where(eq(tags.id, id));
    return (result.rowCount || 0) > 0;
  }

  async incrementTagUsage(name: string): Promise<void> {
    await db
      .update(tags)
      .set({ usageCount: sql`${tags.usageCount} + 1` })
      .where(eq(tags.name, name));
  }

  // Search Queries
  async getSearchQueries(): Promise<SearchQuery[]> {
    return await db
      .select()
      .from(searchQueries)
      .orderBy(desc(searchQueries.createdAt));
  }

  async getActiveSearchQueries(): Promise<SearchQuery[]> {
    return await db
      .select()
      .from(searchQueries)
      .where(eq(searchQueries.isActive, true))
      .orderBy(desc(searchQueries.createdAt));
  }

  async createSearchQuery(insertQuery: InsertSearchQuery): Promise<SearchQuery> {
    const [query] = await db
      .insert(searchQueries)
      .values(insertQuery)
      .returning();
    return query;
  }

  async updateSearchQuery(id: number, updates: Partial<SearchQuery>): Promise<SearchQuery> {
    const [query] = await db
      .update(searchQueries)
      .set(updates)
      .where(eq(searchQueries.id, id))
      .returning();
    return query;
  }

  async deleteSearchQuery(id: number): Promise<boolean> {
    const result = await db.delete(searchQueries).where(eq(searchQueries.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Reports
  async getReports(): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .orderBy(desc(reports.generatedAt));
  }

  async getReportById(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report || undefined;
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const [report] = await db
      .insert(reports)
      .values(insertReport)
      .returning();
    return report;
  }

  async deleteReport(id: number): Promise<boolean> {
    const result = await db.delete(reports).where(eq(reports.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Analytics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const totalMentions = await db.select({ count: count() }).from(mentions);
    const positiveMentions = await db
      .select({ count: count() })
      .from(mentions)
      .where(eq(mentions.sentiment, "positive"));
    const negativeMentions = await db
      .select({ count: count() })
      .from(mentions)
      .where(eq(mentions.sentiment, "negative"));

    const total = totalMentions[0]?.count || 0;
    const positive = positiveMentions[0]?.count || 0;
    const negative = negativeMentions[0]?.count || 0;

    return {
      totalMentions: total,
      totalGrowth: "+12.5%", // This would be calculated based on historical data
      positive: positive,
      positiveGrowth: "+3.2%",
      negative: negative,
      negativeGrowth: "-1.8%",
      engagement: 4.2,
      engagementGrowth: "+0.7%",
    };
  }

  async getSentimentTrend(days: number = 7): Promise<SentimentTrendData[]> {
    // This would ideally use date functions to group by date
    // For now, return mock data structure that matches expected format
    const result: SentimentTrendData[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      result.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        positive: Math.floor(Math.random() * 20) + 10,
        neutral: Math.floor(Math.random() * 15) + 5,
        negative: Math.floor(Math.random() * 10) + 3,
      });
    }
    
    return result;
  }

  async getSourceVolume(): Promise<SourceVolumeData[]> {
    const sourceCounts = await db
      .select({
        source: mentions.source,
        count: count()
      })
      .from(mentions)
      .groupBy(mentions.source);
    
    const total = sourceCounts.reduce((sum, item) => sum + item.count, 0);
    
    return sourceCounts.map(item => ({
      source: item.source,
      count: item.count,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
    }));
  }

  async seedInitialData(): Promise<void> {
    try {
      // Check if data already exists
      const existingMentions = await this.getMentions({ limit: 1 });
      if (existingMentions.length > 0) {
        console.log("Database already contains data, skipping seed.");
        return;
      }

      // Create initial tags
      const initialTags = [
        { name: "Atendimento", color: "#3B82F6" },
        { name: "Produto", color: "#10B981" },
        { name: "Preço", color: "#F59E0B" },
        { name: "Qualidade", color: "#8B5CF6" },
        { name: "Entrega", color: "#EF4444" },
      ];

      for (const tagData of initialTags) {
        await this.createTag(tagData);
      }

      // Create initial search queries
      const initialQueries = [
        { query: "nossa empresa", isActive: true },
        { query: "nosso produto", isActive: true },
      ];

      for (const queryData of initialQueries) {
        await this.createSearchQuery(queryData);
      }

      // Create sample mentions
      const sampleMentions = [
        {
          content: "Excelente atendimento da empresa! Recomendo muito os serviços prestados. #satisfeito",
          source: "Twitter",
          sourceUrl: "https://twitter.com/user/status/123",
          author: "@usuario1",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          sentiment: "positive" as const,
          sentimentScore: 0.95,
          tags: ["Atendimento"],
          isProcessed: true,
          isStarred: false,
        },
        {
          content: "O produto tem boa qualidade, mas o preço está um pouco alto comparado aos concorrentes.",
          source: "Facebook",
          sourceUrl: "https://facebook.com/post/456",
          author: "João Silva",
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          sentiment: "neutral" as const,
          sentimentScore: 0.6,
          tags: ["Produto", "Preço"],
          isProcessed: true,
          isStarred: false,
        },
        {
          content: "Tive problemas com a entrega, chegou com atraso de 3 dias. Espero que melhorem esse ponto.",
          source: "Instagram",
          sourceUrl: "https://instagram.com/p/789",
          author: "@maria_cliente",
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          sentiment: "negative" as const,
          sentimentScore: 0.8,
          tags: ["Entrega"],
          isProcessed: true,
          isStarred: false,
        },
        {
          content: "Comprei o produto na semana passada e estou muito satisfeito! Superou minhas expectativas.",
          source: "LinkedIn",
          sourceUrl: "https://linkedin.com/post/101112",
          author: "Carlos Mendes",
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          sentiment: "positive" as const,
          sentimentScore: 0.92,
          tags: ["Produto", "Qualidade"],
          isProcessed: true,
          isStarred: true,
        },
        {
          content: "O suporte respondeu rapidamente minha dúvida. Parabéns pela eficiência!",
          source: "Twitter",
          sourceUrl: "https://twitter.com/user2/status/131415",
          author: "@cliente_feliz",
          publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
          sentiment: "positive" as const,
          sentimentScore: 0.88,
          tags: ["Atendimento"],
          isProcessed: true,
          isStarred: false,
        },
      ];

      for (const mentionData of sampleMentions) {
        await this.createMention(mentionData);
      }

      console.log("Database seeded with initial data successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }
}

// Create and initialize storage instance
const databaseStorage = new DatabaseStorage();

// Seed initial data on startup
databaseStorage.seedInitialData();

export const storage = databaseStorage;