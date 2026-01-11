# Guia Completo: Configurar Cloudflare Access com Google OAuth

Este guia mostra como proteger o dashboard `/admin` usando **Cloudflare Access** com autenticação Google OAuth.

## 📋 Pré-requisitos

- Conta no Cloudflare (gratuita)
- Site já publicado no Cloudflare Pages
- Conta Google para fazer login

## 🎯 Visão Geral

O Cloudflare Access protege seu dashboard no nível do edge (antes do código executar), usando Google OAuth para autenticação. Você define quais emails Google podem acessar, e o Cloudflare gerencia todo o fluxo de login/logout automaticamente.

---

## Passo 1: Criar Conta Cloudflare Zero Trust

1. Acesse https://one.dash.cloudflare.com/
2. Se for sua primeira vez:
   - Clique em **"Get started"** ou **"Começar"**
   - Escolha um **team name** (ex: `gente-networking`)
   - Anote o team domain que será criado: `https://gente-networking.cloudflareaccess.com`
3. Se já tiver conta, vá para **Access** → **Applications**

---

## Passo 2: Configurar Google como Provedor de Identidade

Antes de criar a aplicação, você precisa adicionar Google como provedor de login:

### 2.1 Adicionar Google OAuth

1. No painel do Cloudflare Zero Trust, vá em:
   - **Settings** (Configurações) → **Authentication** (Autenticação)
   
2. Na seção **Login methods**, clique em **"Add new"** (Adicionar novo)

3. Selecione **Google**

4. **Opção Simplificada** (Recomendada):
   - Deixe os campos vazios
   - Clique em **"Save"** (Salvar)
   - O Cloudflare usará credenciais OAuth compartilhadas (funciona perfeitamente para a maioria dos casos)

5. **Opção Avançada** (Opcional - apenas se quiser usar suas próprias credenciais OAuth):
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um novo projeto ou selecione um existente
   - Vá em **APIs & Services** → **Credentials**
   - Clique em **"Create Credentials"** → **"OAuth 2.0 Client ID"**
   - Configure:
     - Application type: **Web application**
     - Authorized redirect URIs: `https://gente-networking.cloudflareaccess.com/cdn-cgi/access/callback`
       (substitua `gente-networking` pelo seu team name)
   - Copie **Client ID** e **Client Secret**
   - Cole no Cloudflare e salve

---

## Passo 3: Criar Aplicação no Cloudflare Access

Agora vamos proteger a rota `/admin`:

### 3.1 Criar Nova Aplicação

1. No Cloudflare Zero Trust, vá em:
   - **Access** → **Applications** → **Add an application**

2. Selecione **Self-hosted**

3. Configure os detalhes:
   - **Application name**: `Gente Networking Admin Dashboard`
   - **Session duration**: `24 hours` (ou quanto tempo quiser que o login dure)

### 3.2 Configurar Domínio e Caminho

Na seção **Application domain**:

- **Subdomain**: `lps`
- **Domain**: Selecione `gentenetworking.com.br` (seu domínio)
- **Path**: `/admin`

Resultado final: `lps.gentenetworking.com.br/admin`

### 3.3 Copiar Application Audience (AUD) Tag

- Na parte inferior da página, você verá **"Application Audience (AUD) Tag"**
- **COPIE ESTE VALOR** - você vai precisar dele nas variáveis de ambiente
- Exemplo: `f716c3879ab3eaac78a97f1e7e94fae0de15a555e60fd48632607e6971e4b34e`

### 3.4 Clique em **Next** (Próximo)

---

## Passo 4: Configurar Política de Acesso

Agora você define **quem** pode acessar o dashboard:

### 4.1 Criar Política

1. **Policy name**: `Admin Access`

2. **Action**: Selecione **Allow** (Permitir)

3. **Configure rules** (Configurar regras):
   
   **Opção A: Emails Específicos** (Recomendado)
   - Selector: **Emails**
   - Value: Digite os emails que podem acessar, separados por vírgula
   - Exemplo: `gentenetworking@gmail.com, seu@oespecialistaseo.com.br`

   **Opção B: Domínio Inteiro** (Se todos do seu domínio podem acessar)
   - Selector: **Emails ending in**
   - Value: `@gentenetworking.com.br`

