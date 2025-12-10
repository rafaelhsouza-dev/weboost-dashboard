import { LucideIcon } from 'lucide-react';

export enum Role {
  ADMIN = 'Administrador',
  MANAGER = 'Gestor',
  EMPLOYEE = 'Funcionário',
  CLIENT = 'Cliente'
}

export enum TenancyType {
  ADMIN = 'ADMIN',
  INTERNAL = 'INTERNAL', // O "Utilizador" padrão
  CLIENT = 'CLIENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  roleDisplayName?: string; // Display name for the role (e.g., "TI", "Administrador")
  allowedTenants: string[]; // IDs of tenants this user can access
}

export interface Tenant {
  id: string;
  name: string;
  type: TenancyType;
  logoUrl?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}

export interface ChartData {
  name: string;
  value: number;
  value2?: number;
  [key: string]: any;
}

export interface KPI {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
}

export type Language = 'pt' | 'en';

export enum WebhookStatus {
  IDLE = 'IDLE',
  SENDING = 'SENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

// AI Scraper Types
export interface Lead {
  id: string;
  generatedDate: string;
  searchCity: string | null;
  searchCountry: string | null;
  leadNumber: number;
  companyName: string;
  category: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  coordinates: { lat: number; lon: number } | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  linkedIn: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  twitter: string | null;
  tiktok: string | null;
  foundingYear: number | null;
  employeeCount: string | null;
  rating: number | null;
  reviewCount: number | null;
  businessHours: any | null;
  qualityScore: number;
  qualityReasoning: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  contacted: boolean;
  notes: string;
  webhookStatus: WebhookStatus;
}

// SEO Report Types
export interface SeoReport {
  url: string;
  userObjective?: string;
  timestamp: string;
  score: number;
  scoreJustification: string;
  objectiveAnalysis?: {
    alignmentScore: number;
    analysis: string;
    missingTopics: string[];
  };
  technical: {
    infrastructure: {
      sitemap: { name: string; status: 'Pass' | 'Fail' | 'Warning'; details: string };
      robotsTxt: { name: string; status: 'Pass' | 'Fail' | 'Warning'; details: string };
      aiProtocols: { name: string; status: 'Pass' | 'Fail' | 'Warning'; details: string };
    };
    titleTag: {
      value: string;
      length: number;
      status: 'Good' | 'Warning' | 'Critical';
      recommendation: string;
      suggestedValue: string;
    };
    metaDescription: {
      value: string;
      length: number;
      status: 'Good' | 'Warning' | 'Critical';
      recommendation: string;
      suggestedValue: string;
    };
    h1: {
      value: string;
      status: 'Good' | 'Warning' | 'Critical';
    };
    coreKeywords: Array<{
      keyword: string;
      volume: string;
      difficulty: number;
    }>;
    primaryTopicCluster: string;
    fleschKincaidGrade: number;
    coreWebVitals: {
      lcp: string;
      fid: string;
      cls: string;
      status: 'Pass' | 'Fail';
    };
    mobileFriendly: boolean;
    structuredData: Array<{
      type: string;
      status: 'Valid' | 'Error' | 'Warning';
      details: string;
    }>;
  };
  ranking: {
    searchIntent: 'Informational' | 'Navigational' | 'Transactional' | 'Commercial';
    intentMatch: string;
    gapAnalysis: string;
    competitors: Array<{
      name: string;
      keywordOverlap: number;
    }>;
  };
  recommendations: {
    traditional: string[];
    aiGeo: string[];
    schemaSuggestion: {
      type: string;
      reasoning: string;
      codeSnippet: string;
    };
    topicalAuthorityTip: string;
  };
}