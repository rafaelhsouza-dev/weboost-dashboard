# Integração com API de Autenticação

Este documento descreve as mudanças feitas para integrar o dashboard com a API real de autenticação.

## 🔧 Mudanças Realizadas

### 1. Novo Serviço de Autenticação (`services/authService.ts`)

Criamos um novo serviço que lida com a autenticação real:

- **`loginWithApi(email, password)`**: Faz login na API real e retorna usuário e token
- **`logoutFromApi()`**: Faz logout limpando tokens e cookies
- **`checkAuth()`**: Verifica se o usuário está autenticado
- **Mapeamento de dados**: Converte dados da API para os tipos do aplicativo

### 2. Modificações no Store (`store.tsx`)

Atualizamos o gerenciamento de estado para usar a API real:

- **Login**: Agora tenta primeiro a API real, depois usa fallback para mock
- **Logout**: Agora é assíncrono e limpa tokens corretamente
- **Persistência**: Armazena o access token no localStorage
- **Fallback**: Mantém compatibilidade com dados mock para desenvolvimento

### 3. Atualização do Componente Login (`components/Login.tsx`)

Melhorias na interface de login:

- **Remoção de credenciais pré-preenchidas**
- **Melhor tratamento de erros** com mensagens claras
- **Indicador de loading** durante o processo de login
- **Feedback visual** para erros de autenticação

### 4. Novo Hook de Autenticação (`services/useAuth.ts`)

- **`useAuthCheck()`**: Verifica automaticamente o status de autenticação ao carregar o app
- **Restaurar sessão**: Preparado para restaurar sessão com token válido

### 5. Atualizações no App Principal (`App.tsx`)

- **Verificação de autenticação** ao carregar o aplicativo
- **Integração do hook** de autenticação

## 🚀 Como Usar

### Login com API Real

```typescript
// O login agora tenta primeiro a API real
const success = await login('email@exemplo.com', 'senha123');

// Em caso de sucesso:
// - Token é armazenado no localStorage
// - Usuário é mapeado para o formato do aplicativo
// - Tenants são configurados automaticamente

// Em caso de falha:
// - Mostra mensagem de erro clara
// - Permite fallback para credenciais mock em desenvolvimento
```

### Logout

```typescript
// O logout agora é assíncrono
await logout();

// Isso irá:
// - Chamar o endpoint de logout da API
// - Limpar tokens e dados locais
// - Redirecionar para a tela de login
```

## 🔐 Endpoint da API

O sistema agora usa o endpoint real:

```
POST https://api.weboost.pt/auth/login
Content-Type: application/x-www-form-urlencoded

Parameters:
- grant_type: password
- username: email do usuário
- password: senha do usuário
- scope: (opcional)
- client_id: (opcional)
- client_secret: (opcional)
```

## 📦 Mapeamento de Dados

### Roles

A API retorna roles que são mapeadas para os tipos do aplicativo:

- `admin` → `Role.ADMIN`
- `manager` → `Role.MANAGER`
- `client` → `Role.CLIENT`
- default → `Role.EMPLOYEE`

### Customers → Tenants

Os customers da API são convertidos para tenants do aplicativo:

- Cada customer vira um tenant do tipo `CLIENT`
- Usuários admin recebem um tenant `ADMIN`
- Todos os usuários recebem um tenant `INTERNAL`

## 🎯 Benefícios

1. **Autenticação Real**: Integração com o sistema de autenticação real
2. **Segurança**: Uso de tokens JWT e cookies para refresh token
3. **Fallback**: Mantém compatibilidade com dados mock para desenvolvimento
4. **Melhor UX**: Feedback claro durante o processo de login
5. **Extensível**: Fácil de adicionar novas funcionalidades de autenticação

## 🛠️ Configuração

### Variáveis de Ambiente

O sistema usa a URL da API diretamente, mas você pode configurar:

```env
# .env
VITE_API_BASE_URL=https://api.weboost.pt
```

### Desenvolvimento

Para desenvolvimento offline, você pode:

1. Usar as credenciais mock: `admin@weboost.io` / `weboost#2025`
2. O sistema automaticamente usará o fallback se a API não estiver disponível

## 🔧 Próximos Passos

1. **Implementar refresh de token**: Adicionar lógica para renovar tokens expirados
2. **Proteção de rotas**: Verificar token antes de permitir acesso a rotas protegidas
3. **Recuperação de senha**: Implementar fluxo de recuperação de senha
4. **Registro de usuário**: Adicionar funcionalidade de registro

## 📝 Notas

- O sistema mantém compatibilidade retroativa com o sistema mock
- Todos os erros são tratados e mostrados ao usuário
- O token de acesso é armazenado no localStorage para persistência
- O refresh token é armazenado em cookies HTTP-only para segurança
