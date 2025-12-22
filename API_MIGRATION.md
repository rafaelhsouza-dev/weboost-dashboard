# Migração para Nova API - Documentação

Este documento descreve as mudanças feitas para migrar o Weboost Dashboard para a nova API.

## 🔧 Mudanças Principais

### 1. Autenticação

**Endpoint Antigo:**
```
POST /auth/login
Content-Type: application/x-www-form-urlencoded
Parameters: grant_type, username, password, scope, client_id, client_secret
```

**Endpoint Novo:**
```
POST /auth/token
Content-Type: application/x-www-form-urlencoded
Parameters: username, password
```

**Resposta Antiga:**
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user": {
    "id": number,
    "name": string,
    "email": string,
    "avatar_url": string,
    "roles": number[],
    "customers": number[]
  }
}
```

**Resposta Nova:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

**Mudanças:**
- Removidos parâmetros desnecessários (grant_type, scope, client_id, client_secret)
- A resposta não inclui mais os dados do usuário
- Adicionado refresh_token na resposta
- Os dados do usuário agora são buscados em um endpoint separado: `GET /users/me`

### 2. Refresh Token

**Novo Endpoint:**
```
POST /auth/refresh
Content-Type: application/json
Body: {
  "refresh_token": string,
  "active_customer": number (opcional)
}
```

**Resposta:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

### 3. Usuários

**Endpoint Antigo:**
```
GET /users
```

**Endpoint Novo:**
```
GET /users/
GET /users/{user_id}
GET /users/me (para dados do usuário atual)
```

**Resposta Nova:**
```json
{
  "name": "string",
  "email": "string",
  "role_id": number,
  "status": boolean,
  "id": number,
  "created_at": "string",
  "updated_at": "string",
  "role": {
    "name": "string",
    "description": "string",
    "id": number
  }
}
```

### 4. Clientes

**Endpoint Antigo:**
```
GET /customers/customers?page=1&per_page=50
```

**Endpoint Novo:**
```
GET /customers/
```

**Resposta Antiga:**
```json
{
  "customers": [
    {
      "id": number,
      "name": string,
      "email": string,
      "phone": string,
      "street_name": string,
      "street_number": string,
      "city": string,
      "country": string,
      "zip": string,
      "created_at": string,
      "updated_at": string
    }
  ],
  "total": number,
  "page": number,
  "per_page": number,
  "total_pages": number
}
```

**Resposta Nova:**
```json
[
  {
    "name": "string",
    "email": "string",
    "schema_name": "string",
    "status": boolean,
    "phone": "string",
    "id": number,
    "created_at": "string",
    "updated_at": "string"
  }
]
```

**Mudanças:**
- Removida a estrutura de paginação
- Removidos campos de endereço (street_name, street_number, city, country, zip)
- Adicionados campos schema_name e status
- Resposta é um array direto em vez de um objeto com propriedade "customers"

### 5. Leads (Tenants)

**Novos Endpoints:**
```
GET /tenants/{customer_id}/leads/
GET /tenants/{customer_id}/leads/{lead_id}
POST /tenants/{customer_id}/leads/
PUT /tenants/{customer_id}/leads/{lead_id}
DELETE /tenants/{customer_id}/leads/{lead_id}
```

**Resposta:**
```json
{
  "name": "string",
  "email": "string",
  "status": "string",
  "id": number,
  "created_at": "string"
}
```

## 📁 Arquivos Modificados

### 1. `services/authService.ts`
- Atualizado endpoint de login para `/auth/token`
- Removidos parâmetros desnecessários do login
- Adicionada função `fetchUserData()` para buscar dados do usuário após login
- Adicionada função `refreshAccessToken()` para refresh de token
- Atualizada interface `LoginResponse` para incluir refresh_token
- Removida interface `mapApiUserToAppUser` (agora feito em `fetchUserData`)

### 2. `services/customerService.ts`
- Atualizado endpoint para `/customers`
- Atualizada interface `ApiCustomer` para refletir novos campos
- Removida interface `CustomersResponse` (não mais necessária)
- Atualizada função `fetchCustomersFromApi()` para lidar com novo formato de resposta

### 3. `services/apiClient.ts`
- Mantida a URL base `https://api.weboost.pt`
- Nenhuma mudança necessária na estrutura básica

