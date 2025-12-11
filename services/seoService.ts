
import { GoogleGenAI } from "@google/genai";
import { SeoReport } from "../types";

const API_KEY = 'chave_api';
const MODEL_NAME = "gemini-2.5-flash";

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper: Robust JSON extraction
function extractJson(text: string): any {
  let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    const start = cleanText.indexOf('{');
    const end = cleanText.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      const jsonStr = cleanText.substring(start, end + 1);
      try {
        return JSON.parse(jsonStr);
      } catch (e2) {
        console.error("Failed to parse extracted JSON:", e2);
      }
    }
    throw new Error("A IA retornou dados mas não foi possível processar o formato JSON.");
  }
}

// Helper: Fetch Real HTML Content via Multiple Proxies
async function fetchHtmlContent(url: string): Promise<string | null> {
  if (!url.startsWith('http')) url = 'https://' + url;

  // List of proxies to try in order
  const proxies = [
    (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`, // Returns JSON with contents
    (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}` // Returns raw HTML
  ];

  for (const proxyGen of proxies) {
    try {
      const fetchUrl = proxyGen(url);
      const response = await fetch(fetchUrl);
      if (!response.ok) continue;

      // Handle allorigins JSON wrapper
      if (fetchUrl.includes('allorigins')) {
        const data = await response.json();
        if (data.contents) return data.contents;
      } else {
        // Raw text
        return await response.text();
      }
    } catch (e) {
      console.warn("Proxy failed, trying next...", e);
    }
  }
  return null;
}

// Helper: Check if a file exists (Status 200) via Proxy
async function checkFileExistence(baseUrl: string, filename: string): Promise<{ status: 'Pass' | 'Fail' | 'Warning', details: string }> {
  if (!baseUrl.startsWith('http')) baseUrl = 'https://' + baseUrl;
  // Remove trailing slash if present
  baseUrl = baseUrl.replace(/\/$/, "");
  const fileUrl = `${baseUrl}/${filename}`;
  
  try {
    // We use corsproxy.io for HEAD/GET check
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(fileUrl)}`;
    const response = await fetch(proxyUrl, { method: 'GET' });
    
    if (response.status === 200) {
      return { status: 'Pass', details: `Arquivo encontrado em ${fileUrl}` };
    } else if (response.status === 403 || response.status === 401) {
       return { status: 'Warning', details: `Acesso negado (${response.status}). O arquivo pode existir mas bloqueia bots.` };
    } else {
      return { status: 'Fail', details: `Não encontrado (Status ${response.status})` };
    }
  } catch (e) {
    return { status: 'Warning', details: "Não foi possível verificar via proxy." };
  }
}

// Helper: Extract Metadata via Regex (Ground Truth)
function extractMetadata(html: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  
  // Open Graph / Social
  const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);

  // Viewport
  const viewport = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["'][^>]*>/i);

  // Simple Keyword Density (Top 5 words > 4 chars)
  const bodyText = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').toLowerCase();
  const words = bodyText.match(/\b[a-z\u00C0-\u00FF]{4,}\b/g) || [];
  const freq: Record<string, number> = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);
  const topKeywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(k => k[0]).join(', ');

  return {
    title: titleMatch ? titleMatch[1].trim() : null,
    description: descMatch ? descMatch[1].trim() : null,
    h1: h1Match ? h1Match[1].trim() : null,
    ogTitle: ogTitle ? ogTitle[1].trim() : null,
    ogDesc: ogDesc ? ogDesc[1].trim() : null,
    ogImage: ogImage ? ogImage[1].trim() : null,
    isMobileFriendly: !!viewport,
    detectedKeywords: topKeywords
  };
}

export const generateSeoAudit = async (
  url: string, 
  objective: string = "", 
  competitorUrls: string = ""
): Promise<SeoReport> => {
  
  // 1. Parallel Fetching: HTML + Infrastructure Files
  const [realHtml, sitemapCheck, robotsCheck, aiTxtCheck] = await Promise.all([
    fetchHtmlContent(url),
    checkFileExistence(url, 'sitemap.xml'),
    checkFileExistence(url, 'robots.txt'),
    checkFileExistence(url, 'ai.txt'), // Emerging standard for AI crawlers
  ]);
  
  // 2. Extract Ground Truth
  let meta = { 
    title: null as string | null, 
    description: null as string | null, 
    h1: null as string | null,
    ogTitle: null as string | null,
    ogDesc: null as string | null,
    ogImage: null as string | null,
    isMobileFriendly: false,
    detectedKeywords: ""
  };

  let sourceContext = "";

  if (realHtml) {
    meta = extractMetadata(realHtml);
    sourceContext = `
    --- DADOS REAIS EXTRAÍDOS VIA CÓDIGO (USE ESTES VALORES) ---
    Title Real: "${meta.title || 'Não encontrado'}"
    Meta Description Real: "${meta.description || 'Não encontrada'}"
    H1 Real: "${meta.h1 || 'Não encontrado'}"
    Palavras mais frequentes no texto: "${meta.detectedKeywords}"
    OpenGraph Image: "${meta.ogImage || 'Não encontrada'}"
    Mobile Viewport Detectado: ${meta.isMobileFriendly ? 'Sim' : 'Não'}
    ------------------------------------------------------------
    
    Abaixo, um trecho do HTML para análise de Schema e contexto:
    ${realHtml.substring(0, 15000)}
    `;
  } else {
    sourceContext = `
    AVISO CRÍTICO: Não foi possível acessar o HTML diretamente (Bloqueio de Proxy).
    Você DEVE usar a ferramenta 'googleSearch' para descobrir o Title e Description atuais exatos.
    `;
  }

  const prompt = `
    Realize uma auditoria técnica de SEO para: ${url}.

    OBJETIVO DO CLIENTE: "${objective || 'Melhorar ranking orgânico'}"
    CONCORRENTES: "${competitorUrls}"
    
    INFRAESTRUTURA (JÁ VERIFICADA VIA CÓDIGO - NÃO INVENTE OUTRO RESULTADO):
    - Sitemap.xml: ${JSON.stringify(sitemapCheck)}
    - Robots.txt: ${JSON.stringify(robotsCheck)}
    - AI Protocol (ai.txt): ${JSON.stringify(aiTxtCheck)}

    CONTEXTO HTML:
    ${sourceContext}

    INSTRUÇÕES:
    1. Preencha 'technical.infrastructure' com os dados de infraestrutura fornecidos acima.
    2. Nos campos 'value' de titleTag e metaDescription, use os dados extraídos acima.
    3. Analise as 'coreKeywords' com base no texto mais frequente do site que forneci e no nicho.
    4. Analise o 'structuredData' (Schema.org) olhando para o HTML fornecido (procure scripts type="application/ld+json").
    5. No 'recommendations.aiGeo', sugira como melhorar para Search Generative Experience (SGE), considerando se o site tem ai.txt ou não.

    ESTRUTURA JSON ESPERADA:
    {
      "url": "${url}",
      "timestamp": "ISO String",
      "score": Number (0-100),
      "scoreJustification": "String",
      "objectiveAnalysis": { "alignmentScore": Number, "analysis": "String", "missingTopics": ["String"] },
      "technical": {
        "infrastructure": {
          "sitemap": { "name": "Sitemap.xml", "status": "Pass|Fail|Warning", "details": "String" },
          "robotsTxt": { "name": "Robots.txt", "status": "Pass|Fail|Warning", "details": "String" },
          "aiProtocols": { "name": "AI.txt (GEO)", "status": "Pass|Fail|Warning", "details": "String" }
        },
        "titleTag": { "value": "String (O Real)", "length": Number, "status": "Good|Warning|Critical", "recommendation": "String", "suggestedValue": "String" },
        "metaDescription": { "value": "String (A Real)", "length": Number, "status": "Good|Warning|Critical", "recommendation": "String", "suggestedValue": "String" },
        "h1": { "value": "String", "status": "Good|Warning|Critical" },
        "coreKeywords": [{ "keyword": "String", "volume": "High|Medium|Low", "difficulty": Number }],
        "mobileFriendly": Boolean,
        "coreWebVitals": { "status": "Pass|Fail" },
        "structuredData": [{ "type": "String", "status": "Valid|Error", "details": "String" }]
      },
      "ranking": {
        "searchIntent": "String",
        "intentMatch": "String",
        "competitors": [{ "name": "String", "keywordOverlap": Number }]
      },
      "recommendations": {
        "traditional": ["String"],
        "aiGeo": ["String"],
        "schemaSuggestion": { "type": "String", "codeSnippet": "String" },
        "topicalAuthorityTip": "String"
      },
      "socialPreview": {
         "title": "${meta.ogTitle || meta.title || ''}",
         "description": "${meta.ogDesc || meta.description || ''}",
         "image": "${meta.ogImage || ''}"
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou resposta.");
    
    const json = extractJson(text);
    
    // Inject Social Data if AI missed it (Optional, but good for robustness)
    if (!json.socialPreview) {
        json.socialPreview = {
            title: meta.ogTitle || meta.title,
            description: meta.ogDesc || meta.description,
            image: meta.ogImage
        };
    }

    return json as SeoReport & { socialPreview?: any };

  } catch (error) {
    console.error("SEO Audit Error:", error);
    throw error;
  }
};
