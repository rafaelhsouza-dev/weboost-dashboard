import { Role, TenancyType, Tenant, User, ChartData, KPI } from './types';
import { Users, DollarSign, TrendingUp, Activity, BarChart3, ShoppingBag, Target } from 'lucide-react';



// --- Tenants ---
// Note: Tenants are now fetched dynamically from the customer service
// The MOCK_TENANTS have been moved to customerService.ts as MOCK_CUSTOMER_TENANTS

// --- KPIs ---
export const MOCK_KPIS_CRM: KPI[] = [
  { label: 'Receita Total', value: '€124.500', change: '+12.5%', isPositive: true, icon: DollarSign },
  { label: 'Novos Leads', value: '1,240', change: '+5.2%', isPositive: true, icon: Users },
  { label: 'Taxa de Conversão', value: '3.45%', change: '-0.4%', isPositive: false, icon: TrendingUp },
  { label: 'Pipeline Ativo', value: '€450.200', change: '+8.1%', isPositive: true, icon: Activity },
];

export const MOCK_KPIS_MARKETING: KPI[] = [
  { label: 'Impressões', value: '2.4M', change: '+22.5%', isPositive: true, icon: Activity },
  { label: 'CTR Médio', value: '1.8%', change: '+0.2%', isPositive: true, icon: Target },
  { label: 'Custo p/ Lead', value: '€4.50', change: '-12.4%', isPositive: true, icon: DollarSign },
  { label: 'Conversões', value: '840', change: '+1.2%', isPositive: true, icon: ShoppingBag },
];

// --- Chart Data ---
export const REVENUE_DATA: ChartData[] = [
  { name: 'Jan', value: 4000, value2: 2400 },
  { name: 'Fev', value: 3000, value2: 1398 },
  { name: 'Mar', value: 2000, value2: 9800 },
  { name: 'Abr', value: 2780, value2: 3908 },
  { name: 'Mai', value: 1890, value2: 4800 },
  { name: 'Jun', value: 2390, value2: 3800 },
  { name: 'Jul', value: 3490, value2: 4300 },
];

export const SEGMENTATION_DATA: ChartData[] = [
  { name: 'VIP', value: 400 },
  { name: 'Regular', value: 300 },
  { name: 'Novos', value: 300 },
  { name: 'Inativos', value: 200 },
];