import { GoogleGenAI, Type } from "@google/genai";
import { SeoReport } from "../types";

const apiKey = import.meta.env.VITE_API_KEY_GEMINI;
const MODEL_NAME = "gemini-2.5-flash";

if (!apiKey) {
  console.error("ERRO: VITE_API_KEY_GEMINI não configurada.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "dummy_key_to_prevent_crash_on_init" });

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
  
  if (!apiKey) throw new Error("API Key do Gemini não configurada no ficheiro .env");

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
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        // We use googleSearch as fallback if HTML fetch failed or for competitive info
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            url: { type: Type.STRING },
            userObjective: { type: Type.STRING },
            timestamp: { type: Type.STRING },
            score: { type: Type.INTEGER },
            scoreJustification: { type: Type.STRING },
            objectiveAnalysis: {
              type: Type.OBJECT,
              properties: {
                alignmentScore: { type: Type.INTEGER },
                analysis: { type: Type.STRING },
                missingTopics: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              nullable: true
            },
            technical: {
              type: Type.OBJECT,
              properties: {
                infrastructure: {
                  type: Type.OBJECT,
                  properties: {
                    sitemap: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, status: {type: Type.STRING}, details: {type: Type.STRING} } },
                    robotsTxt: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, status: {type: Type.STRING}, details: {type: Type.STRING} } },
                    aiProtocols: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, status: {type: Type.STRING}, details: {type: Type.STRING} } }
                  }
                },
                titleTag: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.STRING },
                    length: { type: Type.INTEGER },
                    status: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    suggestedValue: { type: Type.STRING }
                  }
                },
                metaDescription: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.STRING },
                    length: { type: Type.INTEGER },
                    status: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    suggestedValue: { type: Type.STRING }
                  }
                },
                h1: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, status: { type: Type.STRING } } },
                coreKeywords: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { keyword: { type: Type.STRING }, volume: { type: Type.STRING }, difficulty: { type: Type.INTEGER } }
                  }
                },
                primaryTopicCluster: { type: Type.STRING },
                fleschKincaidGrade: { type: Type.NUMBER },
                coreWebVitals: {
                  type: Type.OBJECT,
                  properties: { lcp: { type: Type.STRING }, fid: { type: Type.STRING }, cls: { type: Type.STRING }, status: { type: Type.STRING } }
                },
                mobileFriendly: { type: Type.BOOLEAN },
                structuredData: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { type: { type: Type.STRING }, status: { type: Type.STRING }, details: { type: Type.STRING } }
                  }
                }
              }
            },
            ranking: {
              type: Type.OBJECT,
              properties: {
                searchIntent: { type: Type.STRING },
                intentMatch: { type: Type.STRING },
                gapAnalysis: { type: Type.STRING },
                competitors: {
                  type: Type.ARRAY,
                  items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, keywordOverlap: { type: Type.INTEGER } } }
                }
              }
            },
            recommendations: {
              type: Type.OBJECT,
              properties: {
                traditional: { type: Type.ARRAY, items: { type: Type.STRING } },
                aiGeo: { type: Type.ARRAY, items: { type: Type.STRING } },
                schemaSuggestion: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, reasoning: { type: Type.STRING }, codeSnippet: { type: Type.STRING } } },
                topicalAuthorityTip: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");
    
    // Robust parsing
    const parsed = extractJson(text);
    return parsed as SeoReport;

  } catch (error) {
    console.error("Audit generation failed:", error);
    throw error;
  }
};