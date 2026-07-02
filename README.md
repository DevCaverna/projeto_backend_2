# Sistema de Gerenciamento de Biblioteca

Aplicação web completa para gerenciamento de biblioteca, com API REST em Node.js/Express + PostgreSQL e frontend React.

> Projeto acadêmico — Disciplina de Programação Web (Backend)

## Stack

| Camada       | Tecnologia                    |
| ------------ | ----------------------------- |
| Backend      | Node.js + Express + Sequelize |
| Banco        | PostgreSQL                    |
| Autenticação | JWT (bcrypt + jsonwebtoken)   |
| Documentação | Swagger                       |
| Frontend     | React 19 + Vite               |
| Gráficos     | Recharts                      |
| Container    | Docker + Docker Compose       |

## Estrutura

```
├── backend/          → API REST
│   ├── src/          → Código fonte
│   ├── tests/        → Testes automatizados
│   └── uploads/      → Imagens de capa
├── frontend/         → Interface React
│   └── src/          → Código fonte
└── docker-compose.yml
```

## Funcionalidades

- **3 perfis de usuário:** Administrador, Bibliotecário, Leitor
- **CRUD completo** de livros, leitores e empréstimos
- **Empréstimos com um ou mais livros** via tabela intermediária `loan_books`
- **Autenticação JWT** com proteção de rotas por perfil
- **Busca e filtros** avançados
- **Dashboard** com gráficos e estatísticas
- **Sistema de notificações** in-app (sino + dropdown)
- **Upload de capas** de livros
- **Paginação** em todas as listagens
- **Recuperação de senha**
- **Documentação Swagger** em `/api-docs`
- **Testes automatizados** (Jest + Supertest)
- **Docker** para ambiente completo

## Observações Acadêmicas

- Leitores são armazenados na tabela `users` com `role = reader`, mantendo os campos pedidos para leitor (`cpf`, `phone`, `address`, `status`).
- A associação de empréstimos com livros é feita pela tabela `loan_books`, permitindo múltiplos livros por empréstimo. O campo legado `loans.book_id` permanece para compatibilidade com telas e listagens simples.
- Os endpoints principais esperados pela orientação estão disponíveis, incluindo `/auth/me`, `/users`, `/loans/:id` e `/loans/my-loans`.

## Requisitos

- Node.js 20+
- Docker + Docker Compose (opcional)
- PostgreSQL 17

## Como Rodar

### Com Docker (recomendado)

```bash
docker compose up -d
```

Acesse:

- Frontend: http://localhost
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api-docs

### Manual

```bash
# Backend
cd backend
cp .env.example .env   # edite se necessário
npm install
npm run migrate
npm run seed
npm run dev

# Frontend (outro terminal)
cd frontend
npm install
npm run dev
```

### Usuários Padrão

| Perfil        | E-mail                | Senha  |
| ------------- | --------------------- | ------ |
| Admin         | admin@biblioteca.com  | 123456 |
| Bibliotecário | biblio@biblioteca.com | 123456 |
| Leitor        | joao@email.com        | 123456 |
| Leitora       | maria@email.com       | 123456 |

## Testes

```bash
cd backend
npm test
```

## Documentação da API

Com o backend rodando, acesse `http://localhost:3000/api-docs`.

## Bônus Implementados

- Dashboard com gráficos (Recharts)
- Upload de capa dos livros (Multer)
- Paginação nas consultas
- Recuperação de senha
- Notificação de atraso (in-app)
- Dockerização do projeto
- Testes automatizados (Jest + Supertest)
