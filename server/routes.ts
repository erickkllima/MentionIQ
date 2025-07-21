import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSentiment, suggestTags, generateReport } from "./services/openai";
import { scraper } from "./services/scraper";
import { insertMentionSchema, insertTagSchema, insertSearchQuerySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (_req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar métricas" });
    }
  });

  app.get("/api/dashboard/sentiment-trend", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const trend = await storage.getSentimentTrend(days);
      res.json(trend);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar tendência de sentimento" });
    }
  });

  app.get("/api/dashboard/source-volume", async (_req, res) => {
    try {
      const sourceVolume = await storage.getSourceVolume();
      res.json(sourceVolume);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar volume por fonte" });
    }
  });

  // Mentions CRUD
  app.get("/api/mentions", async (req, res) => {
    try {
      const filters = {
        sentiment: req.query.sentiment as string,
        source: req.query.source as string,
        tags: req.query.tags ? (req.query.tags as string).split(",") : undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };
      
      const mentions = await storage.getMentions(filters);
      res.json(mentions);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar menções" });
    }
  });

  app.get("/api/mentions/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const mentions = await storage.getRecentMentions(limit);
      res.json(mentions);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar menções recentes" });
    }
  });

  app.get("/api/mentions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mention = await storage.getMentionById(id);
      if (!mention) {
        return res.status(404).json({ message: "Menção não encontrada" });
      }
      res.json(mention);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar menção" });
    }
  });

  app.post("/api/mentions", async (req, res) => {
    try {
      const validatedData = insertMentionSchema.parse(req.body);
      const mention = await storage.createMention(validatedData);
      res.status(201).json(mention);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar menção" });
    }
  });

  app.patch("/api/mentions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const mention = await storage.updateMention(id, updates);
      res.json(mention);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar menção" });
    }
  });

  app.delete("/api/mentions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMention(id);
      if (!deleted) {
        return res.status(404).json({ message: "Menção não encontrada" });
      }
      res.json({ message: "Menção excluída com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir menção" });
    }
  });

  // Sentiment analysis
  app.post("/api/mentions/:id/analyze", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mention = await storage.getMentionById(id);
      
      if (!mention) {
        return res.status(404).json({ message: "Menção não encontrada" });
      }

      const analysis = await analyzeSentiment(mention.content);
      
      const updatedMention = await storage.updateMention(id, {
        sentiment: analysis.sentiment,
        sentimentScore: analysis.confidence,
        isProcessed: true,
      });

      res.json({ mention: updatedMention, analysis });
    } catch (error) {
      res.status(500).json({ message: "Erro ao analisar sentimento" });
    }
  });

  app.post("/api/mentions/analyze-batch", async (req, res) => {
    try {
      const { mentionIds } = req.body;
      const results = [];

      for (const id of mentionIds) {
        const mention = await storage.getMentionById(id);
        if (mention && !mention.isProcessed) {
          const analysis = await analyzeSentiment(mention.content);
          
          const updatedMention = await storage.updateMention(id, {
            sentiment: analysis.sentiment,
            sentimentScore: analysis.confidence,
            isProcessed: true,
          });

          results.push({ mention: updatedMention, analysis });
        }
      }

      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Erro ao analisar menções em lote" });
    }
  });

  // Tags CRUD
  app.get("/api/tags", async (_req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar tags" });
    }
  });

  app.post("/api/tags", async (req, res) => {
    try {
      const validatedData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(validatedData);
      res.status(201).json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar tag" });
    }
  });

  app.patch("/api/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const tag = await storage.updateTag(id, updates);
      res.json(tag);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar tag" });
    }
  });

  app.delete("/api/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTag(id);
      if (!deleted) {
        return res.status(404).json({ message: "Tag não encontrada" });
      }
      res.json({ message: "Tag excluída com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir tag" });
    }
  });

  // Search queries
  app.get("/api/search-queries", async (_req, res) => {
    try {
      const queries = await storage.getSearchQueries();
      res.json(queries);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar consultas de busca" });
    }
  });

  app.post("/api/search-queries", async (req, res) => {
    try {
      const validatedData = insertSearchQuerySchema.parse(req.body);
      const query = await storage.createSearchQuery(validatedData);
      res.status(201).json(query);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar consulta de busca" });
    }
  });

  // Collection/scraping
  app.post("/api/collect", async (_req, res) => {
    try {
      const activeQueries = await storage.getActiveSearchQueries();
      const queryStrings = activeQueries.map(q => q.query);
      
      const scrapedMentions = await scraper.collectFromSources(queryStrings);
      const createdMentions = [];
      
      for (const scraped of scrapedMentions) {
        // Check if mention already exists
        const existing = await storage.getMentions({
          limit: 1000 // Check against recent mentions
        });
        
        const isDuplicate = existing.some(m => 
          m.content.trim() === scraped.content.trim() && 
          m.source === scraped.source
        );
        
        if (!isDuplicate) {
          const mention = await storage.createMention({
            content: scraped.content,
            source: scraped.source,
            sourceUrl: scraped.sourceUrl || null,
            author: scraped.author || null,
            publishedAt: scraped.publishedAt,
            sentiment: null,
            sentimentScore: null,
            tags: [],
          });
          
          createdMentions.push(mention);
        }
      }
      
      res.json({ 
        message: `Coletadas ${createdMentions.length} novas menções`,
        mentions: createdMentions 
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao coletar menções" });
    }
  });

  // Reports
  app.get("/api/reports", async (_req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar relatórios" });
    }
  });

  app.post("/api/reports/generate", async (req, res) => {
    try {
      const { title, dateRange, filters } = req.body;
      
      // Get mentions for the report
      const mentions = await storage.getMentions(filters);
      
      // Calculate metrics
      const totalMentions = mentions.length;
      const positiveCount = mentions.filter(m => m.sentiment === "positive").length;
      const neutralCount = mentions.filter(m => m.sentiment === "neutral").length;
      const negativeCount = mentions.filter(m => m.sentiment === "negative").length;
      
      const report = await storage.createReport({
        title,
        dateRange,
        filters: JSON.stringify(filters),
        totalMentions,
        positiveCount,
        neutralCount,
        negativeCount,
      });
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Erro ao gerar relatório" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
