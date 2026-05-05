# 🧠 HealthMind - Sistema de gerenciamento para psicologos e recepcionistas


[![Status](https://img.shields.io/badge/status-Em%20Desenvolvimento-yellow.svg)]()
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev)
[![.NET](https://img.shields.io/badge/.NET-Modern-512BD4?logo=.net)](https://dotnet.microsoft.com)

---

## 💡 O que é HealthMind?

HealthMind é um sistema de gestão completo voltado para clínicas psicológicas, projetado para centralizar e organizar todas as atividades cotidianas. O sistema permite o gerenciamento eficiente de:

- 📋 **Prontuários Clínicos**: Registros detalhados e seguros de cada paciente
- 📚 **Históricos Médicos**: Acompanhamento completo do histórico de saúde do paciente
- 🔍 **Diagnósticos**: Registro e acompanhamento de diagnósticos clinicamente estabelecidos
- 📅 **Agendamentos e Sessões**: Gestão de consultas e atendimentos
- 💳 **Pagamentos**: Controle de transações e receitas
- 👥 **Gerenciamento de Pacientes**: Cadastro, perfil e histórico de todos os pacientes
- 🧑‍⚕️ **Gerenciamento de Psicólogos**: Registro, especialidades e pacientes atribuídos
- 👤 **Gerenciamento de Recepcionistas**: Cadastro e gestão de recepcionistas

O sistema é estruturado para separar claramente as responsabilidades entre **Psicólogos** (gerenciamento clínico) e **Recepcionistas** (operações administrativas), garantindo segurança, confidencialidade e eficiência nas operações diárias da clínica.

---


## 🛠️ Stack Tecnológico

### Back-end
- **Framework**: ASP.NET Core
- **Linguagem**: C#
- **Arquitetura**: Clean Architecture com CQRS
- **Autenticação**: JWT (JSON Web Tokens)
- **Documentação**: Swagger/OpenAPI
- **Persistência**: MongoDB

### Front-end
- **Framework**: React 19
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Gráficos**: ApexCharts
- **Animações**: Framer Motion
- **Roteamento**: React Router v7
- **Ícones**: Tabler Icons


---

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+ (para front-end)
- .NET 8+ (para back-end)
- npm ou yarn

### Instalação - Front-end

```bash
cd Front-end/health-mind-frontend/vite

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Instalação - Back-end

```bash
cd Back-end/HealthMindBackend

# Restaurar dependências NuGet
dotnet restore

# Rodar as migrações do banco (se necessário)
dotnet ef database update

# Iniciar a API
dotnet run --project HealthMindBackend.API
```

### Acessar a Aplicação
- **Frontend**: http://localhost:5173 (desenvolvimento)
- **Backend API**: https://localhost:5001
- **Swagger UI**: https://localhost:5001/swagger

---

## � API Endpoints

### 📌 Autenticação

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "senha": "senha123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuarioId": "uuid",
  "tipoUsuario": "recepcionista | psicologo | admin",
  "nome": "João Silva"
}
```

### 👥 Pacientes

#### Listar Pacientes
```http
GET /api/pacientes
Headers: Authorization: Bearer {token}

Response: 200 OK
{
  "total": 15,
  "pagina": 1,
  "itens": [
    {
      "id": "uuid",
      "nome": "Maria Santos",
      "dataNascimento": "1990-05-15",
      "email": "maria@example.com",
      "cpfCnpj": "123.456.789-00",
      "psicoloroId": "uuid",
      "psicologo": { "id": "uuid", "nome": "Dr. Carlos" },
      "dataCriacao": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Obter Paciente por ID
```http
GET /api/pacientes/{id}
Headers: Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "nome": "Maria Santos",
  "dataNascimento": "1990-05-15",
  "email": "maria@example.com",
  "cpfCnpj": "123.456.789-00",
  "psicoloroId": "uuid",
  "psicologo": { "id": "uuid", "nome": "Dr. Carlos" },
  "dataCriacao": "2024-01-15T10:30:00Z",
  "dataAtualizacao": "2024-01-20T14:00:00Z"
}
```

#### Criar Paciente
```http
POST /api/pacientes
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Maria Santos",
  "dataNascimento": "1990-05-15",
  "email": "maria@example.com",
  "cpfCnpj": "123.456.789-00",
  "psicoloroId": "uuid"
}

Response: 201 Created
{
  "id": "uuid",
  "nome": "Maria Santos",
  "dataNascimento": "1990-05-15",
  "email": "maria@example.com",
  "cpfCnpj": "123.456.789-00",
  "psicoloroId": "uuid",
  "dataCriacao": "2024-01-15T10:30:00Z"
}
```

#### Atualizar Paciente
```http
PUT /api/pacientes/{id}
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Maria Santos Silva",
  "email": "maria.silva@example.com",
  "psicoloroId": "uuid-novo"
}

