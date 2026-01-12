# Configuração Google OAuth - Autenticação Independente

Este guia mostra como configurar autenticação Google OAuth **100% independente** do Manus e do Cloudflare Access.

## Visão Geral

**Como funciona:**
1. Usuário clica em "Entrar com Google" no `/admin`
2. Redireciona para tela de login do Google
3. Após login, Google redireciona para `/api/auth/google/callback`
4. Backend verifica se o email está na lista de autorizados (`ADMIN_EMAILS`)
5. Se sim → cria cookie de sessão e redireciona para `/admin` autenticado
6. Se não → mostra mensagem de "Acesso Negado"

---

## Passo 1: Criar Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Clique em **Select a project** → **New Project**
3. Nome do projeto: `Gente Networking Admin`
4. Clique em **Create**

---

## Passo 2: Configurar OAuth Consent Screen

1. No menu lateral, vá em: **APIs & Services** → **OAuth consent screen**
2. Escolha **External** (se não tiver Google Workspace)
3. Clique em **Create**
4. Preencha:
   - **App name**: `Gente Networking Admin Dashboard`
   - **User support email**: Seu email
   - **Developer contact information**: Seu email
5. Clique em **Save and Continue**
6. Em **Scopes**, clique em **Add or Remove Scopes**
7. Adicione:
   - `openid`
   - `email`
   - `profile`
8. Clique em **Update** → **Save and Continue**
9. Em **Test users**, clique em **Add Users**
10. Adicione os emails que terão acesso ao dashboard (você e outros admins)
11. Clique em **Save and Continue** → **Back to Dashboard**

---

## Passo 3: Criar OAuth Client ID

1. No menu lateral, vá em: **APIs & Services** → **Credentials**
2. Clique em **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Gente Networking Web Client`
5. Em **Authorized redirect URIs**, clique em **Add URI** e adicione:
   ```
   https://lps.gentenetworking.com.br/api/auth/google/callback
   ```
6. Clique em **Create**
7. **IMPORTANTE:** Copie o **Client ID** e **Client Secret** que aparecem na tela

---

## Passo 4: Configurar Variáveis de Ambiente no Cloudflare Pages

**⚠️ IMPORTANTE**: Como o projeto usa `wrangler.toml`, você precisa marcar **"Encrypt"** em TODAS as variáveis para conseguir adicioná-las via dashboard.

1. Acesse: **Workers & Pages** → **gente-networking-lps** → **Settings** → **Environment variables**
2. Clique em **Add variable** e adicione as seguintes variáveis:

### Variável 1: GOOGLE_CLIENT_ID
- **Variable name**: `GOOGLE_CLIENT_ID`
- **Value**: Cole o **Client ID** copiado no Passo 3
- **Type**: ✅ **Marque "Encrypt"** (obrigatório para adicionar via dashboard)
- **Environment**: Marque **Production** e **Preview**

### Variável 2: GOOGLE_CLIENT_SECRET
- **Variable name**: `GOOGLE_CLIENT_SECRET`
- **Value**: Cole o **Client Secret** copiado no Passo 3
- **Type**: ✅ **Marque "Encrypt"** (obrigatório para adicionar via dashboard)
- **Environment**: Marque **Production** e **Preview**

### Variável 3: GOOGLE_REDIRECT_URI
- **Variable name**: `GOOGLE_REDIRECT_URI`
- **Value**: `https://lps.gentenetworking.com.br/api/auth/google/callback`
- **Type**: ✅ **Marque "Encrypt"** (obrigatório para adicionar via dashboard)
- **Environment**: Marque **Production** e **Preview**

### Variável 4: ADMIN_EMAILS
- **Variable name**: `ADMIN_EMAILS`
- **Value**: Lista de emails autorizados separados por vírgula (ex: `gentenetworking@gmail.com,ranktopseo@gmail.com,sou@especialistaseo.com.br`)
- **Type**: ✅ **Marque "Encrypt"** (obrigatório para adicionar via dashboard)
- **Environment**: Marque **Production** e **Preview**

3. Clique em **Save**

**💡 Por que marcar "Encrypt" em todas?**

Quando você usa `wrangler.toml`, o Cloudflare Pages só permite adicionar **secrets** (variáveis criptografadas) via dashboard. Variáveis normais precisariam ser adicionadas diretamente no arquivo `wrangler.toml` e commitadas no Git (o que não é seguro para credenciais). Marcar "Encrypt" transforma todas em secrets, permitindo gerenciá-las de forma segura via dashboard.

---

## Passo 5: Fazer Redeploy

1. Vá em: **Workers & Pages** → **gente-networking-lps** → **Deployments**
2. Clique nos **3 pontinhos** do último deployment → **Retry deployment**
3. Aguarde o deploy terminar (2-3 minutos)

---

## Passo 6: Testar Autenticação

1. Acesse: https://lps.gentenetworking.com.br/admin
2. Clique em **Entrar com Google**
3. Faça login com uma conta Google que esteja na lista `ADMIN_EMAILS`
4. Deve redirecionar de volta para `/admin` autenticado ✅

---

## Gerenciar Admins

**Para adicionar/remover admins:**
1. Vá em: **Workers & Pages** → **gente-networking-lps** → **Settings** → **Environment variables**
2. Clique em **Edit** na variável `ADMIN_EMAILS`
3. Adicione ou remova emails da lista (separados por vírgula)
4. Clique em **Save**
5. Faça um **Retry deployment** para aplicar as mudanças

---

## Troubleshooting

### Erro: "Google OAuth não configurado"
- Verifique se as variáveis `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `GOOGLE_REDIRECT_URI` estão configuradas corretamente no Cloudflare Pages

### Erro: "Acesso Negado"
- Verifique se o email que você usou para fazer login está na lista `ADMIN_EMAILS`
- Lembre-se de separar os emails por vírgula, sem espaços extras

### Erro: "redirect_uri_mismatch"
- Verifique se o `GOOGLE_REDIRECT_URI` no Cloudflare Pages é exatamente igual ao configurado no Google Cloud Console
- Certifique-se de que não há espaços ou barras extras no final da URL

### Sessão expira muito rápido
- A sessão dura 24 horas por padrão
- Para alterar, modifique o valor `86400` (segundos) no arquivo `functions/api/auth/google/callback.ts`

---

## Remover Cloudflare Access (Opcional)

Se você ainda tem o Cloudflare Access configurado e quer removê-lo completamente:

1. Acesse: **Zero Trust** → **Access** → **Applications**
2. Clique na aplicação **Gente Networking Admin Dashboard**
3. Clique em **Delete** → Confirme
4. Remova as variáveis `CF_ACCESS_TEAM_DOMAIN` e `CF_ACCESS_AUD` do Cloudflare Pages (se existirem)

---

## Segurança

✅ **Autenticação via Google OAuth 2.0** (padrão da indústria)
✅ **Lista de emails autorizados** (controle total de quem tem acesso)
✅ **Cookie HttpOnly + Secure** (protege contra XSS)
✅ **Assinatura criptográfica** (previne adulteração de sessão)
✅ **Expiração automática** (sessões expiram em 24h)

---

## Suporte

Se tiver problemas, verifique:
1. Todas as variáveis de ambiente estão configuradas?
2. O deploy foi feito após configurar as variáveis?
3. O email que você está usando está na lista `ADMIN_EMAILS`?
4. O redirect URI no Google Cloud Console está correto?
