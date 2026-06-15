# 🧠 HealthMind — Sistema de gestão para psicólogos e recepcionistas

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![.NET](https://img.shields.io/badge/.NET-8-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)

---

## 💡 O que é o HealthMind?

O **HealthMind** é um sistema de gestão para clínicas de psicologia, criado para centralizar e organizar o dia a dia da clínica em um só lugar. Ele cobre desde o cadastro de pacientes e o agendamento de sessões até o acompanhamento clínico e o controle financeiro.

O sistema separa claramente as responsabilidades entre dois perfis de usuário:

- 🧑‍⚕️ **Psicólogo** — foco no acompanhamento clínico: prontuários, histórico, saúde mental, evolução das sessões e disponibilidades.
- 👤 **Recepcionista** — foco na operação administrativa: pacientes, agendamentos, psicólogos, planos de saúde e financeiro.

Cada perfil enxerga apenas as telas e os dados pertinentes ao seu papel, garantindo organização, segurança e confidencialidade.

---

## ✨ Funcionalidades

### Acompanhamento clínico (Psicólogo)
- 📋 **Prontuários** — dados do paciente, contato de emergência, anotações privadas e medicamentos
- 🏥 **Histórico médico e saúde mental** — queixa, impacto, expectativas, diagnósticos prévios e antecedentes
- 📈 **Evolução das sessões** — registros, escalas (humor, ansiedade, sono, função social) e metas terapêuticas
- 🗓️ **Disponibilidades** — gestão dos horários de atendimento do psicólogo

### Operação administrativa (Recepcionista)
- 👥 **Pacientes** — cadastro completo, com plano de saúde e psicólogo responsável
- 📅 **Agendamentos** — marcação, reagendamento e cancelamento de sessões
- 💳 **Financeiro** — controle de pagamentos, status e resumo de receitas
- 🩺 **Planos de saúde** e 🧑‍⚕️ **Psicólogos** — consulta e gestão

### Recursos transversais
- 🔐 Autenticação JWT com sessão vinculada à aba do navegador
- 🛡️ Controle de acesso por papel (rotas protegidas e itens de menu por perfil)
- ✅ Marcação automática de sessões passadas como **realizadas**
- 📨 Envio de credenciais por e-mail no cadastro de usuários (EmailJS)

---

## 🛠️ Stack tecnológico

### Back-end
- **Framework:** ASP.NET Core (.NET 8)
- **Linguagem:** C#
- **Arquitetura:** Clean Architecture com CQRS (MediatR)
- **Persistência:** MongoDB
- **Autenticação:** JWT (JSON Web Tokens)
- **Documentação:** Swagger / OpenAPI

### Front-end
- **Framework:** React 19 + TypeScript
- **Build tool:** Vite 6
- **Roteamento:** React Router v7
- **HTTP:** Axios
- **Formulários e validação:** React Hook Form + Zod
- **E-mail:** EmailJS

---

## 📁 Estrutura do projeto

```
HealthMindSystem/
├── Back-end/
│   └── HealthMindBackend/
│       ├── HealthMindBackend.API/               # Controllers e endpoints
│       ├── HealthMindBackend.Application/        # Casos de uso (CQRS / handlers)
│       ├── HealthMindBackend.Domain/             # Entidades, value objects e regras
│       ├── HealthMindBackend.Infrastructure/     # Acesso a dados (MongoDB)
│       ├── HealthMindBackend.Infrastructure.IoC/ # Injeção de dependências
│       ├── HealthMindBackend.Tests/              # Testes
│       └── HealthMindBackend.sln
├── Front-end/
│   └── health-mind-system-frontend/
│       ├── src/
│       │   ├── pages/        # Telas (agendamentos, financeiro, prontuário, etc.)
│       │   ├── components/   # Layout e componentes de página
│       │   └── shared/       # Serviços, hooks, contextos, tipos e utils
│       └── public/           # Arquivos estáticos
└── README.MD
```

---

## 🚀 Como começar

### Pré-requisitos
- **Node.js 18+** e npm
- **.NET SDK 8+**
- **MongoDB** em execução (local ou em nuvem)

### 1. Back-end

```bash
cd Back-end/HealthMindBackend

# Restaurar dependências
dotnet restore

# Iniciar a API
dotnet run --project HealthMindBackend.API
```

Antes de rodar, configure em `HealthMindBackend.API/appsettings.json`:
- a **connection string** do MongoDB;
- a seção **`JWT`** (`Secret`, `ValidIssuer`, `ValidAudience`).

> ⚠️ **Segurança:** não versione o `JWT:Secret` real no repositório. Prefira variáveis de ambiente ou *user-secrets* (`dotnet user-secrets`) e mantenha o `appsettings.json` apenas com placeholders.

### 2. Front-end

```bash
cd Front-end/health-mind-system-frontend

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Crie um arquivo **`.env`** na raiz do front-end apontando para a API:

```env
VITE_API_URL=UrlAPISwaggerBackend
```

### 3. Acessar a aplicação
- **Front-end:** http://localhost:5173
- **Swagger UI:** `{URL_DA_API}/swagger`

### Scripts úteis do front-end

| Script             | Descrição                                            |
| ------------------ | ---------------------------------------------------- |
| `npm run dev`      | Sobe o servidor de desenvolvimento (Vite)            |
| `npm run build`    | Checagem de tipos (`tsc`) + build de produção        |
| `npm run type-check` | Apenas a checagem de tipos do TypeScript           |
| `npm run preview`  | Pré-visualiza o build de produção                    |

---

## 🔐 Autenticação e perfis de acesso

A API usa **JWT**. Após o login, o token é enviado em cada requisição no header:

```http
Authorization: Bearer {token}
```

No front-end, o token e os dados do usuário ficam no **`sessionStorage`**, ou seja, a sessão é encerrada ao fechar a aba/navegador, exigindo novo login no próximo acesso. Rotas internas são protegidas: usuários não autenticados são redirecionados para a tela de login e, após autenticar, retornam à página que tentaram acessar.

### Perfis

| Perfil           | Acesso                                                                       |
| ---------------- | ---------------------------------------------------------------------------- |
| **Psicólogo**    | Prontuários, histórico, saúde mental, evolução, consultar sessões, planos de saúde, financeiro, recepcionistas, psicólogos e disponibilidades       |
| **Recepcionista**| Pacientes, agendamentos, psicólogos, disponibilidades dos psicólogos e financeiro            |

#### Exemplo de login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@healthmind.com",
  "senha": "sua-senha"
}
```

Em caso de sucesso, a resposta inclui o **token JWT**, usado nas demais chamadas.

---

## 🌐 Módulos da API

Os endpoints seguem o padrão `api/[controller]`. A documentação completa (parâmetros, corpos e respostas) está disponível no **Swagger** da API.

| Módulo            | Rota base                | Responsabilidade                                                      |
| ----------------- | ------------------------ | -------------------------------------------------------------------- |
| Autenticação      | `/api/auth`              | Login e emissão de token                                             |
| Pacientes         | `/api/paciente`          | Cadastro e gestão de pacientes                                       |
| Psicólogos        | `/api/psicologo`         | Psicólogos, especialidades e disponibilidades                       |
| Recepcionistas    | `/api/recepcionista`     | Cadastro e gestão de recepcionistas                                 |
| Sessões           | `/api/sessao`            | Agendamentos, pagamentos, registros e escalas de sessão             |
| Prontuários       | `/api/prontuario`        | Prontuário, contato de emergência, anotações e medicamentos         |
| Histórico médico  | `/api/historicomedico`   | Histórico clínico e saúde mental                                    |
| Diagnósticos      | `/api/diagnostico`       | Registro e acompanhamento de diagnósticos                           |
| Progressão        | `/api/progressao`        | Evolução e metas terapêuticas                                       |
| Planos de saúde   | `/api/planosaude`        | Convênios e coberturas                                              |

### Códigos HTTP utilizados

| Código | Significado                                  |
| ------ | -------------------------------------------- |
| `200`  | Requisição bem-sucedida                      |
| `201`  | Recurso criado                               |
| `204`  | Operação sem conteúdo de retorno (ex.: delete)|
| `400`  | Erro de validação                            |
| `401`  | Token inválido ou ausente                    |
| `403`  | Sem permissão para o recurso                 |
| `404`  | Recurso não encontrado                       |
| `500`  | Erro interno do servidor                     |

---

## 📐 Regras de negócio (destaques)

- **Sessões:** ao serem carregadas, sessões pendentes cujo horário já passou são marcadas automaticamente como **realizadas**; sessões já realizadas não podem mais ser reagendadas ou canceladas.
- **Pagamentos:** o domínio valida combinações inválidas — por exemplo, pagamento **isento** não aceita forma de pagamento nem parcelamento, e formas como **dinheiro** ou **cartão de débito** não podem ser parceladas.
- **Acesso por papel:** cada perfil só visualiza os dados sob sua responsabilidade (o psicólogo, por exemplo, vê apenas os pagamentos e as sessões dos próprios pacientes).

---

## 🛡️ Segurança

- ✅ Autenticação via **JWT**
- ✅ Autorização baseada em **papéis** (psicólogo / recepcionista)
- ✅ Sessão **vinculada à aba** do navegador (`sessionStorage`)
- ✅ Rotas protegidas no front-end e no back-end
- ✅ Validação de entrada com **Zod** (front) e regras de domínio (back)
