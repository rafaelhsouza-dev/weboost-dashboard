# WeBoost API - Documentação de Integração (Frontend)

Este guia serve como referência para a equipe de frontend integrar com a WeBoost API. Ele detalha todos os endpoints disponíveis, seus contratos de dados (payloads) e exemplos práticos.

**Base URL de Produção:** `https://api.weboost.pt`

## Autenticação

Todas as requisições protegidas devem incluir o token JWT no cabeçalho:
`Authorization: Bearer <ACCESS_TOKEN>`

### 1. Login (Obter Token)
**POST** `/auth/token`

Utilizado para autenticar o usuário e iniciar a sessão.

**Payload (Form Data - `application/x-www-form-urlencoded`):**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `username` | string | Sim | E-mail do usuário |
| `password` | string | Sim | Senha do usuário |

**Exemplo de Requisição:**
```bash
curl -X POST "https://api.weboost.pt/auth/token" \
  -d "username=admin@weboost.pt&password=sua_senha_segura"
```

**Resposta (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1Ni...",
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "token_type": "bearer"
}
```

### 2. Refresh Token
**POST** `/auth/refresh`

Utilizado para renovar o token de acesso sem pedir a senha novamente.

**Payload (JSON):**
```json
{
  "refresh_token": "seu_refresh_token_aqui",
  "active_customer": 1 
}
```
*Nota: `active_customer` é opcional. Envie se quiser gerar um token focado em um contexto de cliente específico.*

---

## Gerenciamento de Usuários (`/users`)

### 1. Listar Usuários
**GET** `/users/`

Retorna todos os usuários cadastrados.

**Query Params:**
- `skip`: (int) Pular registros (paginação). Padrão: 0.
- `limit`: (int) Limite de registros. Padrão: 100.

**Exemplo:** `https://api.weboost.pt/users/?limit=10`

### 2. Criar Usuário
**POST** `/users/`

**Payload (JSON):**
```json
{
  "name": "Nome do Colaborador",
  "email": "colaborador@empresa.com",
  "password": "senha_inicial_123",
  "role_id": 5,
  "status": true
}
```
*Roles Comuns: 1=SuperAdmin, 2=Admin, 5=User (verificar tabela roles)*

### 3. Detalhes do Usuário
**GET** `/users/{user_id}`

Exemplo: `https://api.weboost.pt/users/12`

### 4. Atualizar Usuário
**PUT** `/users/{user_id}`

**Payload (JSON):**
```json
{
  "name": "Nome Corrigido",
  "status": false
}
```
*Envie apenas os campos que deseja alterar.*

---

## Gerenciamento de Customers (Tenants) (`/customers`)

Esta seção lida com as empresas/clientes do sistema.

### 1. Listar Customers
**GET** `/customers/`

Lista as empresas que o usuário logado tem permissão de acessar.

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Minha Empresa A",
    "email": "contato@empresa-a.com",
    "schema_name": "customer_empresa_a",
    "status": true,
    "nif": "123456789"
  }
]
```

### 2. Criar Customer
**POST** `/customers/`

Cria uma nova empresa e seu banco de dados isolado.

**Query Params Opcionais:**
- `user_ids`: Lista de IDs de usuários para dar acesso imediato. Ex: `?user_ids=1&user_ids=2`

**Payload (JSON):**
```json
{
  "name": "Nova Empresa Ltda",
  "email": "admin@novaempresa.com",
  "schema_name": "nova_empresa", 
  "nif": "500600700",
  "phone": "+351910000000",
  "street_name": "Rua Principal",
  "city": "Lisboa",
  "country": "Portugal"
}
```
*Nota: `schema_name` deve ser único e sem caracteres especiais (use snake_case).*

### 3. Atualizar Customer
**PUT** `/customers/{customer_id}`

**Payload (JSON):**
```json
{
  "phone": "+351999999999",
  "status": true
}
```

### 4. Deletar Customer
**DELETE** `/customers/{customer_id}`

**Atenção:** Isso apaga a empresa e **todos** os dados (leads, etc.) associados a ela. Irreversível.

---

## Associação de Usuários a Customers (Controle de Acesso)

Endpoints para definir quem pode acessar qual empresa.

### 1. Listar Usuários do Customer
**GET** `/customers/{customer_id}/users`

Retorna a lista de usuários que possuem acesso a este customer específico.

**URL Exemplo:** `https://api.weboost.pt/customers/1/users`

**Resposta (200 OK):**
```json
[
  {
    "id": 5,
    "name": "João Silva",
    "email": "joao@email.com",
    "role_id": 5,
    "status": true
  }
]
```

### 2. Adicionar Usuário ao Customer
**POST** `/customers/{customer_id}/users/{user_id}`

Concede acesso a um usuário existente para gerenciar este customer.

**URL Exemplo:** `https://api.weboost.pt/customers/1/users/5`
(Adiciona o usuário ID 5 ao Customer ID 1)

**Payload:** (Vazio / Nenhum corpo necessário)

**Resposta (201 Created):**
```json
{
  "message": "Usuário adicionado com sucesso"
}
```

### 3. Remover Usuário do Customer
**DELETE** `/customers/{customer_id}/users/{user_id}`

Revoga o acesso de um usuário.

**URL Exemplo:** `https://api.weboost.pt/customers/1/users/5`

**Resposta (204 No Content):** (Vazio)

---

## Dados do Tenant (Leads, etc.)

Estes endpoints acessam os dados isolados dentro do schema de cada cliente.
**Formato da URL:** `/tenants/{customer_id}/...`

### 1. Listar Leads
**GET** `/tenants/{customer_id}/leads/`

**Query Params:**
- `skip`, `limit`

**Exemplo:** `https://api.weboost.pt/tenants/1/leads/`

### 2. Criar Lead
**POST** `/tenants/{customer_id}/leads/`

**Payload (JSON):**
```json
{
  "name": "Cliente Potencial",
  "email": "cliente@gmail.com",
  "status": "new",
  "phone": "912345678"
}
```

### 3. Atualizar Lead
**PUT** `/tenants/{customer_id}/leads/{lead_id}`

**Payload (JSON):**
```json
{
  "status": "converted",
  "phone": "999888777"
}
```

### 4. Deletar Lead
**DELETE** `/tenants/{customer_id}/leads/{lead_id}`

---

## Administração (`/admin`)

Endpoints para manutenção do sistema (requer permissão de SuperAdmin).

### 1. Status dos Tenants
**GET** `/admin/tenants/status/`

Verifica a saúde dos schemas no banco de dados.

### 2. Rodar Migrations em Massa
**POST** `/admin/migrations/run-all-tenants/`

Executa scripts de atualização de banco de dados (Alembic) em **todos** os clientes de uma vez. Use com cautela.
