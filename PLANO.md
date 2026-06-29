# Plano de Implementação — Sistema de Gerenciamento de Biblioteca

## Stack

| Camada   | Tecnologia                                   |
| -------- | -------------------------------------------- |
| Backend  | Node.js + Express + Sequelize                |
| Banco    | PostgreSQL (ou MySQL)                        |
| Auth     | JWT (bcrypt + jsonwebtoken)                  |
| Docs     | Swagger (swagger-jsdoc + swagger-ui-express) |
| Frontend | React (Vite) + React Router + Axios + Recharts |
| Extras   | Docker, testes (Jest/Supertest)               |

---

## Arquitetura

```
gerenciador_de_biblioteca/
├── backend/                  # API Express
│   ├── src/
│   │   ├── config/           # DB, auth, swagger configs
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── middlewares/      # auth, role, error handler, upload
│   │   ├── models/           # Sequelize models
│   │   ├── routes/           # Express routers
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── validators/       # Request validation (Joi/Yup)
│   │   ├── utils/            # Helpers
│   │   └── app.js            # Express app setup
│   ├── tests/
│   ├── uploads/              # Book cover images
│   └── package.json
├── frontend/                 # React (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── services/         # API client (axios)
│   │   ├── contexts/         # Auth context, Notification context
│   │   ├── hooks/            # Custom hooks
│   │   └── App.jsx
│   └── package.json
├── docker-compose.yml
├── AGENTS.md
├── PLANO.md
└── projeto.md
```

---

## Modelagem do Banco de Dados

### users

| Coluna     | Tipo    | Notas                      |
| ---------- | ------- | -------------------------- |
| id         | UUID/PK | auto                       |
| name       | string  |                            |
| email      | string  | unique                     |
| password   | string  | bcrypt hash                |
| role       | enum    | admin / librarian / reader |
| cpf        | string  | nullable, unique           |
| phone      | string  | nullable                   |
| address    | text    | nullable                   |
| status     | enum    | active / inactive          |
| created_at | date    |                            |
| updated_at | date    |                            |

### books

| Coluna             | Tipo    | Notas                   |
| ------------------ | ------- | ----------------------- |
| id                 | UUID/PK | auto                    |
| title              | string  |                         |
| author             | string  |                         |
| publisher          | string  |                         |
| year               | integer |                         |
| category           | string  |                         |
| isbn               | string  | unique                  |
| total_quantity     | integer |                         |
| available_quantity | integer |                         |
| cover_image        | string  | nullable (bonus)        |
| status             | enum    | available / unavailable |
| created_at         | date    |                         |
| updated_at         | date    |                         |

### loans

| Coluna      | Tipo       | Notas                  |
| ----------- | ---------- | ---------------------- |
| id          | UUID/PK    | auto                   |
| user_id     | FK → users |                        |
| book_id     | FK → books |                        |
| loan_date   | date       |                        |
| due_date    | date       |                        |
| return_date | date       | nullable               |
| status      | enum       | open / returned / late |
| created_at  | date       |                        |
| updated_at  | date       |                        |

### notifications (bonus)

| Coluna   | Tipo            |
| -------- | --------------- |
| id       | PK              |
| user_id  | FK → users      |
| message  | text            |
| type     | enum            | overdue / return / system |
| read     | boolean         | default false     |
| loan_id  | FK → loans      | nullable          |
| created_at | date          |                   |

### password_resets (bonus)

| Coluna     | Tipo    |
| ---------- | ------- |
| id         | PK      |
| user_id    | FK      |
| token      | string  |
| expires_at | date    |
| used       | boolean |

---

## Tarefas

### Fase 0 — Setup do projeto

- [ ] Inicializar `backend/` com `npm init`, instalar deps (express, sequelize, pg, bcrypt, jsonwebtoken, swagger-jsdoc, swagger-ui-express, joi, cors, dotenv, multer)
- [ ] Inicializar `frontend/` com Vite + React, instalar deps (axios, react-router-dom, react-hook-form, recharts, react-hot-toast)
- [ ] Configurar `docker-compose.yml` com PostgreSQL e pgAdmin
- [ ] Configurar `.env` com variáveis de ambiente
- [ ] Criar script `dev` no backend (nodemon) e frontend (vite)

### Fase 1 — Banco de dados

- [ ] Modelagem Sequelize: `User`, `Book`, `Loan`, `PasswordReset`
- [ ] Migrations para todas as tabelas
- [ ] Seeds: 1 admin, 1 librarian, 2 readers + livros de exemplo

### Fase 2 — Backend: Autenticação e usuários

- [ ] `POST /auth/register` — cadastro de usuário (admin/librarian apenas)
- [ ] `POST /auth/login` — login, gera JWT
- [ ] `POST /auth/forgot-password` (bonus)
- [ ] `POST /auth/reset-password` (bonus)
- [ ] Middleware `authenticate` — verifica JWT
- [ ] Middleware `authorize(...roles)` — controle de permissões
- [ ] CRUD de usuários (`GET/POST/PUT/DELETE /users`) — admin only para delete

