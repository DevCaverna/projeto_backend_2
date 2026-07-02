Você deve desenvolver um projeto acadêmico chamado “Sistema de Gerenciamento de Biblioteca”.

Importante:
- É um projeto acadêmico, então priorize clareza, organização, simplicidade e facilidade de explicação.
- O código deve ser limpo, comentado quando necessário e fácil de apresentar para professor.
- Evite soluções excessivamente complexas.
- O foco é cumprir todos os requisitos da rubrica.

Tecnologias obrigatórias:
Backend:
- Node.js
- Express
- Sequelize
- PostgreSQL ou MySQL
- JWT
- Swagger

Frontend:
- React
- Consumo completo da API

Objetivo:
Criar uma aplicação web completa para gerenciamento de biblioteca, com autenticação, controle de acesso por perfil, CRUDs, empréstimos, devoluções, documentação Swagger e frontend funcional.

Perfis de usuário:
1. Administrador
- Acesso total.
- Pode cadastrar, editar e excluir usuários.
- Pode definir tipo de usuário: administrador, bibliotecário ou leitor.
- Pode gerenciar livros, leitores, empréstimos, devoluções e relatórios.

2. Bibliotecário
- Pode cadastrar, editar, listar e buscar livros.
- Pode cadastrar, editar, listar e buscar leitores.
- Pode registrar empréstimos e devoluções.
- Pode consultar histórico e livros atrasados.
- Não pode alterar permissões nem excluir administradores.

3. Leitor/Aluno
- Pode fazer login.
- Pode visualizar e buscar livros disponíveis.
- Pode consultar somente seus próprios empréstimos e histórico.
- Não pode cadastrar, editar ou excluir dados.

Entidades principais:

Usuário:
- id
- nome
- email
- senha_hash
- role: ADMIN, LIBRARIAN, READER
- status
- createdAt
- updatedAt

Livro:
- id
- titulo
- autor
- editora
- anoPublicacao
- categoria
- isbn
- quantidadeTotal
- quantidadeDisponivel
- status: DISPONIVEL ou INDISPONIVEL

Leitor:
- id
- nome
- cpfOuRa
- email
- telefone
- endereco
- status: ATIVO ou INATIVO

Emprestimo:
- id
- leitorId
- dataEmprestimo
- dataPrevistaDevolucao
- dataRealDevolucao
- status: EM_ABERTO, DEVOLVIDO ou ATRASADO

Como o projeto pede associar empréstimo a um ou mais livros, criar uma tabela intermediária:

EmprestimoLivro:
- id
- emprestimoId
- livroId
- quantidade

Regras de negócio obrigatórias:
- Um livro só pode ser emprestado se houver quantidade disponível.
- Ao realizar empréstimo, diminuir a quantidade disponível do livro.
- Ao registrar devolução, aumentar a quantidade disponível.
- Leitor inativo não pode realizar empréstimo.
- O sistema deve identificar empréstimos atrasados.
- Leitor só pode visualizar seus próprios empréstimos.
- Rotas administrativas devem exigir JWT.
- Cada perfil deve acessar apenas o que tem permissão.

Endpoints esperados:

Auth:
- POST /auth/register
- POST /auth/login
- GET /auth/me

Usuários:
- GET /users
- POST /users
- PUT /users/:id
- DELETE /users/:id

Livros:
- GET /books
- GET /books/:id
- POST /books
- PUT /books/:id
- DELETE /books/:id
- filtros por título, autor, categoria, ISBN e disponibilidade

Leitores:
- GET /readers
- GET /readers/:id
- POST /readers
- PUT /readers/:id
- DELETE /readers/:id
- filtros por nome, CPF ou RA

Empréstimos:
- GET /loans
- GET /loans/:id
- POST /loans
- PUT /loans/:id/return
- filtros por status, data e leitor
- GET /loans/my-loans para leitor consultar apenas seus próprios empréstimos

Swagger:
- Configurar documentação em /api-docs
- Documentar auth, livros, leitores e empréstimos
- Incluir parâmetros, body das requisições e respostas esperadas

Frontend React:
Criar telas simples e funcionais:
- Login
- Dashboard inicial
- Listagem de livros
- Cadastro/edição de livros
- Listagem de leitores
- Cadastro/edição de leitores
- Registro de empréstimo
- Registro de devolução
- Meus empréstimos para leitor
- Tela ou filtros para buscar livros, leitores e empréstimos

Requisitos importantes para apresentação:
- Criar seeds com pelo menos:
  - 1 administrador
  - 1 bibliotecário
  - 2 leitores
  - alguns livros cadastrados
  - alguns empréstimos de exemplo

Critérios de avaliação que devem ser priorizados:
- Modelagem correta do banco
- CRUD completo de livros
- CRUD completo de leitores
- Empréstimos e devoluções funcionando
- Regras de negócio
- JWT e controle de acesso
- Swagger funcionando
- Frontend React consumindo a API
- Busca e filtros

Extras opcionais, somente se der tempo:
- Paginação
- Dashboard com gráficos
- Dockerização
- Testes automatizados
- Upload de capa dos livros

Peço que você analise a estrutura atual do projeto, se existir, e implemente de forma incremental:
1. Backend com models, migrations, seeders e rotas.
2. Autenticação JWT e middlewares de permissão.
3. Regras de empréstimo e devolução com transação no banco.
4. Swagger.
5. Frontend React com telas funcionais.
6. README com instruções para rodar backend, frontend, migrations e seeders.

Não invente requisitos além do necessário. O objetivo é entregar um projeto acadêmico completo, funcional e fácil de demonstrar.