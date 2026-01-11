# 🚀 Configuração Pós-Deploy - Cloudflare Workers

## ⚠️ ATENÇÃO: Passos Obrigatórios Após Deploy

Após o deploy no Cloudflare Pages, você **DEVE** configurar os bindings D1 e R2 no dashboard do Cloudflare.

---

## 📋 Passo 1: Configurar D1 Database Binding

### 1.1 Obter o Database ID

1. Acesse: https://dash.cloudflare.com
2. Vá em **Workers & Pages** → **D1 SQL Database**
3. Clique no banco `gente-networking-db`
4. Copie o **Database ID** (algo como: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### 1.2 Adicionar Binding no Cloudflare Pages

1. Acesse: **Workers & Pages** → **gente-networking-lps** (seu projeto)
2. Vá em **Settings** → **Functions**
3. Role até **D1 database bindings**
4. Clique em **Add binding**
5. Preencha:
   - **Variable name**: `DB`
   - **D1 database**: Selecione `gente-networking-db`
6. Clique em **Save**

---

## 📋 Passo 2: Configurar R2 Bucket Binding

### 2.1 Verificar se o Bucket Existe

1. Acesse: **R2** → **Overview**
2. Verifique se existe o bucket `gente-networking-assets`
3. Se não existir, clique em **Create bucket** e crie com esse nome

### 2.2 Adicionar Binding no Cloudflare Pages

1. Acesse: **Workers & Pages** → **gente-networking-lps**
2. Vá em **Settings** → **Functions**
3. Role até **R2 bucket bindings**
4. Clique em **Add binding**
5. Preencha:
   - **Variable name**: `BUCKET`
   - **R2 bucket**: Selecione `gente-networking-assets`
6. Clique em **Save**

---

## 📋 Passo 3: Configurar Variáveis de Ambiente

### 3.1 Adicionar CF_ACCESS_AUD (Secret)

1. Acesse: **Workers & Pages** → **gente-networking-lps**
2. Vá em **Settings** → **Environment variables**
3. Clique em **Add variables**
4. Preencha:
   - **Variable name**: `CF_ACCESS_AUD`
   - **Value**: `<Application Audience UID do Cloudflare Access>`
   - **Type**: Marque **Encrypt** (secret)
   - **Environment**: Selecione **Production** e **Preview**
5. Clique em **Save**

**Como obter o CF_ACCESS_AUD:**
1. Acesse: **Zero Trust** → **Access** → **Applications**
2. Clique na aplicação `Gente Networking Admin`
3. Copie o **Application Audience (AUD) Tag**

### 3.2 Adicionar CF_ACCESS_TEAM_DOMAIN

1. Ainda em **Environment variables**
2. Clique em **Add variables**
3. Preencha:
   - **Variable name**: `CF_ACCESS_TEAM_DOMAIN`
   - **Value**: `gentenetworking.cloudflareaccess.com`
   - **Environment**: Selecione **Production** e **Preview**
4. Clique em **Save**

---

## 📋 Passo 4: Fazer Redeploy

Após configurar os bindings e variáveis:

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** do último deploy
3. Clique em **Retry deployment**

Ou simplesmente faça um novo commit no GitHub:

```bash
git commit --allow-empty -m "trigger: Redeploy após configurar bindings"
git push origin main
```

---

## 🧪 Passo 5: Testar

1. Acesse: `https://lps.gentenetworking.com.br/admin`
2. Faça login via Google OAuth
3. O dashboard deve carregar sem erros
4. Verifique o console do navegador (F12)
5. Não deve haver erros de "Invalid URL" ou "Unauthorized"

---

## 🔍 Troubleshooting

### Erro: "DB is not defined"

**Causa**: Binding D1 não configurado

**Solução**: Volte ao Passo 1 e configure o binding `DB`

### Erro: "BUCKET is not defined"

**Causa**: Binding R2 não configurado

**Solução**: Volte ao Passo 2 e configure o binding `BUCKET`

### Erro: "Unauthorized" ao acessar /admin

**Causa**: CF_ACCESS_AUD não configurado ou incorreto

**Solução**: Volte ao Passo 3.1 e verifique o valor do CF_ACCESS_AUD

### Erro: "Invalid JWT"

**Causa**: CF_ACCESS_TEAM_DOMAIN incorreto

**Solução**: Volte ao Passo 3.2 e verifique o valor (deve ser `gentenetworking.cloudflareaccess.com`)

---

## 📊 Verificar Logs

Para ver logs em tempo real:

1. Acesse: **Workers & Pages** → **gente-networking-lps**
2. Vá em **Logs** → **Real-time Logs**
3. Clique em **Begin log stream**
4. Acesse o `/admin` no navegador
5. Veja os logs aparecerem em tempo real

---

## ✅ Checklist Final

- [ ] D1 Database binding configurado (`DB`)
- [ ] R2 Bucket binding configurado (`BUCKET`)
- [ ] Variável `CF_ACCESS_AUD` configurada (secret)
- [ ] Variável `CF_ACCESS_TEAM_DOMAIN` configurada
- [ ] Redeploy feito
- [ ] Teste de acesso ao `/admin` bem-sucedido
- [ ] Logs verificados (sem erros)

---

## 🎉 Pronto!

Agora seu backend está rodando 100% no Cloudflare Workers! 🚀
