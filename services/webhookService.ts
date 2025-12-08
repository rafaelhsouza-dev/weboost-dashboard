import { Lead } from '../types';

// The Webhook URL must be configured via environment variables for security
const WEBHOOK_URL = "https://webhook.rhsdigital.com.br/webhook/scrap-ai";

export async function sendLeadsToWebhook(leads: Lead[]): Promise<boolean> {
  if (leads.length === 0) {
    return true; // Nothing to send
  }

  if (!WEBHOOK_URL) {
    console.error("CRITICAL: VITE_WEBHOOK_URL_SCRAPER_AI is not defined. Cannot send data.");
    alert("Configuração ausente: WEBHOOK_URL não encontrada no ficheiro .env.");
    return false;
  }
  
  try {
    // We remove client-side only properties from each lead before sending
    // Keep 'webhookStatus' out of the payload sent to external service
    const payload = leads.map(lead => {
      const { id, webhookStatus, ...leadData } = lead;
      return leadData;
    });

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leads: payload }),
    });

    if (!response.ok) {
      console.error(`Webhook failed with status: ${response.status}`, await response.text());
      return false;
    }
    
    console.log(`Successfully sent ${leads.length} leads to webhook.`);
    return true;
  } catch (error) {
    console.error('Error sending leads to webhook:', error);
    return false;
  }
}