# Retentix - Plataforma SaaS de Retenção e Marketing

Bem-vindo ao repositório do **Retentix**, uma plataforma SaaS moderna e responsiva focada em CRM (Customer Relationship Management), CDP (Customer Data Platform) e Agência de Marketing Digital.

Este projeto utiliza tecnologias de ponta, incluindo Inteligência Artificial (Google Gemini) para prospeção de leads e análise de SEO, operando numa arquitetura *Multi-Tenancy*.

---

## 🚀 Funcionalidades Principais

### 🏢 Core & Arquitetura
*   **Multi-Tenancy Real**: Alternância dinâmica entre contextos (Admin, Agência Interna, Clientes).
*   **Autenticação**: Login simulado com animações modernas e persistência de sessão.
*   **Dark/Light Mode**: Tema persistente com deteção automática.
*   **Responsividade**: Sidebar adaptável (Drawer em Mobile) e layouts fluídos.

### 🤖 Módulos de IA (Gemini 2.5)
1.  **AI Scraper & Enriquecimento**:
    *   Prospeção de leads baseada em geolocalização (Google Maps).
    *   Enriquecimento de dados (Email, Redes Sociais, Telefones).
    *   Exportação via Webhook (n8n).
2.  **Auditoria SEO & GEO**:
    *   Análise técnica de sites em tempo real (Fetch HTML real).
    *   Validação de Schema (JSON-LD) e Core Web Vitals.
    *   Análise de concorrentes e lacunas de palavras-chave.
    *   *Search Grounding* para evitar alucinações da IA.

### ⚙️ Gestão Administrativa
*   **Gestão de Tenants**: Cadastro completo de clientes empresariais.
*   **Contratos Inteligentes**: Associação de múltiplos serviços e departamentos.
*   **Catálogo de Serviços**: Gestão de preços e ciclos de faturação.
*   **Parceiros & Indicações**: Sistema de controlo de comissões e referrals.
*   **Eventos**: Gestão de leads captados em feiras.

---

## 🛠️ Stack Tecnológica

O projeto foi construído para performance e escalabilidade:

- **Frontend**: React 18 (Vite + TypeScript).
- **Estilização**: Tailwind CSS (Design System personalizado).
- **Inteligência Artificial**: Google GenAI SDK (Gemini 2.5 Flash).
- **Mapas**: Leaflet (OpenStreetMap).
- **Gráficos**: Recharts (Visualização de dados).
- **Ícones**: Lucide React.
- **Estado Global**: React Context API + LocalStorage.

---

## 📂 Estrutura do Projeto

```bash
/
├── components/      # UI Reutilizável (Tables, Forms, Charts, AI Components)
├── pages/           # Vistas (Admin, Dashboards, Ferramentas AI)
├── services/        # Lógica de Negócio e Integrações
│   ├── aiService.ts      # Streaming e Parsing do Gemini
│   ├── seoService.ts     # Lógica de Auditoria SEO (HTML Proxy + AI)
│   ├── webhookService.ts # Integração n8n
│   └── mockService.ts    # Dados estáticos
├── store/           # Gestão de Estado Global (Auth & Tenancy)
├── App.tsx          # Roteamento e Layouts Protegidos
├── constants.tsx    # Mock Data e Configurações
├── types.ts         # Definições TypeScript (Interfaces)
└── index.html       # Configuração Tailwind e Leaflet
```

---

## 🚀 Como Executar

1.  **Instalar dependências**:
    ```bash
    npm install
    ```

2.  **Iniciar Servidor**:
    ```bash
    npm run dev
    ```

3.  **Aceder**:
    Abra `http://localhost:5173` no navegador.
    *   **Login**: As credenciais de login para o ambiente de desenvolvimento estão agora incorporadas no código (`admin@retentix.com` / `admin123`).

> **Nota**: As variáveis de ambiente, como a chave da API do Gemini, foram incorporadas diretamente no código-fonte para simplificar a configuração. Para um ambiente de produção, é altamente recomendável voltar a usar um sistema de gestão de segredos ou ficheiros `.env`.

---

## 📝 Roadmap Futuro

- [ ] Integração Backend (Node.js/Supabase).
- [ ] Autenticação Real (Auth0 ou Firebase).
- [ ] Exportação PDF Nativa dos Relatórios SEO.
- [ ] Dashboard Financeiro (Stripe integration).

---

**Retentix** - *Potenciar a Retenção, Maximizar o Valor com IA.*