Response: 200 OK
{
  "id": "uuid",
  "nome": "Maria Santos Silva",
  "dataNascimento": "1990-05-15",
  "email": "maria.silva@example.com",
  "cpfCnpj": "123.456.789-00",
  "psicoloroId": "uuid-novo",
  "dataAtualizacao": "2024-01-20T14:00:00Z"
}
```

#### Deletar Paciente
```http
DELETE /api/pacientes/{id}
Headers: Authorization: Bearer {token}

Response: 204 No Content
```

### 📅 Sessões

#### Listar Sessões
```http
GET /api/sessoes
Headers: Authorization: Bearer {token}

Response: 200 OK
{
  "total": 25,
  "pagina": 1,
  "itens": [
    {
      "id": "uuid",
      "pacienteId": "uuid",
      "psicoloroId": "uuid",
      "dataSessao": "2024-02-15T14:00:00Z",
      "tipoAtendimento": "online | presencial",
      "valor": 150.00,
      "formaPagamento": "dinheiro | cartao | transferencia",
      "temParcelas": true,
      "totalParcelas": 3,
      "status": "agendada | realizada | cancelada"
    }
  ]
}
```

#### Criar Sessão
```http
POST /api/sessoes
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "pacienteId": "uuid",
  "psicoloroId": "uuid",
  "dataSessao": "2024-02-15T14:00:00Z",
  "tipoAtendimento": "online",
  "valor": 150.00,
  "formaPagamento": "cartao",
  "temParcelas": true,
  "totalParcelas": 3
}

Response: 201 Created
{
  "id": "uuid",
  "pacienteId": "uuid",
  "psicoloroId": "uuid",
  "dataSessao": "2024-02-15T14:00:00Z",
  "tipoAtendimento": "online",
  "valor": 150.00,
  "formaPagamento": "cartao",
  "temParcelas": true,
  "totalParcelas": 3,
  "status": "agendada"
}
```

#### Atualizar Sessão
```http
PUT /api/sessoes/{id}
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "dataSessao": "2024-02-16T14:00:00Z",
  "valor": 160.00,
  "status": "agendada"
}

Response: 200 OK
{
  "id": "uuid",
  "dataSessao": "2024-02-16T14:00:00Z",
  "valor": 160.00,
  "status": "agendada"
}
```

#### Deletar Sessão
```http
DELETE /api/sessoes/{id}
Headers: Authorization: Bearer {token}

Response: 204 No Content
```

### 💳 Pagamentos

#### Listar Pagamentos
```http
GET /api/pagamentos
Headers: Authorization: Bearer {token}

Response: 200 OK
{
  "total": 30,
  "pagina": 1,
  "itens": [
    {
      "id": "uuid",
      "sessaoId": "uuid",
      "pacienteId": "uuid",
      "valor": 150.00,
      "formaPagamento": "cartao",
      "dataPagamento": "2024-01-20T10:00:00Z",
      "status": "pago | pendente | recusado",
      "numeroParcela": 1,
      "totalParcelas": 3
    }
  ]
}
```

#### Obter Pagamento
```http
GET /api/pagamentos/{id}
Headers: Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "sessaoId": "uuid",
  "pacienteId": "uuid",
  "valor": 150.00,
  "formaPagamento": "cartao",
  "dataPagamento": "2024-01-20T10:00:00Z",
  "status": "pago",
  "numeroParcela": 1,
  "totalParcelas": 3
}
```

### 📋 Prontuários (Psicólogo)

#### Listar Prontuários
```http
GET /api/prontuarios
Headers: Authorization: Bearer {token}

