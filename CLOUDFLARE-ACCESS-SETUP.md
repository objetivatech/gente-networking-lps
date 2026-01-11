# Configuração do Cloudflare Access

Este guia explica como configurar o Cloudflare Access para proteger o dashboard `/admin` do seu site.

## O que é Cloudflare Access?

Cloudflare Access é um serviço de autenticação gerenciado que protege suas aplicações **antes** que elas cheguem ao seu servidor. Funciona no nível do edge da Cloudflare, oferecendo:

- ✅ **Zero configuração de código** - A autenticação acontece no edge
- ✅ **Múltiplos provedores** - Google, GitHub, Microsoft, email OTP, etc
- ✅ **Controle granular** - Defina quem pode acessar cada rota
- ✅ **Gratuito** para até 50 usuários

## Passo 1: Criar uma conta Cloudflare Zero Trust

1. Acesse [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Se ainda não tem, crie uma conta Zero Trust (é gratuito)
3. Escolha um **team name** (ex: `gente-networking`)
   - Seu team domain será: `https://gente-networking.cloudflareaccess.com`
   - **Anote este domínio** - você vai precisar dele depois

## Passo 2: Configurar uma Aplicação no Cloudflare Access

1. No dashboard do Cloudflare Zero Trust, vá em **Access** → **Applications**
2. Clique em **Add an application**
3. Escolha **Self-hosted**
4. Preencha os campos:

### Application Configuration

**Application name**: `Gente Networking Admin Dashboard`

**Session Duration**: `24 hours` (ou o tempo que preferir)

**Application domain**:
```
lps.gentenetworking.com.br
```

**Path**: `/admin` (apenas esta rota será protegida)

### Add a policy

**Policy name**: `Admin Access`

**Action**: `Allow`

**Configure rules**:
- Escolha um método de autenticação:
  - **Emails**: Digite seu email (ex: `seu@email.com`)
  - **Email domain**: Digite seu domínio corporativo (ex: `@gentenetworking.com.br`)
  - **Google**: Permite login com contas Google específicas
  - **GitHub**: Permite login com contas GitHub específicas

**Exemplo** (permitir apenas seu email):
```
Include: Emails
Value: seu@email.com
```

5. Clique em **Save application**

## Passo 3: Copiar as informações necessárias

Após criar a aplicação, você verá uma tela com informações importantes:

### Application Audience (AUD) Tag

Na aba **Overview** da aplicação, copie o **Application Audience (AUD) Tag**. Será algo como:
```
4714c1358e65fe4b408ad6d432a5f878f08194bdb4752441fd56faefa9b2b6f2
```

**Anote este valor** - você vai precisar dele para configurar as variáveis de ambiente.

## Passo 4: Configurar Variáveis de Ambiente no Cloudflare Pages

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Vá em **Workers & Pages** → Selecione seu projeto
3. Clique na aba **Settings** → **Environment variables**
4. Adicione as seguintes variáveis:

### Variáveis Necessárias

| Variável | Valor | Onde Obter |
|----------|-------|------------|
| `CF_ACCESS_TEAM_DOMAIN` | `https://seu-team-name.cloudflareaccess.com` | Passo 1 - O team domain que você criou |
| `CF_ACCESS_AUD` | `4714c1358...` | Passo 3 - Application Audience tag |

**Importante**: Adicione essas variáveis tanto em **Production** quanto em **Preview** environments.

5. Clique em **Save** e faça um novo deploy do site

## Passo 5: Testar a Autenticação

1. Acesse `https://lps.gentenetworking.com.br/admin`
2. Você será redirecionado automaticamente para a tela de login do Cloudflare Access
3. Faça login com o método que você configurou (email, Google, etc)
4. Após autenticar, você será redirecionado de volta para `/admin`
5. O dashboard deve carregar normalmente com seus dados

## Solução de Problemas

### "Invalid token" ou "Missing CF Access JWT"

**Causa**: As variáveis de ambiente não estão configuradas corretamente.

**Solução**:
1. Verifique se `CF_ACCESS_TEAM_DOMAIN` e `CF_ACCESS_AUD` estão corretas
2. Certifique-se de que o team domain inclui `https://`
3. Faça um novo deploy após alterar as variáveis

### "Access Denied" após fazer login

**Causa**: Seu email/conta não está na lista de permitidos.

**Solução**:
1. Volte ao Cloudflare Zero Trust Dashboard
2. Edite a aplicação → **Policies**
3. Adicione seu email/conta na regra de **Include**

### O login não aparece

**Causa**: A aplicação não está configurada corretamente no Cloudflare Access.

**Solução**:
1. Verifique se o domínio `lps.gentenetworking.com.br` está correto
2. Verifique se o path `/admin` está configurado
3. Certifique-se de que a aplicação está **ativa** (não em rascunho)

## Adicionar Mais Usuários

Para permitir que outras pessoas acessem o dashboard:

1. Vá em **Access** → **Applications** → Edite sua aplicação
2. Clique em **Policies** → Edite a policy
3. Na seção **Include**, adicione:
   - Mais emails individuais, ou
   - Um domínio inteiro (ex: `@gentenetworking.com.br`), ou
   - Um grupo do Google Workspace/Microsoft 365

## Custos

- **Gratuito** para até 50 usuários
- Acima de 50 usuários: $3/usuário/mês

## Recursos Adicionais

- [Documentação oficial do Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/)
- [Validação de JWT](https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/)
- [Provedores de identidade](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/)

## Resumo das Variáveis

Apenas **2 variáveis** são necessárias:

```bash
CF_ACCESS_TEAM_DOMAIN=https://seu-team-name.cloudflareaccess.com
CF_ACCESS_AUD=seu-application-audience-tag
```

Tudo mais é gerenciado pelo Cloudflare Access no edge! 🎉
