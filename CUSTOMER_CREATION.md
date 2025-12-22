# Documentação da Página de Criação de Clientes

## 📄 Visão Geral

A página de criação de clientes permite que administradores criem novos clientes (tenants) no sistema Weboost. Cada cliente criado recebe um schema de banco de dados dedicado.

## 🎯 Funcionalidades

- Criar novos clientes com informações básicas
- Visualizar lista de clientes existentes
- Alternar entre formulário de criação e lista de clientes
- Validação de dados do formulário
- Feedback visual para sucesso/erro

## 🚀 Como Acessar

1. Faça login como administrador
2. Navegue até o menu "Clientes" na sidebar
3. Clique em "Criar Cliente" no submenu
4. Ou acesse diretamente: `https://dashboard.weboost.pt/#/admin/customer-create`

## 📋 Campos do Formulário

### Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| **Nome do Cliente** | Texto | Nome completo do cliente | "Empresa XYZ Ltda" |
| **Email** | Email | Email de contato do cliente | "contato@empresa.com" |
| **Nome do Schema** | Texto | Nome único para o schema do banco de dados | "empresa_xyz" |
| **NIF** | Texto | Número de identificação fiscal | "123456789" |

### Campos Opcionais

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| **Telefone** | Texto | Número de telefone de contato | "+351900000000" |
| **Nome Fiscal** | Texto | Nome fiscal completo | "Empresa XYZ Ltda" |
| **Data de Início** | Data | Data de início do contrato | "2025-12-22" |
| **Website** | URL | URL do website | "https://empresa.com" |
| **E-commerce** | URL | URL da loja online | "https://loja.empresa.com" |
| **Rua** | Texto | Nome da rua | "Rua Principal" |
| **Número** | Texto | Número do endereço | "123" |
| **Cidade** | Texto | Cidade | "Lisboa" |
| **País** | Texto | País | "Portugal" |
| **CEP** | Texto | Código postal | "1234-567" |
| **Nome do Proprietário** | Texto | Nome do proprietário | "João Silva" |
| **Email do Proprietário** | Email | Email do proprietário | "joao@empresa.com" |
| **Telefone do Proprietário** | Texto | Telefone do proprietário | "+351900000000" |
| **Nome do Contato** | Texto | Nome do contato principal | "Maria Souza" |
| **Email do Contato** | Email | Email do contato principal | "maria@empresa.com" |
| **Telefone do Contato** | Texto | Telefone do contato principal | "+351900000001" |

### Campos Automáticos

| Campo | Tipo | Valor Padrão | Descrição |
|-------|------|--------------|-----------|
| **status** | Booleano | true | Status do cliente (ativo/inativo) |
| **type_id** | Número | 1 | Tipo de cliente |
| **status_customer_id** | Número | 1 | ID do status do cliente |
| **manager_id** | Número | 1 | ID do gerente responsável |
| **other_contacts_ids** | Array | [] | IDs de outros contatos |

## ⚠️ Regras e Validações

1. **Nome do Schema**:
   - Deve ser único no sistema
   - Será automaticamente prefixado com "customer_"
   - Apenas caracteres alfanuméricos e underscores
   - Máximo de 50 caracteres

2. **Email**:
   - Deve ser um email válido
   - Não pode estar em uso por outro cliente

3. **NIF**:
   - Deve ser único no sistema
   - Apenas números

## 🔧 Endpoint da API

A página utiliza o seguinte endpoint:

```
POST /customers/
```

### Corpo da Requisição

```json
{
  "name": "string",
  "email": "string",
  "schema_name": "string",
  "nif": "string",
  "phone": "string (opcional)"
}
```

### Cabeçalhos

```
Authorization: Bearer <YOUR_ACCESS_TOKEN>
Content-Type: application/json
```

### Resposta de Sucesso (201 Created)