Response: 200 OK
{
  "total": 10,
  "pagina": 1,
  "itens": [
    {
      "id": "uuid",
      "codigo": "PRONT-001",
      "pacienteId": "uuid",
      "psicoloroId": "uuid",
      "descricao": "Paciente apresenta sintomas de ansiedade...",
      "medicacoes": ["Sertalina", "Clonazepam"],
      "status": "ativo | encerrado | arquivado | suspenso",
      "dataAbertura": "2024-01-15T10:30:00Z",
      "dataAtualizacao": "2024-01-25T15:45:00Z"
    }
  ]
}
```

#### Criar Prontuário
```http
POST /api/prontuarios
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "pacienteId": "uuid",
  "descricao": "Paciente apresenta sintomas de ansiedade...",
  "medicacoes": ["Sertalina", "Clonazepam"],
  "status": "ativo"
}

Response: 201 Created
{
  "id": "uuid",
  "codigo": "PRONT-001",
  "pacienteId": "uuid",
  "psicoloroId": "uuid",
  "descricao": "Paciente apresenta sintomas de ansiedade...",
  "medicacoes": ["Sertalina", "Clonazepam"],
  "status": "ativo",
  "dataAbertura": "2024-01-15T10:30:00Z"
}
```

#### Atualizar Prontuário
```http
PUT /api/prontuarios/{id}
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "descricao": "Paciente melhorando com o tratamento...",
  "medicacoes": ["Sertalina"],
  "status": "ativo"
}

Response: 200 OK
{
  "id": "uuid",
  "codigo": "PRONT-001",
  "descricao": "Paciente melhorando com o tratamento...",
  "medicacoes": ["Sertalina"],
  "status": "ativo",
  "dataAtualizacao": "2024-01-25T15:45:00Z"
}
```

### 🏥 Histórico Médico (Psicólogo)

#### Listar Históricos
```http
GET /api/historicomedicao
Headers: Authorization: Bearer {token}

Response: 200 OK
{
  "total": 5,
  "pagina": 1,
  "itens": [
    {
      "id": "uuid",
      "codigo": "HIST-001",
      "pacienteId": "uuid",
      "descricao": "Paciente com histórico de depressão...",
      "dataCriacao": "2024-01-10T09:00:00Z",
      "dataAtualizacao": "2024-01-25T14:30:00Z"
    }
  ]
}
```

#### Criar Histórico
```http
POST /api/historicomedicao
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "pacienteId": "uuid",
  "descricao": "Paciente com histórico de depressão..."
}

Response: 201 Created
{
  "id": "uuid",
  "codigo": "HIST-001",
  "pacienteId": "uuid",
  "descricao": "Paciente com histórico de depressão...",
  "dataCriacao": "2024-01-10T09:00:00Z"
}
```

#### Atualizar Histórico
```http
PUT /api/historicomedicao/{id}
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "descricao": "Paciente com histórico de depressão maior..."
}

Response: 200 OK
```

#### Deletar Histórico
```http
DELETE /api/historicomedicao/{id}
Headers: Authorization: Bearer {token}

Response: 204 No Content
```

### 🔍 Diagnósticos (Psicólogo)

#### Listar Diagnósticos
```http
GET /api/diagnosticos
Headers: Authorization: Bearer {token}

