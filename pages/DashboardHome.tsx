import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { Card } from '../components/Card';
import { DateRangePicker } from '../components/DateRangePicker';
import { MOCK_KPIS_CRM, MOCK_KPIS_MARKETING, REVENUE_DATA, SEGMENTATION_DATA } from '../constants';
import { useApp } from '../store';
import { TenancyType } from '../types';

export const DashboardHome: React.FC = () => {
  const { currentTenant } = useApp();
  
  // Decide which KPIs to show based on tenant type
  const kpis = currentTenant?.type === TenancyType.INTERNAL || currentTenant?.type === TenancyType.ADMIN 
    ? MOCK_KPIS_CRM 
    : MOCK_KPIS_MARKETING;

  const COLORS = ['#1f3ab9', '#992091', '#10b981', '#f59e0b'];

  return (
    <div className="p-6 space-y-6">
      {/* Page Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-0">
          Dashboard Principal
        </h1>
        <div className="flex justify-end">
          <DateRangePicker />
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="!p-0">
             <div className="flex items-start justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.label}</p>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{kpi.value}</h4>
                  <div className={`flex items-center mt-2 text-xs font-medium ${kpi.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    <span>{kpi.change}</span>
                    <span className="ml-1 text-gray-400">vs. mês anterior</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <kpi.icon className="text-primary w-6 h-6" />
                </div>
             </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart */}
        <Card title="Evolução de Receita" className="lg:col-span-2">
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f3ab9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1f3ab9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#1f3ab9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card title="Segmentação de Clientes">
          <div className="h-80 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={SEGMENTATION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SEGMENTATION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4 w-full">
               {SEGMENTATION_DATA.map((item, index) => (
                 <div key={index} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                   <span className="text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
                 </div>
               ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bar Chart Section */}
      <Card title="Performance de Campanhas (Últimos 6 meses)">
          <div className="h-64 w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={REVENUE_DATA}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                 <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}/>
                 <Bar dataKey="value2" fill="#992091" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
          </div>
      </Card>
    </div>
  );
};