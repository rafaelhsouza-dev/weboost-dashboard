# WeBoost Dashboard - Guia de Arquitetura e Padrões

Este documento descreve o funcionamento, a estrutura e os padrões de desenvolvimento do WeBoost Dashboard.

## 🚀 Tecnologias Core
- **Framework:** React 18 (TypeScript)
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React
- **Roteamento:** React Router DOM (HashRouter)
- **Estado Global:** Context API

---

## 🏗️ Arquitetura Multi-Tenancy

O projeto utiliza um conceito de "Modos de Visualização" baseados em Tenants:

1.  **INTERNAL (Weboost):** Visualização padrão para funcionários da WeBoost. É onde a operação acontece.
2.  **ADMIN:** Modo administrativo para gestão global do sistema, migrations e status técnico.
3.  **CLIENT:** Visualização específica para o cliente final (Tenant), focada em seus próprios dados (Leads, etc).

O estado `currentTenant` no `store.tsx` determina qual menu o usuário vê e qual contexto de dados está ativo.

---

## 📁 Estrutura de Pastas

- `/components`: Componentes de UI reutilizáveis (Botões, Inputs, Tabelas).
- `/pages`: Componentes de rota. Organizados por prefixo:
    - `Admin...`: Páginas de gestão global.
    - `Client...`: Páginas para o cliente final.
    - `User...`: Páginas da operação interna (Weboost).
- `/services`: Camada de API e lógica de negócio.
- `/public`: Ativos estáticos (Imagens, Ícones).
- `store.tsx`: Gerenciamento de estado global e persistência local.
- `types.ts`: Definições globais de interfaces e enums.

---

## 🔐 Autenticação e Segurança

### Fluxo de Login
1. O usuário autentica em `/auth/token`.
2. O sistema recebe um `access_token` e um `refresh_token`.
3. O `access_token` é armazenado no `localStorage` e injetado em todas as requisições via `apiInterceptor.ts`.

### Interceptor de API (`services/apiInterceptor.ts`)
- Gerencia automaticamente a expiração de tokens.
- Se uma requisição falha com 401, ele tenta renovar o token via `/auth/refresh` antes de deslogar o usuário.
- Centraliza o tratamento de erros e respostas.

---

## 🔄 Gerenciamento de Estado (`store.tsx`)

O `AppProvider` centraliza:
- Dados do usuário logado.
- Tenant ativo (`currentTenant`).
- Lista de tenants disponíveis para o usuário.
- Tema (Light/Dark) e estado do Sidebar.

**Padrão de uso:** `const { user, currentTenant, setTenant } = useApp();`

---

## 🎨 Padrões de Desenvolvimento

### Naming Conventions
- **Componentes:** PascalCase (`CustomerForm.tsx`)
- **Funções e Variáveis:** camelCase (`fetchCustomers`)
- **Arquivos de Serviço:** camelCase (`customerService.ts`)

### Componentes de UI (Design System)
Sempre prefira utilizar os componentes base em `/components`:
- `Input`: Com suporte a labels, erros e `helpText`.
- `Button`: Com variantes `primary`, `secondary` e `ghost`.
- `DataTable`: Para listagens com suporte a acessors customizados.
- `Card`: Para containers padronizados.

### Integração com API
1. Defina a interface no `types.ts`.
2. Crie as funções de chamada no serviço correspondente em `/services/`.
3. Utilize o `apiInterceptor` para garantir que o token seja enviado.
4. Mantenha os payloads rigorosamente alinhados com o `endpoints.md`.

---

## 🚀 Comandos Úteis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção na pasta `dist/`.
- `npx tsc --noEmit`: Verifica erros de tipagem no projeto.