### 4. `store.tsx`
- Atualizada função `login()` para lidar com refresh_token
- Atualizada função `logout()` para limpar refresh_token
- Mantido o gerenciamento de estado existente

### 5. `types.ts`
- Adicionada interface `ApiUserResponse` para dados de usuário da API
- Adicionada interface `ApiCustomerResponse` para dados de clientes da API
- Adicionada interface `Lead` para dados de leads
- Atualizada interface `Tenant` para incluir novos campos opcionais

### 6. Novos Arquivos Criados
- `services/userService.ts` - Serviço para gerenciar usuários
- `services/leadService.ts` - Serviço para gerenciar leads
- `test-api-integration.js` - Script de teste para integração

## 🔄 Fluxo de Autenticação Atualizado

1. **Login**:
   - POST `/auth/token` com username e password
   - Recebe access_token e refresh_token
   - Armazena ambos os tokens
   - Busca dados do usuário com GET `/users/me`
   - Mapeia dados do usuário para o formato do aplicativo
   - Define usuário e tenants disponíveis

2. **Refresh Token**:
   - POST `/auth/refresh` com refresh_token
   - Recebe novos access_token e refresh_token
   - Atualiza tokens armazenados

3. **Logout**:
   - Limpa access_token e refresh_token
   - Limpa dados do usuário

## 🛠️ Migração de Dados

### Mapeamento de Roles
O mapeamento de roles permanece o mesmo:
- 1 = TI → ADMIN
- 2 = admin → ADMIN
- 3 = manager → MANAGER
- 4 = client → CLIENT
- 5 = employee → EMPLOYEE
- 6-10 = employee_* → EMPLOYEE

### Mapeamento de Customers para Tenants
O mapeamento de customers para tenants foi atualizado:
- Cada customer da API vira um tenant do tipo CLIENT
- Usuários admin recebem tenant ADMIN
- Todos os usuários (exceto role 4) recebem tenant INTERNAL
- Novos campos schema_name e status são mapeados para o tenant

## 🧪 Testes

Um script de teste foi criado (`test-api-integration.js`) para verificar:
- Fluxo de autenticação completo
- Refresh de token
- Busca de dados de usuário
- Busca de clientes

## 📝 Notas Importantes

1. **Compatibilidade**: O sistema mantém compatibilidade com o sistema anterior, mas agora usa os novos endpoints
2. **Tokens**: Ambos access_token e refresh_token são armazenados no localStorage
3. **Segurança**: O refresh_token é usado para renovar tokens expirados sem necessidade de novo login
4. **Multi-Tenancy**: O sistema de multi-tenancy continua funcionando, mas agora com dados atualizados
5. **Leads**: Novos endpoints para leads foram adicionados, mas ainda não estão integrados nas páginas

## 🚀 Próximos Passos

1. **Integração de Leads**: Integrar os novos endpoints de leads nas páginas existentes
2. **Refresh Automático**: Implementar lógica para renovar tokens automaticamente quando expirados
3. **Gerenciamento de Usuários**: Integrar os novos endpoints de usuários nas páginas de admin
4. **Testes Finais**: Testar todos os fluxos com a API real
5. **Documentação**: Atualizar documentação existente para refletir as mudanças

## 🔧 Configuração

Nenhuma configuração adicional é necessária. O sistema usa a mesma URL base da API e os tokens são gerenciados automaticamente.

**Variáveis de Ambiente (opcional):**
```env
# .env
VITE_API_BASE_URL=https://api.weboost.pt
```

## 📚 Referência de Endpoints

### Autenticação
- `POST /auth/token` - Login
- `POST /auth/refresh` - Refresh token

