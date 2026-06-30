# Biblioteca API

API REST para o Sistema de Gerenciamento de Biblioteca.

## Stack

- **Runtime:** Node.js
- **Framework:** Express
- **ORM:** Sequelize
- **Banco:** PostgreSQL
- **Auth:** JWT (bcrypt + jsonwebtoken)
- **Docs:** Swagger (swagger-jsdoc + swagger-ui-express)
- **Upload:** Multer
- **Testes:** Jest + Supertest

## Estrutura

```
src/
├── config/          # Config DB e Swagger
├── controllers/     # Handlers das rotas
├── database/
│   ├── migrations/  # Migrations Sequelize
│   └── seeders/     # Dados iniciais
├── middlewares/     # auth, role, error handler, upload
├── models/          # Modelos Sequelize
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── validators/      # Validação com Joi
├── app.js           # Setup Express
└── server.js        # Entry point
tests/               # Testes automatizados
uploads/             # Capas de livros
```

## Requisitos

- Node.js 20+
- PostgreSQL rodando

## Setup

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env conforme necessário

# Rodar migrations e seeds
npm run migrate
npm run seed

# Iniciar dev
npm run dev
```

## Variáveis de Ambiente

| Variável       | Padrão                  | Descrição           |
| -------------- | ----------------------- | ------------------- |
| PORT           | 3000                    | Porta do servidor   |
| DB_HOST        | localhost               | Host do PostgreSQL  |
| DB_PORT        | 5432                    | Porta do PostgreSQL |
| DB_USER        | postgres                | Usuário do banco    |
| DB_PASS        | postgres                | Senha do banco      |
| DB_NAME        | biblioteca              | Nome do banco       |
| JWT_SECRET     | (gerar valor aleatório) | Chave secreta JWT   |
| JWT_EXPIRES_IN | 7d                      | Expiração do token  |

## Scripts

| Comando                 | Descrição                       |
| ----------------------- | ------------------------------- |
| `npm run dev`           | Inicia com nodemon              |
| `npm start`             | Inicia em produção              |
| `npm test`              | Roda testes com Jest            |
| `npm run migrate`       | Roda migrations                 |
| `npm run seed`          | Popula banco com dados iniciais |
| `npm run migrate:reset` | Reset completo do banco         |

## API Endpoints

### Autenticação

- `POST /auth/login` — Login
- `POST /auth/register` — Cadastro (admin)
- `POST /auth/forgot-password` — Recuperar senha
- `POST /auth/reset-password` — Redefinir senha

### Livros (público: GET; admin/librarian: POST/PUT/DELETE)

- `GET /books` — Listar (filtros: title, author, category, isbn, available)
- `GET /books/:id` — Detalhe
- `POST /books` — Criar
- `PUT /books/:id` — Atualizar
- `DELETE /books/:id` — Excluir
- `POST /books/:id/cover` — Upload de capa

### Leitores (admin/librarian)

- `GET /readers` — Listar
- `GET /readers/:id` — Detalhe + histórico
- `POST /readers` — Criar
- `PUT /readers/:id` — Atualizar
- `PATCH /readers/:id/inactivate` — Inativar

### Empréstimos (admin/librarian)

- `GET /loans` — Listar (filtros: status, start_date, end_date, user_id)
- `GET /loans/overdue` — Atrasados
- `GET /loans/my` — Próprios empréstimos (leitor)
- `POST /loans` — Registrar empréstimo
- `PUT /loans/:id/return` — Registrar devolução

### Dashboard (admin/librarian)

- `GET /dashboard/stats` — Estatísticas gerais
- `GET /dashboard/loans-by-month` — Empréstimos por mês
- `GET /dashboard/books-by-category` — Livros por categoria

### Notificações (autenticado)

- `GET /notifications` — Listar notificações
- `GET /notifications/count` — Contar não lidas
- `PATCH /notifications/:id/read` — Marcar como lida

### Usuários (admin)

- `GET /users` — Listar usuários do sistema
- `PUT /users/:id` — Atualizar
- `DELETE /users/:id` — Excluir

## Swagger

Acesse `http://localhost:3000/api-docs` após iniciar o servidor.

## Testes

```bash
# Rodar todos os testes
npm test
```

Os testes criam um banco separado (`biblioteca_test`) e limpam os dados entre execuções.

## Usuários Padrão (seed)

| Perfil        | E-mail                | Senha  |
| ------------- | --------------------- | ------ |
| Admin         | admin@biblioteca.com  | 123456 |
| Bibliotecário | biblio@biblioteca.com | 123456 |
| Leitor        | joao@email.com        | 123456 |
| Leitora       | maria@email.com       | 123456 |
