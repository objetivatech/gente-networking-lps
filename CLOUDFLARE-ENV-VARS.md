# Variáveis de Ambiente Necessárias no Cloudflare Pages

## ⚠️ CRÍTICO - Variáveis Obrigatórias

Para que o site funcione corretamente no Cloudflare Pages, você **DEVE** configurar as seguintes variáveis de ambiente no painel do Cloudflare:

### Variáveis de Build (Build-time)

Estas variáveis são injetadas durante o build do Vite e são necessárias para o código client-side funcionar:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_OAUTH_PORTAL_URL` | URL do portal OAuth do Manus | `https://api.manus.im` |
| `VITE_APP_ID` | ID da aplicação OAuth | Fornecido pelo Manus |
| `VITE_ANALYTICS_ENDPOINT` | Endpoint do Umami Analytics (opcional) | `https://analytics.example.com` |
| `VITE_ANALYTICS_WEBSITE_ID` | ID do site no Umami (opcional) | `uuid-do-site` |

### Variáveis de Runtime (Server-side)

Estas variáveis são usadas pelo servidor Node.js e devem ser configuradas como variáveis de ambiente do Cloudflare Pages:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | Connection string do banco de dados D1/MySQL | Fornecido pelo Cloudflare D1 |
| `JWT_SECRET` | Secret para assinar tokens JWT | String aleatória segura |
| `OAUTH_SERVER_URL` | URL do servidor OAuth | `https://api.manus.im` |
| `OWNER_OPEN_ID` | Open ID do proprietário | Fornecido pelo Manus |
| `OWNER_NAME` | Nome do proprietário | Seu nome |

### Variáveis Opcionais (para funcionalidades avançadas)

| Variável | Descrição | Quando usar |
|----------|-----------|-------------|
| `GMAIL_USER` | Email do Gmail para envio de notificações | Se quiser notificações por email |
| `GMAIL_APP_PASSWORD` | App Password do Gmail | Se quiser notificações por email |
| `BUILT_IN_FORGE_API_URL` | URL das APIs internas do Manus | Se quiser usar storage S3, LLM, etc |
| `BUILT_IN_FORGE_API_KEY` | Chave de API do Manus | Se quiser usar storage S3, LLM, etc |

## 📋 Como Configurar no Cloudflare Pages

1. Acesse o dashboard do Cloudflare Pages
2. Selecione seu projeto `gente-networking-lps`
3. Vá em **Settings** → **Environment variables**
4. Adicione cada variável listada acima
5. **IMPORTANTE**: Marque as variáveis `VITE_*` como **Production** e **Preview** para que sejam injetadas durante o build
6. Faça um novo deploy após configurar as variáveis

## 🔍 Como Verificar se as Variáveis Estão Configuradas

Após configurar e fazer deploy, acesse:
- `https://lps.gentenetworking.com.br/admin`

Se as variáveis estiverem corretas, o site deve carregar normalmente. Se ainda houver erro, verifique os logs do Cloudflare Pages para identificar qual variável está faltando.

## ⚡ Diferença entre Variáveis de Build e Runtime

- **Build-time (`VITE_*`)**: São injetadas no código JavaScript durante o build do Vite. O valor fica "hardcoded" no bundle final.
- **Runtime**: São lidas pelo servidor Node.js em tempo de execução. Podem ser alteradas sem rebuild.

Por isso, se você alterar uma variável `VITE_*`, precisa fazer um novo deploy (rebuild) para que a mudança tenha efeito.
