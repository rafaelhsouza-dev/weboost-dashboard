# WeBoost API - Especificação Completa de Endpoints

Este documento contém a relação de todos os endpoints da API, payloads completos e parâmetros.

**Base URL:** `https://api.weboost.pt`

---

## 🔐 Autenticação (`/auth`)

### 1. Login (Obter Token)
**POST** `/auth/token`
- **Tipo:** `application/x-www-form-urlencoded`
- **Payload:**
    - `username` (string, obrigatório): E-mail do usuário.
    - `password` (string, obrigatório): Senha do usuário.

### 2. Refresh Token
**POST** `/auth/refresh`
- **Tipo:** `application/json`
- **Payload:**
    - `refresh_token` (string, obrigatório)
    - `active_customer` (integer, opcional): ID do cliente para mudar o contexto do token.

---

## 👥 Usuários (`/users`)

### 1. Criar Usuário
**POST** `/users/`
- **Payload:**
    - `name` (string, obrigatório)
    - `email` (string, obrigatório)
    - `password` (string, obrigatório)
    - `role_id` (integer, opcional, padrão: 5)
    - `status` (boolean, opcional, padrão: true)

### 2. Listar Usuários
**GET** `/users/`
- **Query Params:**
    - `skip` (integer, padrão: 0)
    - `limit` (integer, padrão: 100)

### 3. Obter Usuário Específico
**GET** `/users/{user_id}`

### 4. Atualizar Usuário
**PUT** `/users/{user_id}`
- **Payload (Todos opcionais):**
    - `name` (string)
    - `email` (string)
    - `role_id` (integer)
    - `status` (boolean)
    - `password` (string)

---

## 🏢 Customers (Clientes/Tenants) (`/customers`)

### 1. Criar Novo Customer
**POST** `/customers/`
- **Query Params:**
    - `user_ids` (array de integer, opcional): IDs dos usuários que terão acesso.
- **Payload:**
    - `name` (string, obrigatório)
    - `email` (string, obrigatório)
    - `schema_name` (string, obrigatório)
    - `status` (boolean, opcional, padrão: true)
    - `phone` (string, opcional)
    - `type_id` (integer, opcional)
    - `status_customer_id` (integer, opcional)
    - `manager_id` (integer, opcional)
    - `date_init` (date "YYYY-MM-DD", opcional)
    - `fiscal_name` (string, opcional)
    - `nif` (string, opcional)
    - `url_website` (string, opcional)
    - `url_ecommerce` (string, opcional)
    - `street_name` (string, opcional)
    - `street_number` (string, opcional)
    - `city` (string, opcional)
    - `country` (string, opcional)
    - `zip` (string, opcional)
    - `owner_name` (string, opcional)
    - `owner_email` (string, opcional)
    - `owner_phone` (string, opcional)
    - `contact_name` (string, opcional)
    - `contact_email` (string, opcional)
    - `contact_phone` (string, opcional)
    - `other_contacts_ids` (array, opcional)
    - `info_general_id` (integer, opcional)

### 2. Listar Customers
**GET** `/customers/`
- **Query Params:** `skip`, `limit`.

### 3. Obter Customer
**GET** `/customers/{customer_id}`

### 4. Atualizar Customer
**PUT** `/customers/{customer_id}`
- **Payload (Todos opcionais):**
    - `name`, `email`, `status`, `phone`, `type_id`, `status_customer_id`, `manager_id`, `date_init`, `fiscal_name`, `nif`, `url_website`, `url_ecommerce`, `street_name`, `street_number`, `city`, `country`, `zip`, `owner_name`, `owner_email`, `owner_phone`, `contact_name`, `contact_email`, `contact_phone`, `other_contacts_ids`, `info_general_id`.

### 5. Deletar Customer
**DELETE** `/customers/{customer_id}`

---

## ⚙️ Configurações de Customer (`/customers/...`)

### 1. Tipos de Clientes
- **Listar:** `GET /customers/types`
- **Adicionar:** `POST /customers/types`
    - Payload: `{"name": "string", "description": "string"}`

### 2. Status de Clientes
- **Listar:** `GET /customers/statuses`
- **Adicionar:** `POST /customers/statuses`
    - Payload: `{"name": "string", "description": "string", "is_active_status": boolean}`

### 3. Gerenciamento de Usuários do Customer
- **Listar Acessos:** `GET /customers/{customer_id}/users`
- **Adicionar Usuário:** `POST /customers/{customer_id}/users/{user_id}`
- **Remover Usuário:** `DELETE /customers/{customer_id}/users/{user_id}`

---

## 📈 Leads (Tenant Data) (`/tenants/{customer_id}/leads`)

### 1. Criar Lead
**POST** `/tenants/{customer_id}/leads/`
- **Payload:**
    - `name` (string, obrigatório)
    - `email` (string, opcional)
    - `status` (string, opcional)

### 2. Listar Leads
**GET** `/tenants/{customer_id}/leads/`
- **Query Params:** `skip`, `limit`.

### 3. Obter Lead
**GET** `/tenants/{customer_id}/leads/{lead_id}`

### 4. Atualizar Lead
**PUT** `/tenants/{customer_id}/leads/{lead_id}`
- **Payload (Opcionais):**
    - `name`, `email`, `status`.

### 5. Deletar Lead
**DELETE** `/tenants/{customer_id}/leads/{lead_id}`

---

## ⚡ Administração (`/admin`)

### 1. Rodar Migrations (Tenants)
**POST** `/admin/migrations/run-all-tenants/`

### 2. Status dos Tenants
**GET** `/admin/tenants/status/`