# Weboost Dashboard

Este é um painel de controle administrativo dinâmico desenvolvido em PHP, projetado para o gerenciamento de clientes e usuários, com um sistema de temas claro/escuro, geração de relatórios em PDF e uma arquitetura de views modular.

## Funcionalidades

- **Autenticação:** Sistema de login simples (baseado em mock de frontend).
- **Três Níveis de Acesso:**
    1.  **Visão Geral (`geral.php`):** Um dashboard consolidado com métricas globais.
    2.  **Visão de Cliente (`cliente.php`):** Um dashboard específico para os dados de um cliente selecionado.
    3.  **Visão de Administração (`admin.php`):** Área para gerenciamento de usuários e clientes.
- **Gerenciamento de Clientes (CRUD):**
    - Listagem de clientes com busca e paginação.
    - Criação, edição e visualização de cadastros de clientes.
    - Possibilidade de ativar/desativar clientes.
- **Gerenciamento de Usuários (CRUD):**
    - Listagem de usuários internos.
    - Criação e edição de usuários.
    - Possibilidade de ativar/desativar usuários.
- **Geração de PDF:**
    - Botão para exportar a visualização atual para um arquivo PDF.
    - Utiliza uma API externa (Puppeteer) para a renderização.
    - Implementa um fluxo de autenticação seguro com tokens de uso único baseados em sessão para permitir o acesso da API ao dashboard.
- **Tema Dinâmico:** Suporte completo a modos claro (light) e escuro (dark), com a preferência do usuário salva.
- **Página de Configurações:** Uma área centralizada para configurações de aparência e perfil.

## Estrutura do Projeto

```
/
├─── assets/                # Arquivos de frontend (CSS, JS)
│   ├─── css/style.css      # Folha de estilo principal
│   └─── js/
│       ├─── auth.js        # Lógica de autenticação do lado do cliente
│       └─── main.js        # Script principal com interações do dashboard
│
├─── includes/              # Componentes de layout e configuração em PHP
│   ├─── config.php         # Arquivo principal de configuração e roteamento de contexto
│   ├─── header.php         # Cabeçalho superior do dashboard
│   ├─── sidebar.php        # Barra lateral de navegação
│   ├─── footer.php         # Rodapé e inclusão de scripts JS
│   ├─── menu-*.php         # Menus específicos para cada tipo de visão
│   └─── pdf_*.php          # Cabeçalho e rodapé para a versão de impressão
│
├─── views/                 # Arquivos de conteúdo principal (as "páginas")
│   ├─── geral.php, cliente.php, admin.php # As 3 "homes" principais
│   ├─── list-*.php         # Páginas de listagem (clientes, usuários)
│   ├─── crud-*.php         # Formulários de criação/edição
│   ├─── view-*.php         # Páginas de visualização de detalhes
│   └─── settings.php       # Página de configurações
│
├─── index.php              # Ponto de entrada principal, orquestra o layout e as views
├─── login.php              # Página de login
├─── request_pdf_token.php  # Endpoint backend para gerar tokens de PDF seguros
└─── README.md              # Este arquivo
```

## Fluxo de Funcionamento

1.  **Ponto de Entrada:** Todas as requisições (exceto login) passam pelo `index.php`.
2.  **Configuração:** O `includes/config.php` é carregado primeiro. Ele determina a `view` atual a ser exibida com base no parâmetro `?view=` da URL. Ele também define o contexto do menu para manter a navegação consistente (ex: o menu de "Admin" continua ativo nas páginas de CRUD).
3.  **Roteamento:** O `index.php` usa uma estrutura `if/elseif` para incluir o arquivo de view correto do diretório `/views` com base na `$currentView`.
4.  **Layout:** O `index.php` monta a página HTML, incluindo os componentes de layout como `sidebar.php`, `header.php` e `footer.php` em torno do conteúdo da view.
5.  **Geração de PDF (Fluxo de Segurança):**
    a. O usuário clica no botão "PDF".
    b. O `main.js` faz uma chamada `fetch` para `request_pdf_token.php`.
    c. O backend gera um token seguro, o armazena na `$_SESSION` e o retorna para o JavaScript.
    d. O `main.js` constrói a URL da API do Puppeteer, passando a URL da página atual + o token de uso único.
    e. A API do Puppeteer acessa a URL. O `config.php` valida o token da URL contra o da sessão e, se for válido, permite o acesso e invalida o token.
    f. O PDF é gerado e retornado ao usuário.

## Como Executar

1.  **Requisitos:** Um servidor web com suporte a PHP (ex: Apache, Nginx com PHP-FPM).
2.  **Instalação:** Clone ou copie os arquivos para o diretório raiz do seu servidor web.
3.  **Acesso:** Abra o navegador e acesse a URL correspondente ao `login.php` para começar.
    - Email: `admin@weboost.pt`
    - Password: `password`

Este projeto utiliza dados "mockados" (arrays em PHP) para simular um banco de dados, então não há necessidade de configurar uma conexão com banco de dados para testar as funcionalidades.