### Usuários
- `GET /users/` - Listar usuários
- `GET /users/{user_id}` - Obter usuário específico
- `GET /users/me` - Obter dados do usuário atual
- `POST /users/` - Criar usuário
- `PUT /users/{user_id}` - Atualizar usuário
- `DELETE /users/{user_id}` - Deletar usuário

### Clientes
- `GET /customers/` - Listar clientes
- `GET /customers/{customer_id}` - Obter cliente específico
- `POST /customers/` - Criar cliente
- `PUT /customers/{customer_id}` - Atualizar cliente
- `DELETE /customers/{customer_id}` - Deletar cliente

### Leads
- `GET /tenants/{customer_id}/leads/` - Listar leads
- `GET /tenants/{customer_id}/leads/{lead_id}` - Obter lead específico
- `POST /tenants/{customer_id}/leads/` - Criar lead
- `PUT /tenants/{customer_id}/leads/{lead_id}` - Atualizar lead
- `DELETE /tenants/{customer_id}/leads/{lead_id}` - Deletar lead

## 🎯 Benefícios da Nova API

1. **Segurança Aprimorada**: Refresh tokens para renovação automática
2. **Estrutura Mais Clara**: Endpoints mais organizados e consistentes
3. **Multi-Tenancy Robusto**: Melhor suporte para schemas de tenant
4. **Flexibilidade**: Mais opções de personalização e gerenciamento
5. **Desempenho**: Respostas mais leves e diretas

## 🛡️ Considerações de Segurança

1. **Tokens**: Ambos os tokens são armazenados no localStorage (considerar alternativas mais seguras para produção)
2. **Refresh Token**: Deve ser protegido e usado apenas em requests HTTPS
3. **Validação**: Sempre validar tokens antes de fazer requests
4. **Expiração**: Implementar lógica para lidar com tokens expirados

## 📊 Status da Migração

- ✅ Autenticação: Completo
- ✅ Usuários: Completo
- ✅ Clientes: Completo
- ✅ Leads: Endpoints criados, integração pendente
- ✅ Tipos e Interfaces: Atualizados
- ✅ Gerenciamento de Estado: Atualizado
- ⏳ Integração de Leads: Pendente
- ⏳ Refresh Automático: Pendente
- ⏳ Testes Finais: Pendente

## 🎓 Guia de Uso para Desenvolvedores

### Fazer Login
```typescript
const { user, accessToken, refreshToken } = await loginWithApi('email@example.com', 'password');
```

### Obter Usuário Atual
```typescript
const currentUser = await getCurrentUser();
```

### Listar Clientes
```typescript
const customers = await fetchCustomersFromApi();
```

### Listar Leads
```typescript
const leads = await getLeadsForCustomer(customerId);
```

### Refresh Token
```typescript
const { accessToken, refreshToken } = await refreshAccessToken(currentRefreshToken);
```

### Criar Usuário
```typescript
const newUser = await createUser({
  name: 'Novo Usuário',
  email: 'novo@example.com',
  password: 'senha123',
  role_id: 4
});
```

### Criar Lead
```typescript
const newLead = await createLead(customerId, {
  name: 'Novo Lead',
  email: 'lead@example.com',
  status: 'new'
});
```

## 🔗 Links Úteis

- [Documentação da API Original](API_INTEGRATION.md)
- [Tratamento de Erros](API_ERROR_HANDLING.md)
- [Script de Teste](test-api-integration.js)

## 📅 Histórico de Mudanças

- **v1.0**: Migração inicial para nova API
- **v1.1**: Adicionados serviços de usuários e leads
- **v1.2**: Atualizados tipos e interfaces
- **v1.3**: Documentação completa

## 🤝 Contribuição

Para contribuir com melhorias ou correções:
1. Crie um branch para a nova feature: `git checkout -b feature/nova-feature`
2. Faça commit das mudanças: `git commit -m 'Adiciona nova feature'`
3. Push para o branch: `git push origin feature/nova-feature`
4. Abra um Pull Request

## 📝 Licença

Este projeto é parte do Weboost Dashboard e segue as mesmas políticas de licença.

---