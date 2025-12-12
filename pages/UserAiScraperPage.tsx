import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MapPicker } from '../components/MapPicker';
import LeadsTable from '../components/LeadsTable';
import { Bot, Search, Loader2, Download } from 'lucide-react';
import { Lead, WebhookStatus } from '../types';
import { fetchLeadsStream } from '../services/aiService';

export const UserAiScraperPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('Restaurantes Italianos');
  const [radius, setRadius] = useState(5); // km
  const [maxLeads, setMaxLeads] = useState(10);
  const [coordinates, setCoordinates] = useState({ lat: 38.7223, lng: -9.1393 }); // Lisbon default

  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleLocationChange = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
  };

  const handleScrape = async () => {
    setIsLoading(true);
    setLeads([]); // Clear previous results

    try {
      const stream = fetchLeadsStream(searchTerm, coordinates, radius, maxLeads);

      let count = 0;
      for await (const partialLead of stream) {
        if (count >= maxLeads) break;

        const newLead: Lead = {
          ...partialLead,
          id: `lead-${Date.now()}-${count}`, // Temporary ID
          webhookStatus: WebhookStatus.IDLE // Keeping this for compatibility with the Lead type
        };

        setLeads(prev => [...prev, newLead]);
        count++;
      }

    } catch (error) {
      console.error("Error scraping:", error);
      alert("Ocorreu um erro durante a pesquisa. Verifique se a API Key está configurada.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
           <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
             <Bot className="text-primary h-5 w-5"/> AI Scraper & Enriquecimento
           </h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Geração de leads B2B com inteligência artificial.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        <Card className="lg:col-span-1 space-y-6">
          <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <Search size={18} /> Configuração da Pesquisa
          </h3>

          <div>
            <Input 
              label="Termo de Pesquisa (Nicho)" 
              placeholder="Ex: Agências de Marketing, Dentistas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Input 
                label="Raio (km)" 
                type="number" 
                value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
             />
             <Input 
                label="Max Leads" 
                type="number" 
                value={maxLeads} 
                onChange={(e) => setMaxLeads(Number(e.target.value))}
             />
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-xs text-blue-800 dark:text-blue-200">
             <p className="font-semibold">Localização Central:</p>
             <p>{coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</p>
             <p className="mt-1 opacity-75">Clique no mapa para alterar o centro.</p>
          </div>

          <Button 
            fullWidth 
            onClick={handleScrape} 
            disabled={isLoading}
            className="flex items-center justify-center gap-2"
          >
            {isLoading ? <><Loader2 className="animate-spin" size={18}/> A Pesquisar...</> : <><Bot size={18}/> Iniciar AI Scraper</>}
          </Button>
        </Card>

        {/* Map Panel */}
        <div className="lg:col-span-2 h-[500px] rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 relative z-0">
          <MapPicker 
            lat={coordinates.lat} 
            lng={coordinates.lng} 
            radius={radius} 
            onLocationChange={handleLocationChange} 
          />
        </div>
      </div>

      {/* Results */}
      {leads.length > 0 && (
        <div className="animate-fade-in space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resultados Encontrados ({leads.length})</h3>
             <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2"/> Exportar CSV
                </Button>
             </div>
          </div>

          <LeadsTable leads={leads} />

          <div className="mt-4 p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-xs overflow-x-auto border border-gray-800">
             <pre>{JSON.stringify({ leads: leads.slice(0, 1) }, null, 2)}</pre>
             <p className="text-gray-500 mt-2">... (exibindo 1 de {leads.length} para preview JSON)</p>
          </div>
        </div>
      )}
    </div>
  );
};
