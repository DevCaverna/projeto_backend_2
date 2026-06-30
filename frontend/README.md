# Biblioteca Frontend

Interface React para o Sistema de Gerenciamento de Biblioteca.

## Stack

- **Framework:** React 19
- **Build:** Vite
- **Router:** React Router DOM
- **HTTP:** Axios
- **Gráficos:** Recharts
- **Notificações:** React Hot Toast
- **Ícones:** React Icons (Feather)

## Estrutura

```
src/
├── components/     # Componentes reutilizáveis (Header, Layout, Pagination)
├── contexts/       # Contextos (Auth, Notification)
├── pages/          # Páginas da aplicação
├── services/       # API client (axios)
├── App.jsx         # Rotas e providers
├── main.jsx        # Entry point
└── styles.css      # Estilos globais
```

## Requisitos

- Node.js 20+
- Backend rodando em `http://localhost:3000`

## Setup

```bash
# Instalar dependências
npm install

# Iniciar dev
npm run dev
```

O frontend será servido em `http://localhost:5173`.

## Build

```bash
npm run build
```

O build será gerado em `dist/`.

## Funcionalidades

### Autenticação

- Login com JWT
- Rotas protegidas por perfil (admin, bibliotecário, leitor)
- Recuperação de senha

### Livros

- Lista com busca e filtros (título, autor, categoria, disponibilidade)
- Cadastro/edição/exclusão
- Upload de capa
- Paginação

### Leitores

- Lista com busca por nome
- Cadastro/edição
- Inativação
- Histórico de empréstimos

### Empréstimos

- Registro de empréstimo (seleciona leitor + livro)
- Devolução
- Filtro por status
- Visualização de atrasados
- Leitor vê apenas seus próprios empréstimos

### Dashboard

- Cards com totais (livros, leitores, empréstimos, atrasados)
- Gráfico de empréstimos por mês
- Gráfico de livros por categoria
- Livros mais emprestados

### Notificações

- Sino no header com badge de não lidas
- Dropdown com notificações em tempo real
- Tipos: empréstimo, devolução, atraso

### Administração

- Gerenciamento de usuários do sistema (admin)
- Edição de permissões e status
