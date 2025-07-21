import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});

export interface SentimentAnalysisResult {
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  reasoning?: string;
}

export async function analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é um especialista em análise de sentimento para monitoramento de marca em português brasileiro. 
          Analise o sentimento do texto fornecido e responda em JSON com:
          - sentiment: "positive", "negative" ou "neutral"
          - confidence: número entre 0 e 1 indicando a confiança na análise
          - reasoning: breve explicação do porquê da classificação (opcional)
          
          Considere:
          - Contexto empresarial/comercial
          - Ironia e sarcasmo
          - Expressões coloquiais em português
          - Emojis e emoticons`,
        },
        {
          role: "user",
          content: `Analise o sentimento deste texto: "${text}"`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      sentiment: result.sentiment || "neutral",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      reasoning: result.reasoning,
    };
  } catch (error) {
    console.error("Erro na análise de sentimento:", error);
    throw new Error("Falha ao analisar sentimento: " + (error as Error).message);
  }
}

export interface TagSuggestion {
  tag: string;
  confidence: number;
}

export async function suggestTags(text: string, existingTags: string[] = []): Promise<TagSuggestion[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é um especialista em classificação de conteúdo para monitoramento de marca.
          Sugira até 3 tags relevantes para categorizar o texto fornecido.
          
          Tags existentes disponíveis: ${existingTags.join(", ")}
          
          Responda em JSON com um array de objetos contendo:
          - tag: nome da tag (prefira usar tags existentes quando apropriado)
          - confidence: confiança de 0 a 1
          
          Foque em aspectos como: produto, serviço, atendimento, entrega, suporte, qualidade, preço, etc.`,
        },
        {
          role: "user",
          content: `Sugira tags para este texto: "${text}"`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return (result.tags || []).map((tag: any) => ({
      tag: tag.tag || "",
      confidence: Math.max(0, Math.min(1, tag.confidence || 0.5)),
    }));
  } catch (error) {
    console.error("Erro na sugestão de tags:", error);
    return [];
  }
}

export async function generateReport(mentions: any[], dateRange: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é um especialista em análise de dados de monitoramento de marca.
          Gere um relatório executivo em português brasileiro com base nos dados de menções fornecidos.
          
          O relatório deve incluir:
          - Resumo executivo
          - Principais insights sobre sentimento
          - Tendências identificadas
          - Recomendações de ação
          
          Seja objetivo e profissional.`,
        },
        {
          role: "user",
          content: `Gere um relatório para o período ${dateRange} com base nestas menções:
          ${JSON.stringify(mentions.slice(0, 50))}`, // Limit to avoid token limits
        },
      ],
    });

    return response.choices[0].message.content || "Não foi possível gerar o relatório.";
  } catch (error) {
    console.error("Erro na geração de relatório:", error);
    throw new Error("Falha ao gerar relatório: " + (error as Error).message);
  }
}
