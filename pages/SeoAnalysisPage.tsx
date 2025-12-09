
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  ScanSearch, Loader2, CheckCircle, AlertTriangle, XCircle, 
  Activity, Terminal, Globe, Smartphone, Zap, Server, 
  Target, Copy, Plus, X, ChevronUp, ChevronDown, ArrowRight, Bot,
  Share2, Image as ImageIcon, FileJson
} from 'lucide-react';
import { generateSeoAudit } from '../services/seoService';
import { SeoReport } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  RadialBarChart, RadialBar 
} from 'recharts';

// Extend type locally to support social preview
interface ExtendedSeoReport extends SeoReport {
    socialPreview?: {
        title: string;
        description: string;
        image: string;
    }
}

export const SeoAnalysisPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [objective, setObjective] = useState('');
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ExtendedSeoReport | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'content'>('overview');

  const handleAddCompetitor = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
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
      const data = await generateSeoAudit(url, objective, competitors.join(', '));
      setReport(data);
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar análise. Verifique a URL e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (!status) return <Activity className="text-gray-400 w-5 h-5" />;
    const s = status.toLowerCase();
    if (s.includes('good') || s.includes('pass') || s.includes('valid')) return <CheckCircle className="text-green-500 w-5 h-5" />;
    if (s.includes('warn')) return <AlertTriangle className="text-yellow-500 w-5 h-5" />;
    return <XCircle className="text-red-500 w-5 h-5" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ScanSearch className="text-primary" /> Auditoria SEO & GEO
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Análise em tempo real com verificação de infraestrutura e Social Graph.
          </p>
        </div>
      </div>

      <div className="transition-all duration-500 ease-in-out">
        <Card className="bg-gradient-to-r from-white to-blue-50/50 dark:from-[#1a1a1a] dark:to-blue-900/10 border border-gray-200 dark:border-gray-800 shadow-lg">
          <form onSubmit={handleAudit} className="space-y-6 p-2">
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

            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm font-medium text-primary hover:text-blue-700 transition-colors"
            >
              {showAdvanced ? 'Ocultar Opções Avançadas' : 'Mostrar Opções Avançadas'}
              {showAdvanced ? <ChevronUp size={16} className="ml-1"/> : <ChevronDown size={16} className="ml-1"/>}
            </button>

            {showAdvanced && (
              <div className="space-y-6 animate-fade-in border-t border-gray-100 dark:border-gray-800 pt-6">
                <div className="space-y-2">
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                     Objetivo do Site <span className="text-gray-400 font-normal">(Opcional)</span>
                   </label>
                   <textarea 
                     className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[80px]"
                     placeholder="Ex: Atrair leads B2B..."
                     value={objective}
                     onChange={(e) => setObjective(e.target.value)}
                   />
                </div>

                <div className="space-y-2">
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                     Concorrentes <span className="text-gray-400 font-normal">(Opcional)</span>
                   </label>
                   <div className="flex gap-2">
                      <input 
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        placeholder="https://concorrente.com"
                        value={newCompetitor}
                        onChange={(e) => setNewCompetitor(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCompetitor(e); } }}
                      />
                      <Button type="button" variant="secondary" onClick={handleAddCompetitor}><Plus size={18} /></Button>
                   </div>
                   {competitors.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-3">
                       {competitors.map((comp, index) => (
                         <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{comp}</span>
                            <button type="button" onClick={() => handleRemoveCompetitor(index)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full h-[50px] text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                {loading ? <><Loader2 className="animate-spin mr-2" size={20} /> Verificando Infraestrutura e SEO...</> : <>Gerar Auditoria Completa <ArrowRight size={20} className="ml-2" /></>}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {report && (
        <div className="animate-fade-in space-y-8">
          <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
             {['overview', 'technical', 'content'].map((tab) => (
               <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
               >
                  {tab === 'overview' ? 'Visão Geral' : tab === 'technical' ? 'Saúde Técnica' : 'Conteúdo & Social'}
               </button>
             ))}
          </div>

          {activeTab === 'overview' && (
             <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 lg:col-span-3">
                   <Card className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden min-h-[300px]">
                      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 z-10">SEO Score</h3>
                      <div className="relative w-48 h-48 z-10">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart innerRadius="80%" outerRadius="100%" data={[{ name: 'Score', value: report.score || 0, fill: getScoreColor(report.score || 0) }]} startAngle={180} endAngle={0}>
                               <RadialBar background dataKey="value" cornerRadius={10} />
                            </RadialBarChart>
                         </ResponsiveContainer>
                         <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
                            <span className="text-5xl font-bold text-gray-900 dark:text-white">{report.score || 0}</span>
                         </div>
                      </div>
                      <p className="text-center text-sm text-gray-500 mt-[-20px] px-4 z-10">{report.scoreJustification}</p>
                   </Card>
                </div>

                <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card className="border-l-4 border-l-primary p-4">
                      <div className="flex justify-between items-start">
                         <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Target size={18} className="text-primary"/> Análise de Objetivo</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{report.objectiveAnalysis?.analysis || "N/D"}</p>
                         </div>
                         <div className="text-right">
                            <span className="text-2xl font-bold text-primary">{report.objectiveAnalysis?.alignmentScore}%</span>
                         </div>
                      </div>
                   </Card>

                   {/* Infraestrutura Real */}
                   <Card title="Infraestrutura & GEO" className="md:col-span-2 lg:col-span-1">
                      <div className="space-y-3 mt-2">
                         <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span className="text-sm font-medium flex items-center gap-2"><Server size={14}/> Sitemap.xml</span>
                            <span className="text-xs flex items-center gap-1">
                                {getStatusIcon(report.technical?.infrastructure?.sitemap?.status)} {report.technical?.infrastructure?.sitemap?.status}
                            </span>
                         </div>
                         <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span className="text-sm font-medium flex items-center gap-2"><Bot size={14}/> Robots.txt</span>
                            <span className="text-xs flex items-center gap-1">
                                {getStatusIcon(report.technical?.infrastructure?.robotsTxt?.status)} {report.technical?.infrastructure?.robotsTxt?.status}
                            </span>
                         </div>
                         <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span className="text-sm font-medium flex items-center gap-2"><FileJson size={14}/> AI.txt (GEO)</span>
                            <span className="text-xs flex items-center gap-1">
                                {getStatusIcon(report.technical?.infrastructure?.aiProtocols?.status)} {report.technical?.infrastructure?.aiProtocols?.status}
                            </span>
                         </div>
                      </div>
                   </Card>
                   
                   <Card title="Ações Prioritárias" className="md:col-span-2 lg:col-span-2">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                         {report.recommendations?.traditional?.slice(0, 4).map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 bg-red-50 dark:bg-red-900/10 p-2 rounded">
                               <div className="mt-1.5 min-w-[6px] min-h-[6px] rounded-full bg-red-500"></div>
                               {rec}
                            </li>
                         ))}
                      </ul>
                   </Card>
                </div>
             </div>
          )}

          {activeTab === 'technical' && report.technical && (
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Title Tag Analysis */}
                   <Card className="border border-gray-200 dark:border-gray-800">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                         <h3 className="font-bold text-gray-900 dark:text-white">Page Title</h3>
                         {getStatusIcon(report.technical.titleTag?.status)}
                      </div>
                      
                      <div className="space-y-4">
                         <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Atual (Detetado no HTML)</span>
                            <div className="mt-1 p-3 bg-gray-50 dark:bg-black/30 rounded border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-800 dark:text-gray-200 break-words">
                               {report.technical.titleTag?.value || <span className="text-red-400 italic">Não encontrado no código fonte</span>}
                            </div>
                            <p className="text-xs text-right text-gray-400 mt-1">{report.technical.titleTag?.value?.length || 0} caracteres</p>
                         </div>

                         {report.technical.titleTag?.status !== 'Good' && (
                           <div>
                              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1"><Bot size={12}/> Sugestão AI</span>
                              <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-900/10 rounded border border-blue-100 dark:border-blue-900/30 text-sm text-blue-800 dark:text-blue-200">
                                 {report.technical.titleTag?.suggestedValue}
                              </div>
                           </div>
                         )}
                      </div>
                   </Card>

                   {/* Meta Description Analysis */}
                   <Card className="border border-gray-200 dark:border-gray-800">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                         <h3 className="font-bold text-gray-900 dark:text-white">Meta Description</h3>
                         {getStatusIcon(report.technical.metaDescription?.status)}
                      </div>
                      
                      <div className="space-y-4">
                         <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Atual (Detetado no HTML)</span>
                            <div className="mt-1 p-3 bg-gray-50 dark:bg-black/30 rounded border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-800 dark:text-gray-200 break-words">
                               {report.technical.metaDescription?.value || <span className="text-red-400 italic">Não encontrada no código fonte</span>}
                            </div>
                            <p className="text-xs text-right text-gray-400 mt-1">{report.technical.metaDescription?.value?.length || 0} caracteres</p>
                         </div>

                         {report.technical.metaDescription?.status !== 'Good' && (
                           <div>
                              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1"><Bot size={12}/> Sugestão AI</span>
                              <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-900/10 rounded border border-blue-100 dark:border-blue-900/30 text-sm text-blue-800 dark:text-blue-200">
                                 {report.technical.metaDescription?.suggestedValue}
                              </div>
                           </div>
                         )}
                      </div>
                   </Card>
                </div>
             </div>
          )}

          {activeTab === 'content' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Social Preview */}
                <Card title="Social Media Preview (OG Tags)">
                    <div className="mt-4 border rounded-lg overflow-hidden max-w-sm mx-auto bg-gray-100 dark:bg-gray-800 shadow-sm">
                        {report.socialPreview?.image ? (
                            <img src={report.socialPreview.image} alt="OG Preview" className="w-full h-48 object-cover" />
                        ) : (
                            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                <ImageIcon size={40} />
                            </div>
                        )}
                        <div className="p-3 bg-white dark:bg-[#222]">
                            <p className="text-xs text-gray-500 uppercase mb-1">{url.replace('https://', '').split('/')[0]}</p>
                            <h4 className="font-bold text-gray-900 dark:text-white truncate">{report.socialPreview?.title || "Sem Título Social"}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{report.socialPreview?.description || "Sem descrição social definida."}</p>
                        </div>
                    </div>
                </Card>

                {/* Keyword Chart */}
                <Card title="Dificuldade de Palavras-Chave">
                   <div className="h-[300px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={report.technical?.coreKeywords?.map(k => ({...k, volumeVal: parseInt(String(k.volume).replace(/[^0-9]/g, '')) || 0 })) || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="keyword" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px' }} />
                            <Bar dataKey="difficulty" name="Dificuldade" fill="#992091" radius={[4, 4, 0, 0]} barSize={30} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </Card>

                {/* Detailed Keyword Table */}
                <Card title="Palavras-Chave Detalhadas" className="md:col-span-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Keyword</th>
                                    <th className="px-6 py-3">Volume (Est.)</th>
                                    <th className="px-6 py-3">Dificuldade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.technical?.coreKeywords?.length > 0 ? report.technical.coreKeywords.map((k, i) => (
                                    <tr key={i} className="bg-white border-b dark:bg-transparent dark:border-gray-800">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{k.keyword}</td>
                                        <td className="px-6 py-4">{k.volume}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 max-w-[100px]">
                                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${k.difficulty}%` }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">Nenhuma palavra-chave identificada.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
             </div>
          )}
        </div>
      )}
    </div>
  );
};
