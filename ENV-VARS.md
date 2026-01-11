# Variáveis de Ambiente - Cloudflare Pages

Este documento lista **todas** as variáveis de ambiente necessárias para o projeto funcionar no Cloudflare Pages.

## ⚡ Variáveis Obrigatórias

Apenas **2 variáveis** são necessárias para autenticação:

| Variável | Descrição | Como Obter | Exemplo |
|----------|-----------|------------|---------|
| `CF_ACCESS_TEAM_DOMAIN` | Seu team domain do Cloudflare Access | Criado ao configurar Cloudflare Zero Trust | `https://gente-networking.cloudflareaccess.com` |
| `CF_ACCESS_AUD` | Application Audience tag | Copiado do dashboard do Cloudflare Access após criar a aplicação | `4714c1358e65fe4b408ad6d432a5f878f08194bdb4752441fd56faefa9b2b6f2` |

### Como Configurar

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Vá em **Workers & Pages** → Selecione seu projeto
3. Clique em **Settings** → **Environment variables**
4. Adicione as 2 variáveis acima
5. **Importante**: Adicione em **Production** E **Preview** environments
6. Faça um novo deploy

### Guia Completo

Para instruções passo-a-passo de como criar a conta Cloudflare Zero Trust, configurar a aplicação e obter esses valores, consulte:

📖 **[CLOUDFLARE-ACCESS-SETUP.md](./CLOUDFLARE-ACCESS-SETUP.md)**

## 🗄️ Banco de Dados

O Cloudflare D1 é configurado automaticamente pelo Cloudflare Pages. Não é necessário configurar `DATABASE_URL` manualmente.

## 📧 Notificações por Email (Opcional)

Se você quiser receber notificações por email quando novos leads se inscreverem:

| Variável | Descrição | Como Obter |
|----------|-----------|------------|
| `GMAIL_USER` | Seu email Gmail | Seu email do Gmail |
| `GMAIL_APP_PASSWORD` | Senha de app do Gmail | [Gerar senha de app](https://myaccount.google.com/apppasswords) |

**Nota**: Se não configurar essas variáveis, o sistema funcionará normalmente, apenas não enviará notificações por email.

## ❌ Variáveis Removidas

As seguintes variáveis **NÃO são mais necessárias** (eram do sistema OAuth do Manus):

- ~~`VITE_OAUTH_PORTAL_URL`~~ - Removido
- ~~`VITE_APP_ID`~~ - Removido
- ~~`OAUTH_SERVER_URL`~~ - Removido
- ~~`JWT_SECRET`~~ - Removido
- ~~`OWNER_OPEN_ID`~~ - Removido
- ~~`OWNER_NAME`~~ - Removido

## 🎯 Resumo

Para fazer o site funcionar em produção, você precisa:

1. **Configurar Cloudflare Access** (seguindo [CLOUDFLARE-ACCESS-SETUP.md](./CLOUDFLARE-ACCESS-SETUP.md))
2. **Adicionar 2 variáveis** no Cloudflare Pages:
   - `CF_ACCESS_TEAM_DOMAIN`
   - `CF_ACCESS_AUD`
3. **Fazer deploy**

Pronto! O dashboard `/admin` estará protegido e funcionando. 🚀
