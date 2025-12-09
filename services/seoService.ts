import { GoogleGenAI, Type } from "@google/genai";
import { SeoReport } from "../types";
import { getGeminiApiKey } from "./config";

const MODEL_NAME = "gemini-2.5-flash";

// Helper: Robust JSON extraction (same as Scraper)
function extractJson(text: string): any {
  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Remove Markdown code blocks
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (e2) {
        // Continue to cleaning
      }
    }
    
    // 3. Aggressive cleaning (finding first { and last })
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      const jsonStr = text.substring(start, end + 1);
      try {
        return JSON.parse(jsonStr);
      } catch (e3) {
        console.error("Failed to parse JSON even after cleaning:", e3);
        throw new Error("Formato de resposta inválido da IA.");
      }
    }
    throw new Error("Nenhum JSON encontrado na resposta.");
  }
}

// Helper: Fetch Real HTML Content via CORS Proxy
async function fetchHtmlContent(url: string): Promise<string | null> {
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    // Use allorigins as a public CORS proxy to read HTML from the frontend
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data.contents) return null;

    // Truncate to avoid token limits (keep Head + top of Body)
    return data.contents.substring(0, 25000); 
  } catch (error) {
    console.warn("Could not fetch HTML directly (CORS/Block), relying on Gemini Grounding:", error);
    return null;
  }
}

export const generateSeoAudit = async (
  url: string, 
  objective: string = "", 
  competitorUrls: string = ""
): Promise<SeoReport> => {
  
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    console.error("Chave de API do Gemini não configurada (VITE_API_KEY_GEMINI)");
    throw new Error("Chave de API do Gemini não configurada.");
  }
  const ai = new GoogleGenAI({ apiKey });

  // 1. Try to get Real Content
  const realHtml = await fetchHtmlContent(url);
  
  let sourceContext = "";
  if (realHtml) {
    sourceContext = `
    --- INÍCIO DO CÓDIGO FONTE REAL DO SITE (${url}) ---
    ${realHtml}
    --- FIM DO CÓDIGO FONTE ---
    
    INSTRUÇÃO: Analise o código fonte acima para extrair Title, Description, H1 e Schema real. NÃO INVENTE DADOS.
    `;
  } else {
    sourceContext = `
    INSTRUÇÃO: Não foi possível acessar o HTML diretamente. Use a ferramenta 'googleSearch' para encontrar os metadados atuais, título e descrição do site: ${url}.
    `;
  }

  const objectiveContext = objective 
    ? `OBJETIVO DO UTILIZADOR: "${objective}". Avalie se o conteúdo atual (Source ou Search) atinge este objetivo.`
    : "Objetivo não informado. Deduza o objetivo comercial baseando-se no conteúdo.";

  const competitorContext = competitorUrls
    ? `CONCORRENTES: ${competitorUrls}. Compare a lacuna de palavras-chave.`
    : "Identifique concorrentes online automaticamente.";

  const prompt = `
    Você é um Auditor Técnico de SEO Sênior e Especialista em GEO (Generative Engine Optimization).
    
    Tarefa: Realizar auditoria para ${url}.
    
    ${sourceContext}
    
    ${objectiveContext}
    ${competitorContext}

    Requisitos da Resposta JSON:
    1. **Technical**: Analise sitemap, robots, tags title/meta reais.
    2. **Content**: Extraia keywords reais do texto fornecido ou da pesquisa.
    3. **Schema**: Verifique se existe no HTML fornecido. Se não, sugira.
    4. **Recommendations**: Focadas em correções do que foi encontrado.
    
    Retorne APENAS o JSON válido seguindo este schema exato, sem markdown adicional.
  `;

  try {
    // Tools like googleSearch/googleMaps are not available on public Generative Language API.
    // Also, contents must be structured as role/parts.
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // New SDK exposes text() as a function on the response object
    const text = typeof (response as any).text === 'function' ? (response as any).text() : (response as any).text;
    if (!text) throw new Error("Sem resposta da IA");
    
    // Robust parsing
    const parsed = extractJson(text);
    return parsed as SeoReport;

  } catch (error) {
    console.error("Audit generation failed:", error);
    throw error;
  }
};