Response: 200 OK
{
  "total": 8,
  "pagina": 1,
  "itens": [
    {
      "id": "uuid",
      "codigo": "DIAG-001",
      "pacienteId": "uuid",
      "descricao": "Transtorno de Ansiedade Generalizada",
      "cid": "F41.1",
      "dataDiagnostico": "2024-01-15",
      "observacoes": "Paciente apresenta sintomas...",
      "status": "ativo | em_tratamento | encerrado"
    }
  ]
}
```

#### Criar Diagnóstico
```http
POST /api/diagnosticos
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "pacienteId": "uuid",
  "descricao": "Transtorno de Ansiedade Generalizada",
  "cid": "F41.1",
  "dataDiagnostico": "2024-01-15",
  "observacoes": "Paciente apresenta sintomas...",
  "status": "ativo"
}

Response: 201 Created
{
  "id": "uuid",
  "codigo": "DIAG-001",
  "pacienteId": "uuid",
  "descricao": "Transtorno de Ansiedade Generalizada",
  "cid": "F41.1",
  "dataDiagnostico": "2024-01-15",
  "observacoes": "Paciente apresenta sintomas...",
  "status": "ativo"
}
```

#### Atualizar Diagnóstico
```http
PUT /api/diagnosticos/{id}
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "em_tratamento",
  "observacoes": "Paciente iniciou medicação..."
}

Response: 200 OK
```

### 📈 Progressão (Psicólogo)

#### Listar Progressões
```http
GET /api/progressoes
Headers: Authorization: Bearer {token}

Response: 200 OK
{
  "total": 12,
  "pagina": 1,
  "itens": [
    {
      "id": "uuid",
      "pacienteId": "uuid",
      "descricao": "Paciente apresentando melhoras significativas...",
      "dataCriacao": "2024-01-20T11:00:00Z"
    }
  ]
}
```

#### Criar Progressão
```http
POST /api/progressoes
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "pacienteId": "uuid",
  "descricao": "Paciente apresentando melhoras significativas..."
}

Response: 201 Created
{
  "id": "uuid",
  "pacienteId": "uuid",
  "descricao": "Paciente apresentando melhoras significativas...",
  "dataCriacao": "2024-01-20T11:00:00Z"
}
```

#### Deletar Progressão
```http
DELETE /api/progressoes/{id}
Headers: Authorization: Bearer {token}

Response: 204 No Content
```

### 👨‍⚕️ Psicólogos (Admin)

#### Listar Psicólogos
```http
GET /api/psicologos
Headers: Authorization: Bearer {token}

