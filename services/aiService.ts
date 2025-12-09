import { Lead } from "../types";

/**
 * Serviço para buscar leads da API externa
 * 
 * NOTA SOBRE CORS E PROXIES:
 * Devido a restrições de CORS, não é possível fazer chamadas diretas do navegador para a API.
 * A API não inclui os cabeçalhos CORS necessários (Access-Control-Allow-Origin) para permitir
 * requisições de origens diferentes (como dashboard.weboost.pt).
 * 
 * Para contornar isso, utilizamos múltiplos proxies CORS que adicionam os cabeçalhos necessários.
 * O sistema tenta cada proxy em sequência até encontrar um que funcione.
 * 
 * Se um proxy falhar (por timeout, limite de requisições, etc.), o sistema tentará o próximo.
 * Isso aumenta a resiliência da aplicação contra falhas em serviços de proxy individuais.
 */

// API endpoint for fetching leads
const API_ENDPOINT = 'https://api.weboost.pt/gemini/fetch-leads';
// Lista de proxies CORS para contornar restrições de CORS
// Isso é necessário porque a API não tem o cabeçalho 'Access-Control-Allow-Origin'
// que permite solicitações de outros domínios (como dashboard.weboost.pt)
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',  // Priorizado por ser mais estável
  'https://thingproxy.freeboard.io/fetch/',
  'https://cors-proxy.htmldriven.com/?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://corsproxy.io/?'  // Movido para o final pois está tendo problemas de timeout
];

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

    let lastError = null;
    let data = null;

    // Tenta cada proxy na lista até que um funcione
    for (const proxy of CORS_PROXIES) {
      try {
        // Use CORS proxy to make the API request
        const proxyUrl = `${proxy}${encodeURIComponent(API_ENDPOINT)}`;

        console.log(`Tentando proxy: ${proxy}`);

        // Make the API request through the proxy
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          // Tratamento específico para diferentes códigos de status HTTP
          if (response.status === 504) {
            throw new Error(`Timeout ao acessar a API através do proxy ${proxy} (Status 504). A requisição demorou muito para ser concluída.`);
          } else if (response.status === 429) {
            throw new Error(`Limite de requisições excedido no proxy ${proxy} (Status 429). Tente novamente mais tarde.`);
          } else {
            throw new Error(`API request failed with status: ${response.status}`);
          }
        }

        // Se chegou aqui, o proxy funcionou
        data = await response.json();
        console.log(`Proxy ${proxy} funcionou com sucesso`);
        break; // Sai do loop se o proxy funcionou
      } catch (proxyError) {
        console.warn(`Proxy ${proxy} falhou:`, proxyError);
        lastError = proxyError;
        // Continua para o próximo proxy
      }
    }

    // Se nenhum proxy funcionou
    if (!data) {
      const proxyList = CORS_PROXIES.join(', ');
      throw lastError || new Error(`Todos os proxies CORS falharam (${proxyList}). Verifique a conexão com a internet ou se os serviços de proxy estão disponíveis.`);
    }

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
     * 1. Erros de CORS - Quando todos os proxies falham devido a problemas de CORS
     * 2. Erros de timeout - Quando a requisição demora muito para ser concluída
     * 3. Erros de limite de requisições - Quando um proxy ou a API limita o número de requisições
     */

    // Mensagens de erro mais específicas para diferentes tipos de problemas
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      const proxyList = CORS_PROXIES.join(', ');
      throw new Error(`Erro de CORS ao acessar a API. Todos os proxies CORS (${proxyList}) falharam. Verifique a conexão com a internet ou se os serviços de proxy estão disponíveis.`);
    }

    // Detecta erros de timeout (504 Gateway Timeout)
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
      throw new Error(`Limite de requisições excedido. Tente novamente mais tarde.`);
    }

    // Erro genérico com sugestão de ação para o usuário
    throw new Error(`Falha ao obter uma resposta válida da API: ${error.message || 'Erro desconhecido'}. Tente novamente mais tarde ou entre em contato com o suporte se o problema persistir.`);
  }
}
