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

Renova o token de acesso. Pode ser usado para trocar o `active_customer` no contexto do token.

**Payload (JSON):**
```json
{
  "refresh_token": "seu_refresh_token_aqui",
  "active_customer": 1 
}
```

---

## Gerenciamento de Usuários (`/users`)

### 1. Listar Usuários
**GET** `/users/`

Retorna todos os usuários. Suporta paginação via Query Params.

**Query Params:**
- `skip`: (int) Registros a pular. Padrão: 0.
- `limit`: (int) Máximo de registros. Padrão: 100.

### 2. Criar Usuário
**POST** `/users/`

**Payload (JSON):**
```json
{
  "name": "Nome do Usuário",
  "email": "user@weboost.pt",
  "password": "senha_segura",
  "role_id": 5,
  "status": true
}
```
*Roles Padrão: 1=CEO, 2=admin, 3=manager, 4=user, 5=employee.*

### 3. Atualizar Usuário
**PUT** `/users/{user_id}`

Permite atualizar dados e senha. Envie apenas o que deseja alterar.

---

## Gerenciamento de Customers (Tenants) (`/customers`)

### 1. Criar Customer
**POST** `/customers/`

Cria a empresa e o schema de banco de dados.

**Query Params:**
- `user_ids`: (Opcional) IDs de usuários para associar. Ex: `?user_ids=1&user_ids=9`

**Payload (JSON):**
```json
{
  "name": "Empresa Exemplo",
  "email": "contato@exemplo.com",
  "schema_name": "exemplo_ltda",
  "nif": "500100200",
  "phone": "+351912345678",
  "type_id": 1,
  "status_customer_id": 1
}
```
*Nota: O `schema_name` será automaticamente prefixado com `customer_` pelo backend.*

### 2. Listar Customers
**GET** `/customers/`

Retorna apenas os customers que o usuário logado tem permissão de acessar.

### 3. Associação de Usuários
- **Listar Usuários do Customer**: `GET /customers/{customer_id}/users`
- **Adicionar Acesso**: `POST /customers/{customer_id}/users/{user_id}`
- **Remover Acesso**: `DELETE /customers/{customer_id}/users/{user_id}`

---

## Configuração de Clientes (Tipos e Status)

### 1. Tipos de Clientes
- **Listar**: `GET /customers/types`
- **Adicionar**: `POST /customers/types` -> Payload: `{"name": "string", "description": "string"}`

### 2. Status de Clientes
- **Listar**: `GET /customers/statuses`
- **Adicionar**: `POST /customers/statuses` -> Payload: `{"name": "string", "is_active_status": true}`

---

## Dados do Tenant (Leads)

Acessa os dados específicos de uma empresa. O `customer_id` no path define o schema.

### 1. Listar Leads
**GET** `/tenants/{customer_id}/leads/`

### 2. Criar Lead
**POST** `/tenants/{customer_id}/leads/`

**Payload (JSON):**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "status": "novo"
}
```
*Nota: `email` e `status` são opcionais.*

### 3. Operações Individuais
- **Ver**: `GET /tenants/{customer_id}/leads/{lead_id}`
- **Editar**: `PUT /tenants/{customer_id}/leads/{lead_id}`
- **Deletar**: `DELETE /tenants/{customer_id}/leads/{lead_id}`

---

## Administração (`/admin`)

### 1. Migrations em Massa
**POST** `/admin/migrations/run-all-tenants/`

Atualiza a estrutura de banco de dados de TODOS os clientes cadastrados.

### 2. Status do Sistema
**GET** `/admin/tenants/status/`

Verifica se os schemas e tabelas de todos os clientes estão íntegros no PostgreSQL.