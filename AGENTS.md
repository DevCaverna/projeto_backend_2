# AGENTS.md

## Projeto

Sistema de Gerenciamento de Biblioteca — backend Node/Express/Sequelize + frontend React (Vite).  
Stack completa e plano em [`PLANO.md`](PLANO.md). Especificação do professor em [`projeto.md`](projeto.md).

## Estrutura

```
backend/       → API REST
frontend/      → React (Vite)
docker-compose.yml → PostgreSQL + backend + frontend
```

## Convenções

- Commits convencionais (pt ou en), mensagens curtas.
- Manter `AGENTS.md` e `PLANO.md` atualizados conforme o projeto evolui.
- TODO tracking neste arquivo para sessões futuras.

## Comandos principais

```bash
# Backend
cd backend && npm run dev      # nodemon
cd backend && npm test         # Jest + Supertest

# Frontend
cd frontend && npm run dev     # Vite dev server

# Infra
docker compose up -d           # Sobe PostgreSQL + serviços
```

## Tasks atuais

Ver `PLANO.md` para o plano de acompanhamento. Estado atual:

- Backend e frontend principais implementados.
- Endpoints esperados revisados: `/auth/me`, `/users`, `/readers`, `/loans/:id`, `/loans/my-loans`.
- Tabela intermediária `loan_books` adicionada para empréstimos com um ou mais livros.
- Próximo foco: rodar migrations/seeders/testes em ambiente com dependências instaladas e banco disponível.
