# Migração para Cloudflare Workers Functions

## 🎯 Objetivo

Migrar o backend Express/tRPC para **Cloudflare Workers Functions** para que tudo rode 100% no Cloudflare Pages, sem dependências externas.

## ⚠️ Problema Identificado

O Cloudflare Pages **NÃO executa código Express/Node.js** automaticamente. O log de build mostra:

```
Note: No functions dir at /functions found. Skipping.
```

Isso significa que:
- ✅ Frontend (React) está sendo deployado corretamente
- ❌ Backend (Express/tRPC) **NÃO está rodando**
- ❌ Por isso a autenticação nunca funciona

## 🔧 Solução Implementada

### 1. Estrutura de Arquivos Criada

```
functions/
└── api/
    └── trpc/
        ├── [[path]].ts          # Handler principal do tRPC
        └── context.ts           # Context com autenticação Cloudflare Access
```

### 2. Novos Arquivos Criados

- **`functions/api/trpc/[[path]].ts`**: Handler do tRPC usando `fetchRequestHandler` do tRPC
- **`server/_core/context-workers.ts`**: Context adaptado para Cloudflare Workers (sem Express)
- **`server/routers-workers.ts`**: Routers adaptados para usar D1 diretamente
- **`server/db-d1.ts`**: Funções de banco usando SQL direto (sem Drizzle ORM)
- **`wrangler.toml`**: Configuração de bindings D1 e R2

### 3. Configuração do wrangler.toml

```toml
name = "gente-networking-lps"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"

# D1 Database binding
[[d1_databases]]
binding = "DB"
database_name = "gente-networking-db"
database_id = "YOUR_D1_DATABASE_ID"  # ⚠️ SUBSTITUIR

# R2 Bucket binding
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "gente-networking-assets"

# Environment variables
[vars]
CF_ACCESS_TEAM_DOMAIN = "gentenetworking.cloudflareaccess.com"
```

## 📋 Próximos Passos

### 1. Obter ID do Banco D1

```bash
# Listar bancos D1
wrangler d1 list

# Copiar o database_id e atualizar wrangler.toml
```

### 2. Configurar Secret do Cloudflare Access

```bash
# Adicionar CF_ACCESS_AUD como secret
wrangler secret put CF_ACCESS_AUD
# Cole o valor do Application Audience UID do Cloudflare Access
```

### 3. Testar Localmente

```bash
# Instalar Wrangler globalmente (se necessário)
npm install -g wrangler

# Fazer build do projeto
pnpm build

# Testar localmente com Wrangler
wrangler pages dev dist --binding DB=gente-networking-db --binding BUCKET=gente-networking-assets
```

### 4. Deploy no Cloudflare Pages

```bash
# Commit e push para GitHub
git add .
git commit -m "feat: Migração para Cloudflare Workers Functions"
git push origin main

# O Cloudflare Pages vai detectar automaticamente o /functions
```

## 🔍 Como Funciona

### Cloudflare Workers Functions

O Cloudflare Pages detecta automaticamente arquivos em `/functions` e os executa como **Cloudflare Workers**.

- **`[[path]].ts`**: Sintaxe especial que captura todas as rotas sob `/api/trpc/*`
- **`onRequest`**: Função exportada que é chamada para cada requisição
- **Bindings**: D1 e R2 são injetados automaticamente via `context.env`

### Fluxo de Autenticação

1. Usuário acessa `/admin`
2. Cloudflare Access intercepta e exige login (Google OAuth)
3. Após login, Cloudflare Access adiciona header `Cf-Access-Jwt-Assertion`
4. Worker valida JWT usando JWKS do Cloudflare
5. Busca ou cria usuário no D1
6. tRPC procedures têm acesso ao `ctx.user`

## 📊 Diferenças vs Express

| Express (Antigo) | Cloudflare Workers (Novo) |
|------------------|---------------------------|
| `req`, `res` | `Request`, `Response` (Fetch API) |
| Drizzle ORM | SQL direto no D1 |
| `mysql2` | D1 Database |
| S3 (AWS) | R2 (Cloudflare) |
| Express middleware | Cloudflare Workers bindings |
| `process.env` | `context.env` |

## ⚙️ Variáveis de Ambiente Necessárias

### No Cloudflare Pages Dashboard

1. Acessar: **Settings → Environment variables**
2. Adicionar:
   - `CF_ACCESS_TEAM_DOMAIN` = `gentenetworking.cloudflareaccess.com`
   - `CF_ACCESS_AUD` = `<Application Audience UID do Cloudflare Access>`

### Bindings (Configurados no wrangler.toml)

- `DB`: D1 Database
- `BUCKET`: R2 Bucket

## 🧪 Testando

### 1. Verificar se Functions estão sendo deployadas

No log de build do Cloudflare Pages, você deve ver:

```
✨ Compiled Worker successfully
```

Ao invés de:

```
Note: No functions dir at /functions found. Skipping.
```

### 2. Testar Autenticação

1. Acessar `https://lps.gentenetworking.com.br/admin`
2. Fazer login via Google OAuth
3. Dashboard deve carregar sem erros
4. Verificar console do navegador (não deve ter erros de "Invalid URL")

## 📚 Recursos

- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [tRPC Fetch Adapter](https://trpc.io/docs/server/adapters/fetch)
- [Cloudflare Access JWT Validation](https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/)

## ✅ Checklist de Migração

- [x] Criar estrutura `/functions`
- [x] Implementar handler tRPC com `fetchRequestHandler`
- [x] Adaptar context para Cloudflare Workers
- [x] Criar funções de banco D1 (sem Drizzle)
- [x] Configurar wrangler.toml
- [ ] Obter database_id do D1
- [ ] Configurar CF_ACCESS_AUD secret
- [ ] Testar localmente com Wrangler
- [ ] Deploy e validar no Cloudflare Pages
- [ ] Testar autenticação end-to-end
- [ ] Validar todas as funcionalidades do dashboard
