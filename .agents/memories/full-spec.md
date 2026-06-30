# Memories — Gerenciador de Biblioteca

## Stack verificada

- **Backend:** Node 22, Express 4, Sequelize 6, PostgreSQL 17
- **Frontend:** React 19, Vite 8, React Router DOM, Axios, Recharts, React Hot Toast, React Icons
- **Auth:** bcryptjs + jsonwebtoken
- **Validação:** Joi
- **Upload:** Multer (5MB limit, imagens apenas)
- **Testes:** Jest 29 + Supertest 7
- **Docker:** postgres:17-alpine, node:22-alpine, nginx:stable-alpine

## Banco de dados

- **Banco:** `biblioteca` (user: postgres, pass: postgres, host: localhost:5432)
- **Teste:** `biblioteca_test` (mesmo user/pass)
- **Migrations:** `backend/src/database/migrations/`
- **Seeds:** `backend/src/database/seeders/`
- Comando: `npm run migrate:reset` (undo + migrate + seed)

## Backend

- Entry: `src/server.js`, Express app em `src/app.js`
- Autoload de models em `src/models/index.js`
- Middleware de auth em `src/middlewares/auth.js` (JWT verify + user lookup)
- Middleware de role: `authorize(...roles)` em `src/middlewares/role.js`
- Validação Joi em `src/validators/index.js`
- Rotas: auth, books, readers, loans, users, dashboard, notifications
- Swagger em `/api-docs` (config em `src/config/swagger.js`)
- Erro handler global em `src/middlewares/errorHandler.js`
- Servir arquivos estáticos em `/uploads`

### Services (lógica de negócio)

- `AuthService` — register, login, forgot/reset password (token crypto armazenado em password_resets)
- `BookService` — CRUD + busca/filtros Op.iLike + paginação offset/limit
- `ReaderService` — CRUD leitores (role=reader) + inativação
- `LoanService` — empréstimo (decrementa available), devolução (incrementa), overdue detection, gera notificações
- `DashboardService` — stats, loansByMonth (to_char), booksByCategory, mostLoaned
- `NotificationService` — CRUD notificações por usuário

### Regras de negócio em empréstimos

- Livro precisa ter `available_quantity > 0`
- Leitor precisa estar `active`
- Só leitores (role=reader) podem pegar livros
- Mesmo leitor não pode ter 2 empréstimos abertos do mesmo livro
- Ao criar empréstimo: available_quantity--, se chegar a 0 → status=unavailable
- Ao devolver: available_quantity++, status=available
- Status "late" atribuído automaticamente na query de overdue

## Frontend

- Entry: `src/main.jsx`, App em `src/App.jsx`
- Auth context em `src/contexts/AuthContext.jsx` (armazena token+user no localStorage)
- Notification context em `src/contexts/NotificationContext.jsx` (polling a cada 30s)
- API client em `src/services/api.js` (axios + token interceptor + 401 redirect)
- Rotas protegidas via `PrivateRoute` (componente inline em App.jsx)

### Páginas

| Página | Rota | Acesso |
|---|---|---|
| Login | /login | público |
| Recuperar senha | /forgot-password | público |
| Livros (lista) | /books | todos (autenticados) |
| Livro (novo/edit) | /books/new, /books/:id/edit | admin/librarian |
| Leitores | /readers | admin/librarian |
| Leitor (novo/edit) | /readers/new, /readers/:id/edit | admin/librarian |
| Empréstimos | /loans | admin/librarian |
| Novo empréstimo | /loans/new | admin/librarian |
| Meus empréstimos | /my-loans | reader |
| Dashboard | /dashboard | admin/librarian |
| Usuários | /users | admin |

### Notificações in-app

- Sino no header com badge
- Dropdown com lista (ordem decrescente de created_at)
- Polling a cada 30s pelo NotificationContext
- Ler notificação ao clicar (PATCH /notifications/:id/read)
- Tipos: loan (empréstimo realizado), return (devolução), overdue (atraso), system

## Docker

- `docker-compose.yml` com db + backend + frontend
- Backend Dockerfile: node:22-alpine, migrate+seed+cmd
- Frontend Dockerfile: multi-stage (build node + nginx)
- Nginx config: proxy /api/ → backend:3000
- Volume para pgdata e uploads

## Seeds

- 4 usuários: admin, librarian, 2 readers
- 5 livros de exemplo
- 2 empréstimos (1 returned, 1 open)
- Senha padrão: 123456 (bcrypt hash)

## Testes

- Framework: Jest + Supertest
- Arquivo: `backend/tests/api.test.js`
- Setup: `beforeAll` faz login nos 3 perfis, sync do banco
- Testa: auth, books CRUD, readers CRUD, loans CRUD, role authorization
- Roda com: `npm test` (--detectOpenHandles --forceExit)

## Observações

- Sempre rodar `npm run migrate` antes de iniciar
- Se precisar resetar: `npm run migrate:reset`
- Uploads vão para `backend/uploads/`, servidos em `/uploads/`
- Frontend se comunica com backend via variável `VITE_API_URL` (default localhost:3000)
- O frontend em produção via nginx faz proxy reverso de /api/ para o backend
