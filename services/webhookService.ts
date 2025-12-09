import { Lead } from '../types';

const WEBHOOK_URL = 'https://webhook.rhsdigital.com.br/webhook/scrap-ai';

export async function sendLeadsToWebhook(leads: Lead[]): Promise<boolean> {
  if (leads.length === 0) {
    return true; 
  }
  
  try {
    // Remove properties internal to the frontend before sending
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