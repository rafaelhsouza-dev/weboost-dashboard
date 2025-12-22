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
  email?: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  zip?: string | null;
  schema_name?: string;
  status?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}

export interface ApiUserResponse {
  name: string;
  email: string;
  role_id: number;
  status: boolean;
  id: number;
  created_at: string;
  updated_at: string;
  role: {
    name: string;
    description: string;
    id: number;
  };
  roles: number[];
  customers: number[];
  avatar_url?: string;
}

export interface ApiCustomerResponse {
  name: string;
  email: string;
  schema_name: string;
  status: boolean;
  phone: string | null;
  nif?: string;
  type_id?: number;
  status_customer_id?: number;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  name: string;
  email: string;
  status: string;
  id: number;
  created_at: string;
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