### Fase 3 — Backend: Livros

- [ ] `GET /books` — listar com paginação (bonus), filtros (título, autor, categoria, ISBN, disponibilidade)
- [ ] `GET /books/:id` — detalhe
- [ ] `POST /books` — criar (admin/librarian)
- [ ] `PUT /books/:id` — editar (admin/librarian)
- [ ] `DELETE /books/:id` — deletar (admin/librarian)
- [ ] `POST /books/:id/cover` — upload de capa (bonus, multer)

### Fase 4 — Backend: Leitores

- [ ] `GET /readers` — listar leitores com paginação, busca por nome/CPF
- [ ] `GET /readers/:id` — detalhe + histórico empréstimos
- [ ] `POST /readers` — cadastrar leitor
- [ ] `PUT /readers/:id` — editar
- [ ] `PATCH /readers/:id/inactivate` — inativar

### Fase 5 — Backend: Empréstimos

- [ ] `POST /loans` — registrar empréstimo (valida: livro disponível, leitor ativo, decrementa available_quantity)
- [ ] `PUT /loans/:id/return` — registrar devolução (incrementa available_quantity)
- [ ] `GET /loans` — listar com filtros (status, data, leitor) + paginação
- [ ] `GET /loans/overdue` — listar atrasados
- [ ] `GET /loans/my` — leitor vê próprios empréstimos
- [ ] Regra: marcar como "late" automaticamente ao consultar se due_date < hoje e não devolvido
- [ ] `GET /notifications` — listar notificações do usuário logado (bonus)
- [ ] `PATCH /notifications/:id/read` — marcar notificação como lida (bonus)
- [ ] Ao criar empréstimo ou detectar atraso, gerar notificação no banco (bonus)

### Fase 6 — Backend: Dashboard e relatórios (bonus)

- [ ] `GET /dashboard/stats` — total livros, total leitores, total empréstimos, atrasados, livros mais emprestados
- [ ] `GET /dashboard/loans-by-month` — empréstimos por mês (gráfico)
- [ ] `GET /dashboard/books-by-category` — livros por categoria

### Fase 7 — Backend: Swagger

- [ ] Configurar swagger-jsdoc com definições em JSDoc nas rotas
- [ ] Servir em `/api-docs`
- [ ] Documentar todos os endpoints: parâmetros, bodies, respostas, schemas

### Fase 8 — Backend: Testes automatizados (bonus)

- [ ] Setup Jest + Supertest
- [ ] Testes de autenticação (register, login, token inválido)
- [ ] Testes CRUD livros
- [ ] Testes CRUD leitores
- [ ] Testes de empréstimos (regras de negócio)
- [ ] Testes de autorização (role blocking)

### Fase 9 — Frontend: Setup e Auth

- [ ] Layout base: navbar com navegação condicional por role, sidebar (opcional)
- [ ] Tela de Login
- [ ] Tela de cadastro de usuário (admin)
- [ ] Auth context: armazena token/user no localStorage, redireciona se não autenticado
- [ ] Rotas protegidas por role

### Fase 10 — Frontend: Livros

- [ ] Lista de livros com paginação (bonus) e filtros (busca por título/autor/categoria)
- [ ] Tela de cadastro/edição de livro
- [ ] Upload de capa (bonus)
- [ ] Exclusão com confirmação

### Fase 11 — Frontend: Leitores

- [ ] Lista de leitores com busca por nome/CPF
- [ ] Tela de cadastro/edição de leitor
- [ ] Inativação de leitor
- [ ] Histórico de empréstimos do leitor

### Fase 12 — Frontend: Empréstimos

- [ ] Lista de empréstimos com filtros (status, data, leitor)
- [ ] Tela de registro de empréstimo (selecionar leitor + livro)
- [ ] Botão de devolução
- [ ] Visualização de atrasados
- [ ] Leitor vê apenas seus próprios empréstimos

### Fase 13 — Frontend: Dashboard (bonus)

- [ ] Cards com totais (livros, leitores, empréstimos, atrasados)
- [ ] Gráfico de empréstimos por mês (Recharts)
- [ ] Gráfico de livros por categoria

### Fase 14 — Frontend: Sistema de Notificações (bonus)

- [ ] Componente de sino no header com badge de quantidade não lida
- [ ] Modal/dropdown listando notificações (tipo: empréstimo realizado, devolução pendente, atraso detectado)
- [ ] Marcar notificação como lida ao clicar
- [ ] Polling ou atualização periódica das notificações

### Fase 15 — Frontend: Extras (bonus)

- [ ] Recuperação de senha (tela de forgot + reset)
- [ ] Componente de paginação reutilizável
- [ ] Notificações toast para ações (sucesso/erro)

### Fase 16 — Docker

- [ ] `Dockerfile` para backend
- [ ] `Dockerfile` para frontend (Nginx para build)
- [ ] `docker-compose.yml` com PostgreSQL + backend + frontend
