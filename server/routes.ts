// server/routes.ts
import { Express, Request, Response } from "express";
import { storage } from "./storage";
import { WebScraper } from "./services/scraper";

export async function registerRoutes(app: Express) {
  const scraper = new WebScraper();

  // =============================
  // Teste / Healthcheck
  // =============================
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // =============================
  // Buscar todas as menções
  // =============================
  app.get("/api/mentions", async (_req: Request, res: Response) => {
    try {
      const mentions = await storage.getMentions();
      res.json(mentions);
    } catch (err) {
      console.error("Erro detalhado em /api/mentions:", err);
      res.status(500).json({ error: "Erro ao buscar menções" });
    }
  });

  // =============================
  // Estatísticas do Dashboard
  // =============================
  app.get("/api/dashboard", async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (err) {
      console.error("Erro detalhado em /api/dashboard:", err);
      res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
  });

  // =============================
  // Coletar menções com queries
  // =============================
  app.post("/api/collect", async (req: Request, res: Response) => {
    try {
      const { queries } = req.body;

      if (!queries || !Array.isArray(queries) || queries.length === 0) {
        return res.status(400).json({ error: "Queries inválidas. Envie um array de strings." });
      }

      const count = await scraper.collectAndSave(queries[0]); // por enquanto, pega só a primeira
      res.json({ message: `Coleta finalizada`, collected: count });
    } catch (err) {
      console.error("Erro detalhado em /api/collect:", err);
      res.status(500).json({ error: "Erro na coleta" });
    }
  });

  // =============================
  // Preview de busca personalizada
  // =============================
  app.post("/api/search-preview", async (req: Request, res: Response) => {
    try {
      const { query } = req.body;

      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query inválida. Envie um texto para busca." });
      }

      const mentions = await scraper.searchMentions(query);
      res.json(mentions);
    } catch (err) {
      console.error("Erro detalhado em /api/search-preview:", err);
      res.status(500).json({ error: "Erro ao realizar busca" });
    }
  });

  return app;
}