4. Clique em **Next** → **Add application**

---

## Passo 5: Configurar Variáveis de Ambiente no Cloudflare Pages

Agora você precisa adicionar as variáveis no seu projeto:

### 5.1 Acessar Configurações do Projeto

1. Vá para o [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Clique em **Workers & Pages**
3. Selecione seu projeto (`gente-networking-lps`)
4. Clique na aba **Settings**
5. Role até **Environment variables**

### 5.2 Adicionar as 2 Variáveis

Clique em **"Add variables"** e adicione:

| Variable name | Value | Exemplo |
|---------------|-------|---------|
| `CF_ACCESS_TEAM_DOMAIN` | Seu team domain completo | `https://gente-networking.cloudflareaccess.com` |
| `CF_ACCESS_AUD` | O AUD tag que você copiou no Passo 3.3 | `f716c3879ab3eaac78a97f1e7e94fae0de15a555e60fd48632607e6971e4b34e` |

**IMPORTANTE**:
- Adicione as variáveis tanto em **Production** quanto em **Preview**
- Clique em **"Save"** após adicionar cada variável

---

## Passo 6: Fazer Deploy e Testar

### 6.1 Fazer Novo Deploy

1. Faça push do código para o GitHub (já feito)
2. O Cloudflare Pages fará deploy automaticamente
3. Aguarde o deploy completar (geralmente 2-5 minutos)

### 6.2 Testar o Acesso

1. Abra uma aba anônima/privada no navegador
2. Acesse: `https://lps.gentenetworking.com.br/admin`
3. Você será redirecionado para a tela de login do Cloudflare Access
4. Clique em **"Sign in with Google"**
5. Faça login com uma das contas Google autorizadas
6. Você será redirecionado de volta para o dashboard `/admin`

---

## 🎉 Pronto!

Seu dashboard está protegido! Agora:

- ✅ Apenas emails autorizados podem acessar `/admin`
- ✅ Login gerenciado pelo Google OAuth (seguro e confiável)
- ✅ Sessão dura 24 horas (configurável)
- ✅ Cloudflare gerencia tudo no edge (zero código)

---

## 🔧 Troubleshooting

### Erro "Invalid URL" persiste

- Verifique se as 2 variáveis estão configuradas corretamente
- Certifique-se de que `CF_ACCESS_TEAM_DOMAIN` inclui `https://`
- Faça um novo deploy após adicionar as variáveis

### "Access Denied" ao tentar fazer login

- Verifique se o email que você está usando está na lista de emails autorizados
- Vá em **Access** → **Applications** → **Gente Networking Admin Dashboard** → **Policies**
- Edite a política e adicione o email correto

### Dashboard não carrega após login bem-sucedido

- Verifique se o banco de dados D1 está configurado
- Execute os scripts SQL em `/cloudflare-d1-scripts/` seguindo a ordem do README

### Quero adicionar/remover emails autorizados

1. Vá em **Access** → **Applications**
2. Clique na aplicação **Gente Networking Admin Dashboard**
3. Clique na aba **Policies**
4. Edite a política **Admin Access**
5. Adicione ou remova emails
6. Salve

---

## 📚 Documentação Oficial

- [Cloudflare Access Documentation](https://developers.cloudflare.com/cloudflare-one/applications/)
- [Google OAuth Setup](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/google/)

---

## 💡 Dicas

- **Teste regularmente**: Faça logout e login novamente para garantir que tudo funciona
- **Monitore os logs**: Vá em **Logs** no painel do Cloudflare Zero Trust para ver tentativas de acesso
- **Adicione 2FA**: Configure autenticação de dois fatores na sua conta Google para segurança extra
- **Sessões**: Ajuste a duração da sessão conforme necessário (4h, 12h, 24h, 1 semana)

---

Se tiver problemas, consulte os logs do Cloudflare Zero Trust em **Access** → **Logs** para ver detalhes das tentativas de autenticação.
