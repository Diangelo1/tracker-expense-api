# 💰 Expense Tracker — Frontend

Aplicação React para controle de despesas, integrada à API RESTful.

## 🚀 Tecnologias

- **React 18** + Hooks
- **React Router DOM v6** — navegação SPA
- **Axios** — requisições HTTP com interceptors JWT
- **Context API** — estado global (autenticação + tema)
- **Recharts** — gráficos de pizza e barras
- **React Hot Toast** — feedback visual
- CSS customizado com design system (dark/light mode)

## 📁 Estrutura

```
src/
├── components/
│   ├── common/       # Modal, Spinner, ConfirmDialog, Pagination, StatusBadge
│   └── layout/       # Sidebar, Topbar
├── contexts/
│   ├── AuthContext   # Login, logout, persistência de sessão
│   └── ThemeContext  # Dark / Light mode
├── hooks/
│   └── index.js      # useFetch, useDebounce, usePagination
├── pages/
│   ├── Auth/         # LoginPage (login + cadastro)
│   ├── Dashboard/    # Stats, gráficos, últimas despesas
│   ├── Categories/   # CRUD completo
│   └── Expenses/     # CRUD + filtros avançados
├── routes/
│   └── AppRoutes     # Rotas protegidas
├── services/
│   ├── api.js        # Axios instance + interceptors
│   ├── authService
│   ├── categoriesService
│   ├── expensesService
│   └── dashboardService
└── styles/
    └── global.css    # Design tokens + componentes base
```

## ⚙️ Configuração

### Pré-requisitos
- Node.js 16+
- Backend rodando em `http://localhost:3000`

### Instalação

```bash
npm install
npm start
```

O app abre em `http://localhost:3001` (ou próxima porta disponível).

### CORS (Backend)

Certifique-se que o backend permite requisições de `http://localhost:3001`.
Se usar Express + CORS:

```js
app.use(cors({ origin: 'http://localhost:3001' }));
```

## ✨ Funcionalidades

| Funcionalidade | Status |
|---|---|
| Login / Cadastro | ✅ |
| Persistência de sessão (JWT) | ✅ |
| Logout | ✅ |
| Dashboard com estatísticas | ✅ |
| Gráficos (pizza + barras) | ✅ |
| CRUD de Categorias | ✅ |
| CRUD de Despesas | ✅ |
| Filtros (categoria, status, data, valor) | ✅ |
| Paginação | ✅ |
| Dark Mode / Light Mode | ✅ |
| Loading states | ✅ |
| Tratamento de erros | ✅ |
| Formulários validados | ✅ |
| Interface responsiva | ✅ |

## 🔗 APIs consumidas

```
POST /users              # Cadastro
POST /auth/login         # Login → retorna JWT

GET/POST /categories
GET/PUT/DELETE /categories/:id

GET/POST /expenses
GET/PUT/DELETE /expenses/:id

GET /dashboard/total-expenses
GET /dashboard/expenses-count
GET /dashboard/expenses-by-category
```
