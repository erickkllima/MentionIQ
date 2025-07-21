import { 
  users, mentions, tags, searchQueries, reports,
  type User, type InsertUser,
  type Mention, type InsertMention,
  type Tag, type InsertTag,
  type SearchQuery, type InsertSearchQuery,
  type Report, type InsertReport,
  type DashboardMetrics, type SentimentTrendData, type SourceVolumeData
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private mentions: Map<number, Mention>;
  private tags: Map<number, Tag>;
  private searchQueries: Map<number, SearchQuery>;
  private reports: Map<number, Report>;
  private currentUserId: number;
  private currentMentionId: number;
  private currentTagId: number;
  private currentQueryId: number;
  private currentReportId: number;

  constructor() {
    this.users = new Map();
    this.mentions = new Map();
    this.tags = new Map();
    this.searchQueries = new Map();
    this.reports = new Map();
    this.currentUserId = 1;
    this.currentMentionId = 1;
    this.currentTagId = 1;
    this.currentQueryId = 1;
    this.currentReportId = 1;

    // Initialize with some sample data for demonstration
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample tags
    const sampleTags = [
      { name: "Atendimento", color: "#3B82F6" },
      { name: "Produto", color: "#10B981" },
      { name: "Entrega", color: "#8B5CF6" },
      { name: "Suporte", color: "#F59E0B" },
    ];

    sampleTags.forEach(tag => {
      const id = this.currentTagId++;
      this.tags.set(id, {
        id,
        ...tag,
        createdAt: new Date(),
        usageCount: Math.floor(Math.random() * 100) + 20,
      });
    });

    // Create sample search queries
    const sampleQueries = [
      "nossa empresa",
      "nosso produto",
      "nossa marca",
    ];

    sampleQueries.forEach(query => {
      const id = this.currentQueryId++;
      this.searchQueries.set(id, {
        id,
        query,
        isActive: true,
        createdAt: new Date(),
        lastExecuted: new Date(),
      });
    });

    // Create sample mentions for demonstration
    const sampleMentions = [
      {
        content: "Excelente atendimento da empresa! Recomendo muito os serviços prestados. #satisfeito",
        source: "Twitter",
        sourceUrl: "https://twitter.com/user/status/123",
        author: "@usuario1",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        sentiment: "positive" as const,
        sentimentScore: 0.89,
        tags: ["Atendimento"],
        isProcessed: true,
        isStarred: false,
      },
      {
        content: "Tive problemas com a entrega do produto. Demorou muito mais do que o prometido.",
        source: "Facebook",
        sourceUrl: "https://facebook.com/post/456",
        author: "João Silva",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        sentiment: "negative" as const,
        sentimentScore: 0.82,
        tags: ["Entrega"],
        isProcessed: true,
        isStarred: false,
      },
      {
        content: "Produto interessante, mas ainda estou avaliando se vale a pena o investimento.",
        source: "Instagram",
        sourceUrl: "https://instagram.com/p/789",
        author: "@maria_avaliacoes",
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        sentiment: "neutral" as const,
        sentimentScore: 0.65,
        tags: ["Produto"],
        isProcessed: true,
        isStarred: false,
      },
      {
        content: "O suporte técnico foi muito prestativo e resolveu meu problema rapidamente!",
        source: "LinkedIn",
        sourceUrl: "https://linkedin.com/posts/abc",
        author: "Carlos Oliveira",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        sentiment: "positive" as const,
        sentimentScore: 0.94,
        tags: ["Suporte"],
        isProcessed: true,
        isStarred: true,
      },
      {
        content: "Preço um pouco alto, mas a qualidade compensa. Produto de boa procedência.",
        source: "Twitter",
        sourceUrl: "https://twitter.com/user/status/124",
        author: "@consumidor_tech",
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
        sentiment: "neutral" as const,
        sentimentScore: 0.72,
        tags: ["Produto"],
        isProcessed: true,
        isStarred: false,
      },
    ];

    sampleMentions.forEach(mention => {
      const id = this.currentMentionId++;
      this.mentions.set(id, {
        id,
        collectedAt: new Date(),
        ...mention,
      });
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
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
    let mentions = Array.from(this.mentions.values());

    if (filters) {
      if (filters.sentiment) {
        mentions = mentions.filter(m => m.sentiment === filters.sentiment);
      }
      if (filters.source) {
        mentions = mentions.filter(m => m.source === filters.source);
      }
      if (filters.tags && filters.tags.length > 0) {
        mentions = mentions.filter(m => 
          m.tags && filters.tags!.some(tag => m.tags!.includes(tag))
        );
      }
      if (filters.startDate) {
        mentions = mentions.filter(m => m.publishedAt >= filters.startDate!);
      }
      if (filters.endDate) {
        mentions = mentions.filter(m => m.publishedAt <= filters.endDate!);
      }
    }

    mentions.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    if (filters?.offset) {
      mentions = mentions.slice(filters.offset);
    }
    if (filters?.limit) {
      mentions = mentions.slice(0, filters.limit);
    }

    return mentions;
  }

  async getMentionById(id: number): Promise<Mention | undefined> {
    return this.mentions.get(id);
  }

  async createMention(insertMention: InsertMention): Promise<Mention> {
    const id = this.currentMentionId++;
    const mention: Mention = {
      ...insertMention,
      id,
      collectedAt: new Date(),
      isProcessed: insertMention.isProcessed ?? false,
      isStarred: insertMention.isStarred ?? false,
      sentiment: insertMention.sentiment ?? null,
      sentimentScore: insertMention.sentimentScore ?? null,
      sourceUrl: insertMention.sourceUrl ?? null,
      author: insertMention.author ?? null,
      tags: insertMention.tags ?? [],
    };
    this.mentions.set(id, mention);
    return mention;
  }

  async updateMention(id: number, updates: Partial<Mention>): Promise<Mention> {
    const mention = this.mentions.get(id);
    if (!mention) {
      throw new Error("Mention not found");
    }
    const updatedMention = { ...mention, ...updates };
    this.mentions.set(id, updatedMention);
    return updatedMention;
  }

  async deleteMention(id: number): Promise<boolean> {
    return this.mentions.delete(id);
  }

  async getRecentMentions(limit = 10): Promise<Mention[]> {
    return this.getMentions({ limit });
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values()).sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
  }

  async getTagById(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }

  async getTagByName(name: string): Promise<Tag | undefined> {
    return Array.from(this.tags.values()).find(tag => tag.name === name);
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.currentTagId++;
    const tag: Tag = {
      ...insertTag,
      id,
      color: insertTag.color ?? "#3B82F6",
      createdAt: new Date(),
      usageCount: 0,
    };
    this.tags.set(id, tag);
    return tag;
  }

  async updateTag(id: number, updates: Partial<Tag>): Promise<Tag> {
    const tag = this.tags.get(id);
    if (!tag) {
      throw new Error("Tag not found");
    }
    const updatedTag = { ...tag, ...updates };
    this.tags.set(id, updatedTag);
    return updatedTag;
  }

  async deleteTag(id: number): Promise<boolean> {
    return this.tags.delete(id);
  }

  async incrementTagUsage(name: string): Promise<void> {
    const tag = await this.getTagByName(name);
    if (tag) {
      await this.updateTag(tag.id, { usageCount: (tag.usageCount || 0) + 1 });
    }
  }

  // Search Queries
  async getSearchQueries(): Promise<SearchQuery[]> {
    return Array.from(this.searchQueries.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getActiveSearchQueries(): Promise<SearchQuery[]> {
    return Array.from(this.searchQueries.values()).filter(q => q.isActive);
  }

  async createSearchQuery(insertQuery: InsertSearchQuery): Promise<SearchQuery> {
    const id = this.currentQueryId++;
    const query: SearchQuery = {
      ...insertQuery,
      id,
      isActive: insertQuery.isActive ?? true,
      createdAt: new Date(),
      lastExecuted: null,
    };
    this.searchQueries.set(id, query);
    return query;
  }

  async updateSearchQuery(id: number, updates: Partial<SearchQuery>): Promise<SearchQuery> {
    const query = this.searchQueries.get(id);
    if (!query) {
      throw new Error("Search query not found");
    }
    const updatedQuery = { ...query, ...updates };
    this.searchQueries.set(id, updatedQuery);
    return updatedQuery;
  }

  async deleteSearchQuery(id: number): Promise<boolean> {
    return this.searchQueries.delete(id);
  }

  // Reports
  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values()).sort((a, b) => 
      b.generatedAt.getTime() - a.generatedAt.getTime()
    );
  }

  async getReportById(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const report: Report = {
      ...insertReport,
      id,
      filters: insertReport.filters ?? null,
      totalMentions: insertReport.totalMentions ?? 0,
      positiveCount: insertReport.positiveCount ?? 0,
      neutralCount: insertReport.neutralCount ?? 0,
      negativeCount: insertReport.negativeCount ?? 0,
      generatedAt: new Date(),
    };
    this.reports.set(id, report);
    return report;
  }

  async deleteReport(id: number): Promise<boolean> {
    return this.reports.delete(id);
  }

  // Analytics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const mentions = Array.from(this.mentions.values());
    const totalMentions = mentions.length;
    
    const positiveCount = mentions.filter(m => m.sentiment === "positive").length;
    const negativeCount = mentions.filter(m => m.sentiment === "negative").length;
    
    const positivePercentage = totalMentions > 0 ? Math.round((positiveCount / totalMentions) * 100) : 0;
    const negativePercentage = totalMentions > 0 ? Math.round((negativeCount / totalMentions) * 100) : 0;

    return {
      totalMentions,
      totalGrowth: "+12.5%",
      positive: positivePercentage,
      positiveGrowth: "+3.2%",
      negative: negativePercentage,
      negativeGrowth: "-1.8%",
      engagement: 4.2,
      engagementGrowth: "+0.7%",
    };
  }

  async getSentimentTrend(days = 7): Promise<SentimentTrendData[]> {
    const trendData: SentimentTrendData[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayMentions = Array.from(this.mentions.values()).filter(m => {
        const mentionDate = new Date(m.publishedAt);
        return mentionDate.toDateString() === date.toDateString();
      });
      
      const total = dayMentions.length;
      const positive = total > 0 ? Math.round((dayMentions.filter(m => m.sentiment === "positive").length / total) * 100) : 0;
      const negative = total > 0 ? Math.round((dayMentions.filter(m => m.sentiment === "negative").length / total) * 100) : 0;
      const neutral = 100 - positive - negative;
      
      trendData.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        positive,
        neutral,
        negative,
      });
    }
    
    return trendData;
  }

  async getSourceVolume(): Promise<SourceVolumeData[]> {
    const mentions = Array.from(this.mentions.values());
    const sourceCount = new Map<string, number>();
    
    mentions.forEach(mention => {
      const count = sourceCount.get(mention.source) || 0;
      sourceCount.set(mention.source, count + 1);
    });
    
    const total = mentions.length;
    const sourceData: SourceVolumeData[] = [];
    
    sourceCount.forEach((count, source) => {
      sourceData.push({
        source,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      });
    });
    
    return sourceData.sort((a, b) => b.count - a.count);
  }
}

export const storage = new MemStorage();
