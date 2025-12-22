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
  schema_name?: string;
  status?: boolean;
  nif?: string;
  type_id?: number;
  status_customer_id?: number;
  manager_id?: number;
  date_init?: string;
  fiscal_name?: string;
  url_website?: string;
  url_ecommerce?: string;
  street_name?: string;
  street_number?: string;
  city?: string;
  country?: string;
  zip?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface ApiCustomerResponse {
  id: number;
  name: string;
  email: string;
  schema_name: string;
  status: boolean;
  phone: string | null;
  type_id: number | null;
  status_customer_id: number | null;
  manager_id: number | null;
  date_init: string | null;
  fiscal_name: string | null;
  nif: string | null;
  url_website: string | null;
  url_ecommerce: string | null;
  street_name: string | null;
  street_number: string | null;
  city: string | null;
  country: string | null;
  zip: string | null;
  owner_name: string | null;
  owner_email: string | null;
  owner_phone: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  other_contacts_ids: any[] | null;
  info_general_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerType {
  id: number;
  name: string;
  description: string;
}

export interface CustomerStatus {
  id: number;
  name: string;
  description: string;
  is_active_status: boolean;
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