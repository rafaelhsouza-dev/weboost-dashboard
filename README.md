# WeBoost Dashboard - Plataforma de Gestão Multi-Tenant

O **WeBoost Dashboard** é uma aplicação web moderna e robusta para gestão de leads, clientes e utilizadores, desenvolvida especificamente para operar em ambiente multi-tenant com múltiplos níveis de acesso e visualização.

## 🚀 Tecnologias Core
- **Framework:** [React 19](https://react.dev/) (TypeScript)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS 3](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Roteamento:** React Router DOM (HashRouter para compatibilidade com SPA em Nginx)
- **Estado Global:** Context API (AppProvider)
- **Visualização de Dados:** Recharts

---

## 🎨 Sistema de Design e UI
O projeto segue uma identidade visual minimalista e profissional, focada exclusivamente em tons de **Verde, Preto e Branco**.

### Características Visuais:
- **Paleta de Cores:** Baseada no verde primário da WeBoost (`#009950`), com cinzas cromáticos esverdeados para suavizar a interface.
- **Modo Dark/Light:** Suporte nativo com persistência de preferência. O modo light utiliza um tom off-white esverdeado (`gray-50`) para reduzir o cansaço visual.
- **Bordas Suavizadas:** Bordas sutis e arredondamento consistente (`rounded-xl`) em todos os componentes de card e input.
- **Impressão Profissional:** Estilos de impressão otimizados que ocultam navegação, forçam o modo claro e mantêm o layout de desktop fiel em documentos A4 (Portrait/Landscape).

---

## 🏗️ Arquitetura de Permissões e Contextos

A plataforma utiliza um sistema híbrido de **Papéis (Roles)** e **Contextos (Tenants)** para determinar o que um utilizador pode ver e fazer.

### 1. Níveis de Acesso (Roles)
Os papéis de utilizador determinam a autoridade global no sistema:
- **CEO / Admin (IDs 1, 2):** Acesso total e irrestrito a todos os tenants e configurações.
- **Manager / User / Employee (IDs 3, 5+):** Utilizadores operacionais da WeBoost com acesso a múltiplos clientes conforme atribuído.
- **Client (ID 4):** Utilizadores finais com visualização estritamente limitada aos seus próprios dados.

### 2. Lógica de Restrição e Visibilidade (Technical Enforcement)
A segurança de visualização não depende apenas das rotas, mas é aplicada na camada de estado global (`store.tsx`):

- **Filtragem de Tenants:** A lista de clientes exibida no seletor da Sidebar (`availableTenants`) é calculada dinamicamente. Se o utilizador possuir o **Role ID 4**, o sistema realiza um cruzamento entre a lista global de clientes e o array `allowedTenants` (IDs autorizados) retornado pela API no momento do login.
- **Isolamento de Dados:** Como o `currentTenant` é o único ponto de verdade para as chamadas de API (como em Leads), um utilizador de perfil Client nunca consegue "trocar" para um ID de cliente que não esteja no seu array de permissões, pois este não constará na sua lista de opções disponíveis.
- **Persistência de Contexto:** O sistema guarda o último tenant acedido no `localStorage`, mas valida sempre contra as permissões atuais do utilizador a cada recarregamento da página.

### 3. Modos de Visualização (Contextos)
A interface adapta-se dinamicamente com base no `currentTenant` selecionado na Store:

| Modo | Identificador | Público-Alvo | Funcionalidades Principais |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | Administradores | Gestão de Clientes, Utilizadores, Migrações e Status. |
| **INTERNAL** | `internal` | Equipe WeBoost | Dashboard de operação interna da agência. |
| **CLIENT** | `c{id}` | Clientes Finais | Gestão de Leads, relatórios e definições da conta. |

### 3. Dinâmica dos Menus
A `Sidebar` reconstrói-se automaticamente através da função `getMenuItems()` sempre que o contexto muda:
- Se o contexto for **ADMIN**, o menu exibe ferramentas de infraestrutura e gestão global.
- Se o contexto for **CLIENT**, o menu foca em Leads e resultados específicos daquele cliente.
- Utilizadores com permissões elevadas podem alternar entre esses mundos através do seletor de contexto (**Alternar Modo**) no topo da Sidebar.

### 4. Lógica de Roteamento (`TenantRouter`)
O componente `TenantRouter` atua como um guarda de trânsito:
- Ao aceder à raiz (`/`), ele verifica o tipo do tenant ativo e redireciona o utilizador para o dashboard apropriado (`/admin/dashboard`, `/client/dashboard` ou `/user/dashboard`).
- Isso garante que o utilizador nunca caia numa página em branco ou sem permissão.

---

## ✨ Funcionalidades Implementadas

### 🏢 Gestão de Clientes (Customers)
- CRUD completo de clientes com suporte a esquemas de base de dados individuais.
- Configurações globais de Tipos e Status de clientes.
- Gestão granular de acesso de utilizadores por cliente.

### 👥 Gestão de Utilizadores
- Cadastro e edição de utilizadores globais.
- Atribuição de perfis de acesso (CEO, Admin, Manager, User, Employee).
- Lógica de segurança que oculta senhas em visualizações e permite atualização opcional.

### 📈 Gestão de Leads
- Dashboard de leads específico para cada tenant.
- Cadastro, edição e exclusão de potenciais clientes.
- Sistema de status dinâmico (Novo, Qualificado, Convertido, Perdido).

### ⚡ Administração e Infraestrutura
- Painel de controle para execução de Migrações em todos os tenants simultaneamente.
- Monitor de Status em tempo real para verificar integridade de schemas e conexão.

### 🔔 Sistema de Notificações
- Notificações globais (Toasts) integradas ao estado da aplicação.
- Feedback imediato para ações de sucesso ou erro, com auto-close após 5 segundos.

---

## 📁 Estrutura do Projeto

- `/components`: UI kit (Button, Input, Card, DataTable, Notification, etc).
- `/pages`: Telas da aplicação organizadas por contexto (Admin, Client, User).
- `/services`: Camada de comunicação com API (Axios-like interceptors, refresh token).
- `/public`: Ativos estáticos e logotipos.
- `store.tsx`: Central de estado global e persistência.
- `types.ts`: Tipagem estática rigorosa para toda a aplicação.

---

## 🔐 Segurança e API

### Fluxo de Autenticação
- Autenticação baseada em JWT (JSON Web Token).
- **Auto-Refresh:** Interceptor de API que renova o token automaticamente em caso de expiração (401), garantindo sessão contínua sem logout forçado.
- **Payload Cleaning:** Sistema de limpeza de dados que remove campos nulos/vazios antes do envio, evitando erros de processamento (422 Unprocessable Content).

---

## 🚢 Implantação (Deployment)

O projeto está preparado para conteinerização via Docker.

### Comandos de Desenvolvimento:
```bash
npm install    # Instala as dependências
npm run dev    # Inicia o ambiente de desenvolvimento
npm run build  # Gera a versão de produção
```

### Docker:
O projeto inclui um `Dockerfile` multi-stage:
1. **Stage 1 (Build):** Compila o código React com Node 18.
2. **Stage 2 (Production):** Serve os arquivos estáticos utilizando Nginx Alpine, com configurações otimizadas para SPA e controle de cache para `index.html`.

---

## ⚙️ Configuração e Extensibilidade

### 1. Conexão com a API
O endereço base da API está centralizado em `services/config.ts`. Para apontar para um ambiente de teste ou staging, altere a constante `API_BASE_URL`.

### 2. Uso do Sistema de Notificações
Não utilize `alert()` nativo. Utilize o hook `useApp` para disparar toasts elegantes:
```tsx
const { notify } = useApp();
notify("Mensagem aqui", "success"); // Tipos: 'success', 'error', 'info'
```

### 3. Padrão de Listagens (DataTable)
O componente `DataTable` em `/components` é o padrão para todas as listas. Ele aceita uma prop `accessor` que pode ser uma chave do objeto ou uma função para renderizar elementos complexos (como badges ou botões).

### 4. Customização de Marca
- **Logotipos:** Localizados em `/public/imgs/`.
- **Filtro de Cor:** O logotipo da Sidebar utiliza a classe CSS `brightness-0` no modo light para garantir o visual minimalista preto, e `brightness-100` no modo dark para restaurar as cores originais.

---

## 🛠️ Boas Práticas de Desenvolvimento
- **Componentização:** Se um elemento é usado mais de uma vez, ele deve estar em `/components`.
- **CSS-in-JS:** Uso exclusivo de Tailwind CSS para evitar poluição de arquivos CSS globais.
- **Tratamento de Erros:** Sempre utilize a função `notify` do `useApp()` para exibir mensagens ao utilizador.
- **API:** Mantenha os serviços rigorosamente alinhados com o arquivo `endpoints.md`.

---
&copy; 2025 Weboost. Todos os direitos reservados.