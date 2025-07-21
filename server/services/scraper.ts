export interface ScrapedMention {
  content: string;
  source: string;
  sourceUrl?: string;
  author?: string;
  publishedAt: Date;
}

// Simple mock scraper for demonstration - in production would use real APIs
export class WebScraper {
  private mockData: ScrapedMention[] = [
    {
      content: "Excelente atendimento da empresa! Recomendo muito os serviços prestados. #satisfeito",
      source: "Twitter",
      sourceUrl: "https://twitter.com/user/status/123",
      author: "@usuario1",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      content: "Tive problemas com a entrega do produto. Demorou muito mais do que o prometido.",
      source: "Facebook",
      sourceUrl: "https://facebook.com/post/456",
      author: "João Silva",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      content: "Produto interessante, mas ainda estou avaliando se vale a pena o investimento.",
      source: "Instagram",
      sourceUrl: "https://instagram.com/p/789",
      author: "@maria_avaliacoes",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
    {
      content: "O suporte técnico foi muito prestativo e resolveu meu problema rapidamente!",
      source: "LinkedIn",
      sourceUrl: "https://linkedin.com/posts/abc",
      author: "Carlos Oliveira",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    },
    {
      content: "Preço um pouco alto, mas a qualidade compensa. Produto de boa procedência.",
      source: "Twitter",
      sourceUrl: "https://twitter.com/user/status/124",
      author: "@consumidor_tech",
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    },
  ];

  async searchMentions(query: string): Promise<ScrapedMention[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would make real API calls to:
    // - Google Custom Search API
    // - Twitter API v2
    // - Facebook Graph API
    // - RSS feeds
    // - News APIs
    
    // For now, return mock data filtered by query
    return this.mockData.filter(mention => 
      mention.content.toLowerCase().includes(query.toLowerCase()) ||
      mention.source.toLowerCase().includes(query.toLowerCase())
    );
  }

  async collectFromSources(queries: string[]): Promise<ScrapedMention[]> {
    const allMentions: ScrapedMention[] = [];
    
    for (const query of queries) {
      const mentions = await this.searchMentions(query);
      allMentions.push(...mentions);
    }
    
    // Remove duplicates based on content similarity
    const uniqueMentions = allMentions.filter((mention, index, array) => 
      array.findIndex(m => m.content === mention.content) === index
    );
    
    return uniqueMentions;
  }
}

export const scraper = new WebScraper();
