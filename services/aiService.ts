import { Lead } from "../types";

// API endpoint for fetching leads
const API_ENDPOINT = 'https://api.weboost.pt/gemini/fetch-leads';
// Lista de proxies CORS para contornar restrições de CORS
// Isso é necessário porque a API não tem o cabeçalho 'Access-Control-Allow-Origin'
// que permite solicitações de outros domínios (como dashboard.weboost.pt)
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/'
];

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
          throw new Error(`API request failed with status: ${response.status}`);
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

    // Mensagem de erro mais específica para problemas de CORS
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      const proxyList = CORS_PROXIES.join(', ');
      throw new Error(`Erro de CORS ao acessar a API. Todos os proxies CORS (${proxyList}) falharam. Verifique a conexão com a internet ou se os serviços de proxy estão disponíveis.`);
    }

    throw new Error("Falha ao obter uma resposta válida da API.");
  }
}