```json
{
  "name": "string",
  "email": "string",
  "schema_name": "string",
  "status": true,
  "phone": "string",
  "id": 0,
  "created_at": "2025-12-21T22:57:57.525Z",
  "updated_at": "2025-12-21T22:57:57.525Z"
}
```

## 📝 Fluxo de Criação

1. **Preenchimento do Formulário**:
   - Usuário preenche todos os campos obrigatórios
   - Campos opcionais podem ser deixados em branco

2. **Validação**:
   - Validação no lado do cliente
   - Validação no lado do servidor

3. **Envio**:
   - Dados são enviados para a API
   - Token de autenticação é incluído nos cabeçalhos

4. **Resposta**:
   - Em caso de sucesso: mensagem de sucesso é exibida
   - Em caso de erro: mensagem de erro é exibida
   - Formulário é resetado após sucesso

5. **Atualização da Lista**:
   - Lista de clientes é automaticamente atualizada
   - Novo cliente aparece na lista

## 🎨 Componentes Utilizados

### CustomerForm
Componente principal do formulário com:
- Campos de entrada com validação
- Botões de ação (Criar, Cancelar)
- Mensagens de feedback (sucesso, erro)
- Loading state durante o envio

### CustomerList
Componente para visualizar clientes existentes:
- Tabela com informações dos clientes
- Status visual (Ativo/Inativo)
- Botão para atualizar a lista
- Loading state durante o carregamento

## 🔐 Permissões

- **Acesso**: Apenas usuários com role ADMIN (roles 1, 2, 3)
- **Restrição**: Usuários com role CLIENT (role 4) não têm acesso
- **Autenticação**: Requer token JWT válido

## 🛠️ Solução de Problemas

### Problema: Não consigo acessar a página
**Solução**:
1. Verifique se está logado como administrador
2. Verifique se seu usuário tem permissões de admin
3. Tente fazer logout e login novamente

### Problema: Erro ao criar cliente
**Soluções**:
1. Verifique se todos os campos obrigatórios estão preenchidos
2. Verifique se o email é válido
3. Verifique se o schema_name é único
4. Verifique se o NIF é único
5. Verifique sua conexão com a internet
6. Consulte os logs no console para mais detalhes

### Problema: Schema_name já existe
**Solução**:
1. Escolha um nome de schema diferente
2. Adicione um sufixo (ex: "empresa_xyz_01")
3. Verifique a lista de clientes para ver schemas existentes

## 📊 Exemplos

### Exemplo de Criação Bem-sucedida

**Entrada**:
```json
{
  "name": "Nova Empresa",
  "email": "contato@novaempresa.com",
  "schema_name": "nova_empresa",
  "status": true,
  "phone": "+351900000003",
  "type_id": 1,
  "status_customer_id": 1,
  "manager_id": 1,
  "date_init": "2025-12-22",
  "fiscal_name": "Nova Empresa Ltda",
  "nif": "111222333",
  "url_website": "https://novaempresa.com",
  "url_ecommerce": "https://loja.novaempresa.com",
  "street_name": "Rua Principal",
  "street_number": "123",
  "city": "Lisboa",
  "country": "Portugal",
  "zip": "1234-567",
  "owner_name": "João Silva",
  "owner_email": "joao@novaempresa.com",
  "owner_phone": "+351900000000",
  "contact_name": "Maria Souza",
  "contact_email": "maria@novaempresa.com",
  "contact_phone": "+351900000001",
  "other_contacts_ids": []
}
```

**Resposta**:
```json
{
  "name": "Nova Empresa",
  "email": "contato@novaempresa.com",
  "schema_name": "nova_empresa",
  "status": true,
  "phone": "+351900000003",
  "id": 5,
  "created_at": "2025-12-21T22:57:57.525Z",
  "updated_at": "2025-12-21T22:57:57.525Z"
}
```

### Exemplo de Erro (Schema já existe)

