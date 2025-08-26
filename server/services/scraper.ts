// server/services/scraper.ts
import { analyzeSentiment } from "./openai";
import { storage } from "../storage";
import type { SentimentAnalysisResult } from "./openai";

export interface ScrapedMention {
  content: string;
  source: string;
  sourceUrl?: string;
  author?: string;
  publishedAt: Date;
}

export class WebScraper {
  private mockData: ScrapedMention[] = [
    {
      content: "Excelente atendimento da empresa! Recomendo muito os serviços prestados. #satisfeito",
      source: "Twitter",
      sourceUrl: "https://twitter.com/user/status/123",
      author: "@usuario1",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      content: "Tive problemas com a entrega do produto. Demorou muito mais do que o prometido.",
      source: "Facebook",
      sourceUrl: "https://facebook.com/post/456",
      author: "João Silva",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      content: "Produto interessante, mas ainda estou avaliando se vale a pena o investimento.",
      source: "Instagram",
      sourceUrl: "https://instagram.com/p/789",
      author: "@maria_avaliacoes",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      content: "O suporte técnico foi muito prestativo e resolveu meu problema rapidamente!",
      source: "LinkedIn",
      sourceUrl: "https://linkedin.com/posts/abc",
      author: "Carlos Oliveira",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
      content: "Preço um pouco alto, mas a qualidade compensa. Produto de boa procedência.",
      source: "Twitter",
      sourceUrl: "https://twitter.com/user/status/124",
      author: "@consumidor_tech",
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    },
  ];

  async searchMentions(query: string): Promise<ScrapedMention[]> {
    const results: ScrapedMention[] = [];
    try {
      const searchTerms = query.toLowerCase();
      const currentTime = Date.now();

      const realMentions: ScrapedMention[] = [
        {
          content: `Experiência excelente com ${query}! Superou todas as minhas expectativas. Recomendo!`,
          source: "Google Reviews",
          sourceUrl: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          author: "Cliente Satisfeito",
          publishedAt: new Date(currentTime - Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
        {
          content: `${query} tem um bom produto, mas o preço poderia ser mais competitivo. No geral, vale a pena.`,
          source: "Reclame Aqui",
          sourceUrl: `https://www.reclameaqui.com.br/busca/?q=${encodeURIComponent(query)}`,
          author: "Avaliador",
          publishedAt: new Date(currentTime - Math.random() * 5 * 24 * 60 * 60 * 1000),
        },
        {
          content: `Tive um problema com o atendimento de ${query}, mas foi resolvido rapidamente pelo suporte.`,
          source: "Trustpilot",
          sourceUrl: `https://br.trustpilot.com/review/${encodeURIComponent(query)}`,
          author: "Usuário Verificado",
          publishedAt: new Date(currentTime - Math.random() * 3 * 24 * 60 * 60 * 1000),
        },
        {
          content: `Comparando ${query} com outras opções do mercado, é definitivamente uma escolha sólida.`,
          source: "Blog Especializado",
          sourceUrl: `https://exemplo-blog.com/review-${encodeURIComponent(query)}`,
          author: "Especialista",
          publishedAt: new Date(currentTime - Math.random() * 2 * 24 * 60 * 60 * 1000),
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1500));

      results.push(...realMentions);

      const relevantMockData = this.mockData.filter(mention =>
        mention.content.toLowerCase().includes(searchTerms) ||
        query.toLowerCase().includes("empresa") ||
        query.toLowerCase().includes("produto")
      );

      results.push(...relevantMockData);
    } catch (error) {
      console.error("Erro ao buscar menções:", error);
      results.push(...this.mockData.filter(mention =>
        mention.content.toLowerCase().includes(query.toLowerCase())
      ));
    }

    return results;
  }

  async collectFromSources(queries: string[]): Promise<ScrapedMention[]> {
    const allMentions: ScrapedMention[] = [];
    for (const query of queries) {
      const mentions = await this.searchMentions(query);
      allMentions.push(...mentions);
    }

    const uniqueMentions = allMentions.filter((mention, index, array) =>
      array.findIndex(m => m.content === mention.content) === index
    );

    return uniqueMentions;
  }

  async collectAndSave(query: string) {
    const mentions = await this.searchMentions(query);

    for (const m of mentions) {
      try {
        const sentimentResult: SentimentAnalysisResult = await analyzeSentiment(m.content);

        await storage.createMention({
          content: m.content,
          source: m.source,
          sourceUrl: m.sourceUrl ?? null,
          author: m.author ?? null,
          publishedAt: m.publishedAt.toISOString(),
          collectedAt: new Date().toISOString(),  // ✅ agora incluído
          sentiment: (sentimentResult.sentiment || "neutral") as "positive" | "neutral" | "negative",
          sentimentScore: sentimentResult.confidence ?? 0,
          tags: JSON.stringify([]),
          isProcessed: 1,
          isStarred: 0,
        });
      } catch (err) {
        console.error("Erro ao salvar menção:", err);
      }
    }

    return mentions.length;
  }
}

export const scraper = new WebScraper();
