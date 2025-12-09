import { GoogleGenAI } from "@google/genai";
import { Lead } from "../types";

// Configuração da API Key
const API_KEY = 'AIzaSyAzXi2yTRm4E7vOKlbpNfntHlhd02m6Fs4'; 

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to find and parse JSON from a streaming text chunk
function extractJson(text: string): any[] {
  const jsonObjects = [];
  const codeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  const content = codeBlockMatch ? codeBlockMatch[1] : text;

  const leadsArrayMatch = content.match(/"leads"\s*:\s*(\[[\s\S]*)/);
  if (!leadsArrayMatch) return [];
  
  let arrayContent = leadsArrayMatch[1];
  
  let openBraces = 0;
  let currentObject = '';
  let inString = false;
  
  for (let i = 0; i < arrayContent.length; i++) {
    const char = arrayContent[i];
    
    if (char === '"' && (i === 0 || arrayContent[i-1] !== '\\')) {
      inString = !inString;
    }
    
    if (!inString) {
      if (char === '{') {
        openBraces++;
      }
      if (char === '}') {
        openBraces--;
      }
    }
    
    if (openBraces > 0) {
      currentObject += char;
    } else if (currentObject && char === '}') {
      currentObject += char;
      try {
        jsonObjects.push(JSON.parse(currentObject));
      } catch(e) {
        // Incomplete JSON, ignore
      }
      currentObject = '';
    }
  }

  return jsonObjects;
}

export async function* fetchLeadsStream(
    searchQuery: string, 
    coordinates: { lat: number; lng: number },
    radiusKm: number,
    leadCount: number
): AsyncGenerator<Omit<Lead, 'id' | 'webhookStatus'>> {
  
  const prompt = `É um especialista de classe mundial em geração de leads com capacidades avançadas de web-scraping.
A sua tarefa é encontrar uma lista de até ${leadCount} leads de negócio com base nos seguintes critérios: '${searchQuery}' num raio de ${radiusKm}km à volta das coordenadas latitude ${coordinates.lat} e longitude ${coordinates.lng}.

Siga este processo de múltiplos passos para cada lead potencial para garantir a máxima precisão e completude dos dados:
1.  **Descoberta (Google Maps):** Utilize o Google Maps para identificar empresas que correspondam aos critérios na área geográfica definida. Extraia informações centrais como Nome da Empresa, Morada, Telefone, Categoria, Avaliação e Número de Avaliações.
2.  **Enriquecimento (Google Search & Websites):** Para cada empresa, realize pesquisas direcionadas para encontrar o seu website oficial e perfis sociais. Vasculhe estas fontes para obter:
    *   **Contactos:** Email.
    *   **Redes Sociais:** LinkedIn, Facebook, Instagram, YouTube, X/Twitter, TikTok.
    *   **Dados da Empresa:** Ano de Fundação, Número de Empregados (pode ser uma estimativa ou um intervalo, ex: "11-50").
3.  **Montagem Final:** Consolide toda a informação na estrutura JSON precisa. Se uma informação não puder ser encontrada, utilize \`null\`.

O resultado final DEVE ser um único objeto JSON com uma chave "leads" contendo um array de objetos de lead.
A estrutura para cada objeto de lead é a seguinte:
{
  "generatedDate": "string (formato ISO 8601)",
  "searchCity": null, "searchCountry": null,
  "leadNumber": "integer",
  "companyName": "string",
  "category": "string",
  "description": "string | null",
  "address": "string | null", "city": "string | null", "country": "string | null",
  "coordinates": { "lat": "number", "lon": "number" } | null,
  "phone": "string | null", "email": "string | null", "website": "string | null",
  "linkedIn": "string | null", "facebook": "string | null", "instagram": "string | null",
  "youtube": "string | null", "twitter": "string | null", "tiktok": "string | null",
  "foundingYear": "integer | null", "employeeCount": "string | null",
  "rating": "number | null", "reviewCount": "integer | null",
  "businessHours": { "Monday": "string", ... } | null,
  "qualityScore": "integer (1-100)",
  "qualityReasoning": "string",
  "status": "'New'", "contacted": false, "notes": "''"
}

IMPORTANTE: A sua resposta inteira DEVE ser um objeto JSON envolvido num único bloco de código markdown. Envie os leads no array um a um à medida que os encontra.`;
  
  let fullResponseText = '';
  const yieldedLeadIds = new Set<string>();

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: coordinates.lat, longitude: coordinates.lng } } },
      },
    });

    for await (const chunk of stream) {
      fullResponseText += chunk.text;
      const parsedLeads = extractJson(fullResponseText);
      
      for (const lead of parsedLeads) {
        const leadId = `${lead.companyName}-${lead.address}`; 
        if (!yieldedLeadIds.has(leadId) && lead.companyName) {
            yield lead;
            yieldedLeadIds.add(leadId);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching leads from Gemini:", error);
    throw new Error("Falha ao obter uma resposta válida da IA.");
  }
}