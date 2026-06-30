# Expense Tracker API

API RESTful para controle de despesas pessoais, construída com Node.js, Express, Sequelize e MySQL, seguindo o padrão MVC.

## Tecnologias

- Node.js + Express
- Sequelize + MySQL (mysql2)
- JWT (jsonwebtoken) para autenticação
- bcrypt para hash de senha
- dotenv para variáveis de ambiente
- express-validator para validação de entrada
- swagger-ui-express para documentação interativa

## Arquitetura

```text
src/
 ├── controllers/   # regras de aplicação (recebem req, chamam models, devolvem via views)
 ├── views/         # formatadores de resposta JSON (ex: nunca expor a senha do usuário)
 ├── models/        # entidades Sequelize + associações
 ├── routes/        # definição das rotas e validações de entrada
 ├── middlewares/    # autenticação JWT, validação e tratamento global de erros
 ├── config/        # configuração do Sequelize (app e CLI)
 ├── database/
 │    ├── migrations/  # versionamento do schema do banco
 │    └── seeders/      # dados de exemplo
 ├── utils/         # helpers (JWT, AppError, filtros de despesas)
 ├── app.js         # configuração do Express
 └── server.js      # ponto de entrada / conexão com o banco
```

> Como esta é uma API (sem HTML renderizado), a camada `views/` tem a função de formatar e "limpar" os dados antes de devolvê-los (por exemplo, removendo a senha do usuário da resposta), em vez de gerar páginas.

## Pré-requisitos

- Node.js 18+
- MySQL 8+ rodando localmente (ou acessível pela rede)

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Copie o arquivo de ambiente e ajuste as credenciais do seu MySQL:
   ```bash
   cp .env.example .env
   ```

3. Crie o banco de dados (se ainda não existir):
   ```bash
   npm run db:create
   ```

4. Rode as migrations para criar as tabelas:
   ```bash
   npm run migrate
   ```

5. (Opcional) Popule o banco com dados de exemplo:
   ```bash
   npm run seed
   ```
   Usuários de teste criados pelo seeder: `maria@example.com` e `joao@example.com`, ambos com senha `123456`.

6. Inicie a aplicação:
   ```bash
   npm run dev    # com reload automático (nodemon)
   # ou
   npm start
   ```

A API sobe em `http://localhost:3000` (porta configurável via `.env`).
Documentação Swagger disponível em `http://localhost:3000/api-docs`.

Caso prefira criar o schema manualmente em vez de rodar as migrations, há um script equivalente em `sql/schema.sql`.

## Autenticação

Todas as rotas, exceto `POST /users` e `POST /auth/login`, exigem o header:

```
Authorization: Bearer <token>
```

O token é obtido no login e expira conforme `JWT_EXPIRES_IN` (padrão: 1 dia).

## Rotas

### Auth

| Método | Rota          | Descrição                  |
|--------|---------------|-----------------------------|
| POST   | /users        | Cadastra um novo usuário    |
| POST   | /auth/login   | Autentica e retorna o token |

### Categorias (autenticado)

| Método | Rota             | Descrição            |
|--------|------------------|------------------------|
| GET    | /categories      | Lista categorias       |
| GET    | /categories/:id  | Detalha uma categoria  |
| POST   | /categories      | Cria uma categoria     |
| PUT    | /categories/:id  | Atualiza uma categoria |
| DELETE | /categories/:id  | Remove uma categoria   |

### Despesas (autenticado, escopadas ao usuário logado)

| Método | Rota            | Descrição           |
|--------|-----------------|------------------------|
| GET    | /expenses       | Lista despesas (com filtros) |
| GET    | /expenses/:id   | Detalha uma despesa    |
| POST   | /expenses       | Cria uma despesa       |
| PUT    | /expenses/:id   | Atualiza uma despesa   |
| DELETE | /expenses/:id   | Remove uma despesa     |

#### Filtros disponíveis em `GET /expenses`

```
GET /expenses?status=PAGA&categoria=1
GET /expenses?dataInicio=2026-01-01&dataFim=2026-06-30
GET /expenses?valorMin=50&valorMax=500
```

Os mesmos filtros (`status`, `categoria`, `dataInicio`, `dataFim`, `valorMin`, `valorMax`) também podem ser usados nos endpoints do dashboard, para obter estatísticas filtradas.

### Dashboard (autenticado)

| Método | Rota                              | Resposta                                              |
|--------|-----------------------------------|--------------------------------------------------------|
| GET    | /dashboard/total-expenses         | `{ "total": 3500.50 }`                                  |
| GET    | /dashboard/expenses-count         | `{ "quantidade": 45 }`                                   |
| GET    | /dashboard/expenses-by-category   | `[{ "categoria": "Alimentação", "total": 1200 }, ...]`   |

## Validações implementadas

- **Sequelize (model):** campos obrigatórios, formato de email, tamanho mínimo/máximo de strings, valor monetário positivo, enum de status, unicidade de email e nome de categoria.
- **express-validator (rota):** validação do corpo da requisição antes mesmo de chegar ao banco, com mensagens de erro em português.
- **Regras de negócio:** impede excluir categoria com despesas vinculadas; impede criar despesa com categoria inexistente; despesas e seu acesso são sempre restritos ao usuário autenticado (via `usuarioId` extraído do token).

## Tratamento de erros

Há um middleware global (`src/middlewares/errorMiddleware.js`) que centraliza o tratamento de:
- erros de validação do Sequelize;
- violação de chave única ou de chave estrangeira;
- erros de JWT (token inválido/expirado);
- erros de negócio (`AppError`, com status code customizado);
- erros inesperados (HTTP 500).

## Collection do Postman

Importe o arquivo `postman/ExpenseTrackerAPI.postman_collection.json` no Postman. A requisição de **Login** salva automaticamente o token JWT na variável de coleção `token`, que é reaproveitada nas demais requisições.

## Scripts úteis

| Comando                  | Descrição                                       |
|---------------------------|--------------------------------------------------|
| `npm run dev`             | Inicia em modo desenvolvimento (nodemon)          |
| `npm start`               | Inicia em modo produção                           |
| `npm run migrate`         | Executa as migrations pendentes                   |
| `npm run migrate:undo`    | Desfaz a última migration                         |
| `npm run seed`            | Executa os seeders                                |
| `npm run seed:undo`       | Desfaz os seeders                                 |
| `npm run db:reset`        | Desfaz tudo, recria as migrations e os seeders    |

## Licença

MIT