**Entrada**:
```json
{
  "name": "Empresa Existente",
  "email": "contato@existente.com",
  "schema_name": "empresa_existente",  // Já existe
  "nif": "999888777"
}
```

**Resposta**:
```json
{
  "detail": [
    {
      "loc": ["body", "schema_name"],
      "msg": "Schema name already exists",
      "type": "value_error"
    }
  ]
}
```

## 🎯 Melhores Práticas

1. **Nomenclatura de Schema**:
   - Use nomes curtos e descritivos
   - Evite caracteres especiais
   - Use underscores para separar palavras
   - Exemplo: "empresa_nome_projeto"

2. **Informações do Cliente**:
   - Use o nome legal completo
   - Use um email corporativo válido
   - Inclua o telefone com código do país

3. **Organização**:
   - Mantenha uma convenção de nomenclatura consistente
   - Documente os clientes criados
   - Atualize a lista regularmente

## 🚀 Integração com Outros Sistemas

Após a criação do cliente:
1. O schema de banco de dados é automaticamente criado
2. As tabelas padrão são criadas no schema
3. O cliente pode ser associado a usuários existentes
4. O cliente aparece na lista de tenants disponíveis

## 📚 Referência de Códigos de Status

| Código | Significado | Ação Recomendada |
|--------|-------------|------------------|
| 201 | Criado com sucesso | Nenhuma ação necessária |
| 400 | Requisição inválida | Verifique os dados enviados |
| 401 | Não autorizado | Faça login novamente |
| 409 | Conflito (schema/NIF já existe) | Escolha valores únicos |
| 500 | Erro no servidor | Tente novamente mais tarde |

## 📅 Histórico de Mudanças

- **v1.0**: Criação inicial da página
- **v1.1**: Adicionada lista de clientes
- **v1.2**: Melhorias na validação
- **v1.3**: Adicionados logs detalhados

## 🤝 Contribuição

Para sugerir melhorias ou reportar bugs:
1. Abra uma issue no repositório
2. Descreva o problema com detalhes
3. Inclua screenshots se possível
4. Indique a prioridade

## 📝 Notas Técnicas

- **Framework**: React 18 com TypeScript
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: React Context API
- **Autenticação**: JWT com tokens armazenados no localStorage
- **Responsividade**: Design adaptável para mobile e desktop

## 🔗 Links Relacionados

- [Documentação da API](API_INTEGRATION.md)
- [Migração para Nova API](API_MIGRATION.md)
- [README Principal](README.md)

## 🛡️ Segurança

- Todos os dados são enviados via HTTPS
- Token JWT é requerido para todas as operações
- Dados sensíveis não são armazenados no cliente
- Validação no lado do servidor para todas as entradas

## 🎓 Guia Rápido

1. **Criar Cliente**: Preencha o formulário e clique em "Criar Cliente"
2. **Ver Lista**: Clique em "Ver Lista de Clientes"
3. **Atualizar**: Clique em "Atualizar Lista" para ver mudanças
4. **Voltar ao Formulário**: Clique em "Criar Novo Cliente"

## 📊 Status da Implementação

- ✅ Formulário de criação
- ✅ Validação de dados
- ✅ Integração com API
- ✅ Lista de clientes
- ✅ Navegação entre formulário e lista
- ✅ Mensagens de feedback
- ✅ Loading states
- ✅ Tratamento de erros
- ✅ Documentação completa

## 🎯 Próximos Passos

1. **Edição de Clientes**: Adicionar funcionalidade para editar clientes existentes
2. **Exclusão de Clientes**: Adicionar funcionalidade para excluir clientes
3. **Associação de Usuários**: Permitir associar usuários a clientes durante a criação
4. **Importação em Massa**: Adicionar funcionalidade para importar múltiplos clientes
5. **Exportação**: Adicionar opção para exportar lista de clientes

## 📝 Licença

Este componente é parte do Weboost Dashboard e segue as mesmas políticas de licença do projeto principal.

---