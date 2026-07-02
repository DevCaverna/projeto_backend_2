# Plano do Projeto

## Estado Atual

- Backend Node.js/Express/Sequelize com PostgreSQL.
- Frontend React/Vite consumindo a API.
- Autenticação JWT e controle de acesso por perfil.
- CRUD de livros, leitores e usuários administrativos.
- Empréstimos e devoluções com transação no banco.
- Tabela `loan_books` para associar um empréstimo a um ou mais livros.
- Swagger configurado em `/api-docs` com os endpoints principais.
- Seeds com administrador, bibliotecário, leitores, livros e empréstimos.
- Recuperação de senha implementada com token salvo em `password_resets`; a API só expõe token/URL com `EXPOSE_PASSWORD_RESET_TOKEN=true` em ambiente `development` ou `test`.

## Próximas Verificações

- Instalar dependências quando necessário (`npm install` em `backend` e `frontend`).
- Rodar migrations e seeders em banco limpo.
- Executar testes automatizados do backend.
- Executar build do frontend.
- Testar manualmente os fluxos de login, recuperação de senha, cadastro, empréstimo, devolução e consulta de meus empréstimos.

## Pontos de Atenção

- Leitores são representados por registros de `users` com `role = reader`.
- O campo `loans.book_id` foi mantido para compatibilidade com telas simples, mas a associação completa fica em `loan_books`.