Response: 200 OK
{
  "total": 5,
  "pagina": 1,
  "itens": [
    {
      "id": "uuid",
      "codigo": "PSIC-001",
      "nome": "Dr. Carlos Silva",
      "cpfCnpj": "123.456.789-00",
      "crp": "CRP/UF 12345/01",
      "especialidade": "Ansiedade e Depressão",
      "email": "carlos@example.com",
      "dataCriacao": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Criar Psicólogo
```http
POST /api/psicologos
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Dr. Carlos Silva",
  "cpfCnpj": "123.456.789-00",
  "crp": "CRP/UF 12345/01",
  "especialidade": "Ansiedade e Depressão",
  "email": "carlos@example.com",
  "senha": "senha_segura_123"
}

Response: 201 Created
{
  "id": "uuid",
  "codigo": "PSIC-001",
  "nome": "Dr. Carlos Silva",
  "cpfCnpj": "123.456.789-00",
  "crp": "CRP/UF 12345/01",
  "especialidade": "Ansiedade e Depressão",
  "email": "carlos@example.com"
}
```

#### Atualizar Psicólogo
```http
PUT /api/psicologos/{id}
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Dr. Carlos Silva Santos",
  "especialidade": "Ansiedade, Depressão e TDAH"
}

Response: 200 OK
```

#### Deletar Psicólogo
```http
DELETE /api/psicologos/{id}
Headers: Authorization: Bearer {token}

Response: 204 No Content
```

### 👤 Recepcionistas (Admin)

#### Listar Recepcionistas
```http
GET /api/recepcionistas
Headers: Authorization: Bearer {token}

Response: 200 OK
{
  "total": 3,
  "pagina": 1,
  "itens": [
    {
      "id": "uuid",
      "codigo": "REC-001",
      "nome": "Ana Costa",
      "cpf": "987.654.321-11",
      "turno": "manhã | tarde | noite",
      "email": "ana@example.com",
      "dataCriacao": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Criar Recepcionista
```http
POST /api/recepcionistas
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Ana Costa",
  "cpf": "987.654.321-11",
  "turno": "manhã",
  "email": "ana@example.com",
  "senha": "senha_segura_123"
}

Response: 201 Created
{
  "id": "uuid",
  "codigo": "REC-001",
  "nome": "Ana Costa",
  "cpf": "987.654.321-11",
  "turno": "manhã",
  "email": "ana@example.com"
}
```

#### Atualizar Recepcionista
```http
PUT /api/recepcionistas/{id}
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "turno": "tarde"
}

Response: 200 OK
```

#### Deletar Recepcionista
```http
DELETE /api/recepcionistas/{id}
Headers: Authorization: Bearer {token}

Response: 204 No Content
```

---


## 📐 Regras e Comportamentos da API

### 🔐 Segurança e Autenticação

- ✅ **Token JWT**: Válido por 24 horas
- ✅ **Renovação de Token**: Endpoint `/api/auth/refresh`
- ✅ **Roles e Permissões**:
  - `recepcionista`: Gerencia pacientes, sessões e pagamentos
  - `psicologo`: Acessa seus próprios pacientes e dados clínicos
  - `admin`: Acesso total ao sistema
```

### 🔄 Códigos HTTP Padrão

200 OK              - Requisição bem-sucedida
201 Created         - Recurso criado com sucesso
204 No Content      - Deleção bem-sucedida
400 Bad Request     - Erro de validação
401 Unauthorized    - Token inválido ou ausente
403 Forbidden       - Sem permissão para acessar
404 Not Found       - Recurso não encontrado
500 Internal Server - Erro do servidor
```
```

### 🔁 Regras de Negócio

**Pacientes:**
- Deve ter um psicólogo responsável atribuído
- CPF/CNPJ deve ser único no sistema
- Não pode ser deletado se tiver sessões agendadas

**Sessões:**
- A data da sessão não pode ser anterior à atual
- Psicólogo e paciente devem estar ativos no sistema
- Não pode ter dois agendamentos simultâneos para o mesmo psicólogo

**Pagamentos:**
- Gerados automaticamente ao criar uma sessão com parcelas
- Apenas recepcionista pode registrar pagamento
- Status: pendente → pago ou pendente → recusado

**Prontuários:**
- Apenas psicólogo pode criar/editar prontuário
- Deve estar vinculado a um paciente
- Histórico de alterações mantido automaticamente

**Diagnósticos:**
- Requer código CID válido
- Apenas psicólogo responsável pode registrar
- Não pode haver dois diagnósticos ativos simultaneamente para o mesmo tipo



```
## �📁 Estrutura do Projeto
````
HealthMind/
├── Back-end/
│   └── HealthMindBackend/
│       ├── HealthMindBackend.API/          # Controllers e endpoints
│       ├── HealthMindBackend.Application/  # Lógica de negócio (CQRS)
│       ├── HealthMindBackend.Domain/       # Entidades e regras
│       ├── HealthMindBackend.Infrastructure/ # Acesso a dados
│       ├── HealthMindBackend.Infrastructure.IoC/ # Injeção de dependências
│       └── HealthMindBackend.Tests/        # Testes unitários
├── Front-end/
│   └── health-mind-frontend/
│       ├── vite/                           # Aplicação principal
│       │   ├── src/                        # Código-fonte
│       │   └── public/                     # Arquivos estáticos
│       └── remix/                          # (Alternativa em Remix)
└── README.MD                               # Este arquivo


````
## 🔐 Segurança

````
- ✅ Autenticação com JWT
- ✅ Autorização baseada em roles
- ✅ HTTPS obrigatório
- ✅ Validação de entrada em todos os endpoints
- ✅ Dados sensíveis criptografados
