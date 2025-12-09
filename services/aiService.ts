import { Lead } from "../types";

// API endpoint for fetching leads
const API_ENDPOINT = 'https://api.weboost.pt/gemini/fetch-leads';

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

    // Make the API request
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
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
    throw new Error("Falha ao obter uma resposta válida da API.");
  }
}
