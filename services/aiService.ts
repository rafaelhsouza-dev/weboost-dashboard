import { Lead, WebhookStatus } from "../types";
import { apiPost, handleApiResponse } from './apiClient';


/**
 * Serviço para buscar leads da API externa
 * 
 * NOTA SOBRE CORS:
 * Esta função fará uma chamada direta para a API. Certifique-se de que a API
 * esteja configurada para permitir requisições de origem cruzada (CORS) do domínio
 * onde o dashboard está hospedado, ou que a política de segurança do navegador
 * permita esta requisição.
 */

// API endpoint for fetching leads
const API_ENDPOINT = '/gemini/fetch-leads';

interface ApiLead {
  generatedDate: string;
  companyName: string;
  category: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  coordinates: { lat: number; lng: number; } | null;
  contacts: {
    phone: string | null;
    email: string | null;
    website: string | null;
  };
  socialMedia: {
    linkedin: string | null;
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
    twitter: string | null;
    tiktok: string | null;
    pinterest: string | null;
  };
  details: {
    foundingYear: number | null;
    employeeCount: string | null;
    rating: number | null;
    reviewCount: number | null;
    businessHours: any | null;
  };
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  id: string;
  webhookStatus: WebhookStatus;
}

function mapApiLeadToLead(apiLead: ApiLead, index: number): Omit<Lead, 'id' | 'webhookStatus'> {
  // A simple quality score based on available data.
  let qualityScore = 50;
  const reasoning = [];
  if (apiLead.contacts.website) {
    qualityScore += 10;
    reasoning.push("Website disponível.");
  }
  if (apiLead.contacts.email) {
    qualityScore += 5;
    reasoning.push("Email disponível.");
  }
  if (apiLead.contacts.phone) {
    qualityScore += 5;
    reasoning.push("Telefone disponível.");
  }
  if (apiLead.socialMedia.linkedin) {
    qualityScore += 5;
    reasoning.push("LinkedIn disponível.");
  }
  if (apiLead.details.rating && apiLead.details.rating > 0) {
    qualityScore += 10;
    reasoning.push("Avaliações disponíveis.");
  }
  if (apiLead.description) {
      qualityScore += 5;
      reasoning.push("Descrição disponível.");
  }
  if (qualityScore > 100) qualityScore = 100;

  return {
    // Manually map fields from apiLead that are also in Lead
    generatedDate: apiLead.generatedDate,
    companyName: apiLead.companyName,
    category: apiLead.category,
    description: apiLead.description,
    address: apiLead.address,
    city: apiLead.city,
    country: apiLead.country,
    status: apiLead.status,

    // Flatten nested objects
    phone: apiLead.contacts.phone,
    email: apiLead.contacts.email,
    website: apiLead.contacts.website,
    linkedIn: apiLead.socialMedia.linkedin,
    facebook: apiLead.socialMedia.facebook,
    instagram: apiLead.socialMedia.instagram,
    youtube: apiLead.socialMedia.youtube,
    twitter: apiLead.socialMedia.twitter,
    tiktok: apiLead.socialMedia.tiktok,
    foundingYear: apiLead.details.foundingYear,
    employeeCount: apiLead.details.employeeCount,
    rating: apiLead.details.rating,
    reviewCount: apiLead.details.reviewCount,
    businessHours: apiLead.details.businessHours,
    coordinates: apiLead.coordinates ? { lat: apiLead.coordinates.lat, lon: apiLead.coordinates.lng } : null,

    // Fill in missing fields with default values
    leadNumber: index + 1,
    searchCity: apiLead.city, 
    searchCountry: apiLead.country,
    qualityScore: qualityScore,
    qualityReasoning: reasoning.length > 0 ? reasoning.join(" ") : "Dados básicos disponíveis.",
    contacted: false,
    notes: "",
  };
}


/**
 * Busca leads da API externa usando proxies CORS
 * 
 * Esta função geradora assíncrona busca leads da API e os retorna um a um.
 * Ela tenta múltiplos proxies CORS em sequência até encontrar um que funcione.
 * Se todos os proxies falharem, ela lança um erro com uma mensagem detalhada.
 * 
 * @param searchQuery - Termo de pesquisa para buscar leads (ex: "Agências de Marketing")
 * @param coordinates - Coordenadas geográficas (latitude e longitude) para centralizar a busca
 * @param radiusKm - Raio de busca em quilômetros
 * @param leadCount - Número máximo de leads a serem retornados
 * @returns Um gerador assíncrono que produz objetos Lead um a um
 * @throws Error se todos os proxies falharem ou se a API retornar um erro
 */
export async function* fetchLeadsStream(
    searchQuery: string, 
    coordinates: { lat: number; lng: number },
    radiusKm: number,
    leadCount: number
): AsyncGenerator<Omit<Lead, 'id' | 'webhookStatus'>> {

  try {
    // Prepare the payload according to the new API requirements
    const payload = {
      search_query: searchQuery,
      coordinates: {
        lat: coordinates.lat,
        lng: coordinates.lng
      },
      radius_km: radiusKm,
      lead_count: leadCount
    };

    // Make the authenticated API request using the new apiClient
    const response = await apiPost(API_ENDPOINT, payload);
    const data = await handleApiResponse(response);

    // Yield each lead from the response
    if (data && data.leads && Array.isArray(data.leads)) {
      for (const [index, apiLead] of (data.leads as ApiLead[]).entries()) {
        yield mapApiLeadToLead(apiLead, index);
      }
    }
  } catch (error) {
    console.error("Error fetching leads from API:", error);

    /**
     * Tratamento de erros específicos
     * 
     * Este bloco identifica diferentes tipos de erros comuns em requisições de API
     * e fornece mensagens de erro mais específicas e úteis para o usuário.
     * 
     * Os erros são categorizados em:
     * 1. Erros de rede/CORS - Quando a requisição não pode ser feita ou é bloqueada por CORS.
     * 2. Erros de timeout - Quando a requisição demora muito para ser concluída.
     * 3. Erros de limite de requisições - Quando a API limita o número de requisições.
     */

    // Mensagens de erro mais específicas para diferentes tipos de problemas
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(`Erro de rede ou CORS ao acessar a API. Verifique sua conexão com a internet e as configurações de CORS da API.`);
    }

    // Detecta erros de timeout (504 Gateway Timeout, ou erro de rede/servidor que implica timeout)
    if (error.message && (
        error.message.includes('timeout') || 
        error.message.includes('Timeout') || 
        error.message.includes('504')
    )) {
      throw new Error(`Timeout ao acessar a API. A requisição demorou muito para ser concluída. Tente novamente mais tarde ou verifique se a API está disponível.`);
    }

    // Detecta erros de limite de requisições (429 Too Many Requests)
    if (error.message && (
        error.message.includes('429') || 
        error.message.includes('rate limit') || 
        error.message.includes('too many requests')
    )) {
      throw new Error(`Limite de requisições excedido na API. Tente novamente mais tarde.`);
    }

    // Erro genérico com sugestão de ação para o usuário
    throw new Error(`Falha ao obter uma resposta válida da API: ${error.message || 'Erro desconhecido'}. Tente novamente mais tarde ou entre em contato com o suporte se o problema persistir.`);
  }
}
