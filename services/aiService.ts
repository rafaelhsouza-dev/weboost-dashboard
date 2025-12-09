import { Lead } from "../types";

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
const API_ENDPOINT = 'https://api.weboost.pt/gemini/fetch-leads';


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

    // Make the direct API request
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json', // Adiciona o cabeçalho Accept
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Tratamento de erros geral para a chamada direta à API
      if (response.status === 504) {
        throw new Error(`Timeout ao acessar a API (Status 504). A requisição demorou muito para ser concluída.`);
      } else if (response.status === 429) {
        throw new Error(`Limite de requisições excedido na API (Status 429). Tente novamente mais tarde.`);
      } else {
        throw new Error(`A requisição da API falhou com status: ${response.status}`);
      }
    }

    const data = await response.json();

    // Yield each lead from the response
    if (data && data.leads && Array.isArray(data.leads)) {
      for (const lead of data.leads) {
        yield lead;
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
