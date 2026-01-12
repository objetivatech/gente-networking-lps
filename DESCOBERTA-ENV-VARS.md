# Descoberta Importante: Environment Variables no Cloudflare Pages

## Situação Atual

O usuário está tentando adicionar variáveis de ambiente no dashboard do Cloudflare Pages, mas recebe a mensagem:

> "As variáveis de ambiente para este projeto estão sendo gerenciadas por meio do wrangler.toml. Somente segredos (variáveis criptografadas) podem ser gerenciados através do Dashboard."

## O que a Documentação Diz

Segundo a documentação oficial do Cloudflare Pages:
https://developers.cloudflare.com/pages/functions/wrangler-configuration/#environment-variables

**Environment variables** são um tipo de binding que permite anexar strings de texto ou valores JSON à sua Pages Function.

- **Configure environment variables via Wrangler file** da mesma forma que são configuradas no Cloudflare Workers
- **Interaja com suas environment variables** normalmente no código

## Solução Confirmada

Existem **duas formas** de adicionar variáveis de ambiente quando se usa `wrangler.toml`:

### 1. Variáveis Não-Sensíveis (vars)
Adicionar diretamente no `wrangler.toml` na seção `[vars]`:

```toml
[vars]
GOOGLE_REDIRECT_URI = "https://lps.gentenetworking.com.br/api/auth/google/callback"
ADMIN_EMAILS = "email1@gmail.com,email2@gmail.com"
```

**Vantagem**: Simples, versionado no Git
**Desvantagem**: Valores ficam públicos no repositório

### 2. Secrets (Variáveis Criptografadas)
Para valores sensíveis como `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`:

**Opção A - Via Wrangler CLI** (requer acesso ao terminal):
```bash
npx wrangler pages secret put GOOGLE_CLIENT_ID
npx wrangler pages secret put GOOGLE_CLIENT_SECRET
```

**Opção B - Via Dashboard** (o que o usuário quer fazer):
- Dashboard do Cloudflare Pages → Settings → Environment variables
- Marcar a opção **"Encrypt"** ao adicionar a variável
- Isso transforma a variável em um "secret"

## Conclusão

O usuário **PODE** adicionar as variáveis via dashboard, mas **DEVE marcar a opção "Encrypt"** para todas elas, transformando-as em secrets. Isso é até mais seguro do que adicionar no `wrangler.toml`.

## Próximo Passo

Atualizar a documentação `GOOGLE-OAUTH-SETUP.md` para instruir o usuário a:
1. Adicionar todas as 4 variáveis via dashboard
2. **Marcar "Encrypt" em TODAS** (mesmo as não-sensíveis)
3. Isso resolve o problema de não conseguir adicionar variáveis não-criptografadas
