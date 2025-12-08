import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  ScanSearch, Loader2, CheckCircle, AlertTriangle, XCircle, 
  Activity, Terminal, Globe, Smartphone, Zap, Server, 
  Target, Copy, Plus, X, ChevronUp, ChevronDown, ArrowRight
} from 'lucide-react';
import { generateSeoAudit } from '../services/seoService';
import { SeoReport } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  RadialBarChart, RadialBar 
} from 'recharts';

export const SeoAnalysisPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false); // Starts hidden
  
  const [objective, setObjective] = useState('');
  
  // Competitors State
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState('');

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SeoReport | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'content'>('overview');

  const handleAddCompetitor = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation();
    
    if (newCompetitor.trim()) {
      setCompetitors([...competitors, newCompetitor.trim()]);
      setNewCompetitor('');
    }
  };

  const handleRemoveCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setReport(null); 
    try {
      const competitorsString = competitors.join(', ');
      const data = await generateSeoAudit(url, objective, competitorsString);
      setReport(data);
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar análise SEO. A IA pode não ter conseguido acessar o site ou o formato da resposta falhou. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (!status) return <Activity className="text-gray-400 w-5 h-5" />;
    const s = status.toLowerCase();
    if (s === 'good' || s === 'pass' || s === 'valid') return <CheckCircle className="text-green-500 w-5 h-5" />;
    if (s === 'warning') return <AlertTriangle className="text-yellow-500 w-5 h-5" />;
    return <XCircle className="text-red-500 w-5 h-5" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 50) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ScanSearch className="text-primary" /> Auditoria SEO & GEO (AI Search)
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Análise técnica e semântica com dados reais e Inteligência Artificial.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className={`transition-all duration-500 ease-in-out`}>
        <Card className="bg-gradient-to-r from-white to-blue-50/50 dark:from-[#1a1a1a] dark:to-blue-900/10 border border-gray-200 dark:border-gray-800 shadow-lg">
          <form onSubmit={handleAudit} className="space-y-6 p-2">
            
            {/* Main URL Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">
                URL do Website <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-4 py-3 text-base dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm"
                  placeholder="exemplo.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Advanced Toggle */}
            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm font-medium text-primary hover:text-blue-700 transition-colors"
            >
              {showAdvanced ? 'Ocultar Opções Avançadas' : 'Mostrar Opções Avançadas'}
              {showAdvanced ? <ChevronUp size={16} className="ml-1"/> : <ChevronDown size={16} className="ml-1"/>}
            </button>

            {/* Advanced Fields */}
            {showAdvanced && (
              <div className="space-y-6 animate-fade-in border-t border-gray-100 dark:border-gray-800 pt-6">
                
                {/* Objective */}
                <div className="space-y-2">
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                     Objetivo do Site <span className="text-gray-400 font-normal">(Opcional)</span>
                   </label>
                   <textarea 
                     className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[80px]"
                     placeholder="Ex: Agência focada em SEO e IA, queremos atrair diretores de marketing..."
                     value={objective}
                     onChange={(e) => setObjective(e.target.value)}
                   />
                   <p className="text-xs text-gray-500">Ajudará a IA a identificar lacunas entre o conteúdo atual e a sua meta.</p>
                </div>

                {/* Competitors (Dynamic List) */}
                <div className="space-y-2">
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                     Concorrentes <span className="text-gray-400 font-normal">(Opcional)</span>
                   </label>
                   
                   {/* Add Competitor Input */}
                   <div className="flex gap-2">
                      <input 
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        placeholder="https://concorrente.com"
                        value={newCompetitor}
                        onChange={(e) => setNewCompetitor(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault(); // CRITICAL: Stop Form Submit
                            handleAddCompetitor(e);
                          }
                        }}
                      />
                      <Button type="button" variant="secondary" onClick={handleAddCompetitor}>
                        <Plus size={18} />
                      </Button>
                   </div>

                   {/* List */}
                   {competitors.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-3">
                       {competitors.map((comp, index) => (
                         <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{comp}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveCompetitor(index)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-[50px] text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
              >
                {loading ? (
                  <><Loader2 className="animate-spin mr-2" size={20} /> A Analisar Site...</>
                ) : (
                  <>Gerar Auditoria Completa <ArrowRight size={20} className="ml-2" /></>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {report && (
        <div className="animate-fade-in space-y-8">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
             <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
             >
                Visão Geral
             </button>
             <button 
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'content' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
             >
                Conteúdo & Palavras-chave
             </button>
             <button 
                onClick={() => setActiveTab('technical')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'technical' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
             >
                Saúde Técnica
             </button>
          </div>

          {/* === OVERVIEW TAB === */}
          {activeTab === 'overview' && (
             <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Score Card */}
                <div className="md:col-span-4 lg:col-span-3">
                   <Card className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
                      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 z-10">SEO Health Score</h3>
                      <div className="relative w-48 h-48 z-10">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                               innerRadius="80%" 
                               outerRadius="100%" 
                               data={[{ name: 'Score', value: report.score || 0, fill: getScoreColor(report.score || 0) }]} 
                               startAngle={180} 
                               endAngle={0}
                            >
                               <RadialBar background dataKey="value" cornerRadius={10} />
                            </RadialBarChart>
                         </ResponsiveContainer>
                         <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
                            <span className="text-5xl font-bold text-gray-900 dark:text-white">{report.score || 0}</span>
                            <span className="text-sm text-gray-500">de 100</span>
                         </div>
                      </div>
                      <p className="text-center text-sm text-gray-500 mt-[-20px] px-4 z-10">{report.scoreJustification || 'Sem dados suficientes.'}</p>
                      
                      {/* Background decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl z-0"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl z-0"></div>
                   </Card>
                </div>

                {/* Objective & Quick Stats */}
                <div className="md:col-span-8 lg:col-span-5 space-y-6">
                   {/* Objective Analysis */}
                   <Card className="border-l-4 border-l-primary">
                      <div className="flex items-start justify-between">
                         <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                               <Target size={18} className="text-primary"/> Alinhamento com Objetivo
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                               {report.objectiveAnalysis?.analysis || "Objetivo não definido ou não analisado."}
                            </p>
                         </div>
                         <div className="text-right ml-4">
                            <span className="text-2xl font-bold text-primary">{report.objectiveAnalysis?.alignmentScore || 0}%</span>
                            <p className="text-xs text-gray-400">Match</p>
                         </div>
                      </div>
                      {report.objectiveAnalysis?.missingTopics && report.objectiveAnalysis.missingTopics.length > 0 && (
                         <div className="mt-4 flex flex-wrap gap-2">
                            {report.objectiveAnalysis.missingTopics.map((topic, i) => (
                               <span key={i} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-xs rounded border border-red-100 dark:border-red-900/30">
                                  Falta: {topic}
                               </span>
                            ))}
                         </div>
                      )}
                   </Card>

                   {/* Quick Vitals */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
                         <div className={`p-2 rounded-full ${report.technical?.mobileFriendly ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            <Smartphone size={20} />
                         </div>
                         <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Mobile Friendly</p>
                            <p className="font-semibold">{report.technical?.mobileFriendly ? 'Otimizado' : 'Problemas'}</p>
                         </div>
                      </div>
                      <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
                         <div className={`p-2 rounded-full ${report.technical?.coreWebVitals?.status === 'Pass' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            <Zap size={20} />
                         </div>
                         <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Core Vitals</p>
                            <p className="font-semibold">{report.technical?.coreWebVitals?.status === 'Pass' ? 'Aprovado' : 'Falhou'}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Recommendations */}
                <div className="md:col-span-12 lg:col-span-4">
                   <Card title="Ações Prioritárias" className="h-full">
                      <ul className="space-y-3 mt-2">
                         {report.recommendations?.traditional?.slice(0, 4).map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                               <div className="mt-0.5 min-w-[6px] min-h-[6px] rounded-full bg-primary"></div>
                               {rec}
                            </li>
                         ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                         <h4 className="text-xs font-bold text-secondary uppercase mb-2">GEO (AI Optimization)</h4>
                         <p className="text-sm italic text-gray-500">"{report.recommendations?.topicalAuthorityTip || 'Sem dados.'}"</p>
                      </div>
                   </Card>
                </div>
             </div>
          )}

          {/* === CONTENT TAB === */}
          {activeTab === 'content' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Análise de Palavras-Chave" className="md:col-span-2">
                   {report.technical?.coreKeywords?.length > 0 ? (
                       <div className="h-[300px] w-full mt-4">
                          <ResponsiveContainer width="100%" height="100%">
                             <BarChart
                                data={report.technical.coreKeywords.map(k => ({...k, volumeVal: parseInt(String(k.volume).replace(/[^0-9]/g, '')) || 0 }))}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                             >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="keyword" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                   contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                                   cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="difficulty" name="Dificuldade (0-100)" fill="#992091" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar yAxisId="right" dataKey="volumeVal" name="Volume Estimado" fill="#1f3ab9" radius={[4, 4, 0, 0]} barSize={20} />
                             </BarChart>
                          </ResponsiveContainer>
                       </div>
                   ) : (
                       <p className="text-gray-500 py-8 text-center">Nenhuma palavra-chave significativa encontrada.</p>
                   )}
                </Card>

                {/* Competitors Gap */}
                {report.ranking?.competitors?.length > 0 && (
                   <Card title="Comparativo com Concorrentes (Keyword Overlap)">
                      <div className="h-[250px] w-full mt-4">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                               layout="vertical"
                               data={report.ranking.competitors}
                               margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.1} />
                               <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                               <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={100} />
                               <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }} />
                               <Bar dataKey="keywordOverlap" name="Sobreposição %" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{report.ranking.gapAnalysis}</p>
                   </Card>
                )}

                {/* Search Intent */}
                <Card title="Intenção de Busca">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                         <Target className="text-primary w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-sm text-gray-500">Intenção Principal Identificada</p>
                         <p className="text-xl font-bold text-gray-900 dark:text-white">{report.ranking?.searchIntent || 'N/D'}</p>
                      </div>
                   </div>
                   <p className="text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800 pt-3">
                      {report.ranking?.intentMatch}
                   </p>
                </Card>
             </div>
          )}

          {/* === TECHNICAL TAB === */}
          {activeTab === 'technical' && report.technical && (
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {/* Infrastructure */}
                   <Card title="Infraestrutura" className="md:col-span-1">
                      <div className="space-y-4 mt-2">
                         {[
                           {...report.technical.infrastructure?.sitemap, label: 'Sitemap.xml', icon: Server},
                           {...report.technical.infrastructure?.robotsTxt, label: 'Robots.txt', icon: Server},
                           {...report.technical.infrastructure?.aiProtocols, label: 'AI Protocols (ai.txt)', icon: BotIcon}
                         ].map((item, idx) => (
                           <div key={idx} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                              <div className="flex items-center gap-3">
                                 {item.icon && <item.icon size={16} className="text-gray-400" />}
                                 <div>
                                    <p className="text-sm font-medium">{item.label}</p>
                                    <p className="text-[10px] text-gray-400 max-w-[120px] truncate">{item.details || 'N/D'}</p>
                                 </div>
                              </div>
                              {getStatusIcon(item.status)}
                           </div>
                         ))}
                      </div>
                   </Card>

                   {/* Meta Tags */}
                   <Card title="Meta Tags" className="md:col-span-2">
                      <div className="space-y-4">
                         {/* Title */}
                         <div className="p-3 border border-gray-100 dark:border-gray-800 rounded-lg">
                            <div className="flex justify-between mb-1">
                               <span className="text-xs font-bold text-gray-500 uppercase">Page Title ({report.technical.titleTag?.length || 0} chars)</span>
                               {getStatusIcon(report.technical.titleTag?.status)}
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{report.technical.titleTag?.value || 'Não encontrado'}</p>
                            {report.technical.titleTag?.status !== 'Good' && (
                               <div className="mt-2 text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-blue-800 dark:text-blue-200">
                                  <strong>Sugestão AI:</strong> {report.technical.titleTag?.suggestedValue}
                               </div>
                            )}
                         </div>

                         {/* Description */}
                         <div className="p-3 border border-gray-100 dark:border-gray-800 rounded-lg">
                            <div className="flex justify-between mb-1">
                               <span className="text-xs font-bold text-gray-500 uppercase">Meta Description ({report.technical.metaDescription?.length || 0} chars)</span>
                               {getStatusIcon(report.technical.metaDescription?.status)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{report.technical.metaDescription?.value || 'Não encontrada'}</p>
                            {report.technical.metaDescription?.status !== 'Good' && (
                               <div className="mt-2 text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-blue-800 dark:text-blue-200">
                                  <strong>Sugestão AI:</strong> {report.technical.metaDescription?.suggestedValue}
                               </div>
                            )}
                         </div>
                      </div>
                   </Card>
                </div>

                {/* Schema Markup */}
                <Card title="Schema Markup Generator (JSON-LD)">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                         <div className="flex items-center gap-2 text-primary font-medium">
                            <Terminal size={18} />
                            {report.recommendations?.schemaSuggestion?.type}
                         </div>
                         <p className="text-sm text-gray-600 dark:text-gray-300">
                            {report.recommendations?.schemaSuggestion?.reasoning}
                         </p>
                         <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h5 className="text-xs font-bold uppercase text-gray-500 mb-2">Schemas Atuais Detetados</h5>
                            {report.technical.structuredData?.map((schema, i) => (
                               <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                  <span>{schema.type}</span>
                                  {getStatusIcon(schema.status)}
                               </div>
                            ))}
                            {(!report.technical.structuredData || report.technical.structuredData.length === 0) && <span className="text-xs text-red-400">Nenhum dado estruturado detetado.</span>}
                         </div>
                      </div>
                      
                      <div className="relative group">
                         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(report.recommendations?.schemaSuggestion?.codeSnippet || '')}>
                               <Copy size={14} className="mr-1"/> Copiar
                            </Button>
                         </div>
                         <pre className="bg-[#1e1e1e] text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-gray-700 shadow-inner h-full max-h-[300px]">
                            {report.recommendations?.schemaSuggestion?.codeSnippet || '// Sem sugestão disponível'}
                         </pre>
                      </div>
                   </div>
                </Card>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper icon
const BotIcon = ({ className, size }: { className?: string, size?: number }) => (
   <svg 
     xmlns="http://www.w3.org/2000/svg" 
     width={size || 24} 
     height={size || 24} 
     viewBox="0 0 24 24" 
     fill="none" 
     stroke="currentColor" 
     strokeWidth="2" 
     strokeLinecap="round" 
     strokeLinejoin="round" 
     className={className}
   >
     <path d="M12 8V4H8"/>
     <rect width="16" height="12" x="4" y="8" rx="2"/>
     <path d="M2 14h2"/>
     <path d="M20 14h2"/>
     <path d="M15 13v2"/>
     <path d="M9 13v2"/>
   </svg>
);