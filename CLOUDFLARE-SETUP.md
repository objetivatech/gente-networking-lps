# Guia Completo de Implementação no Cloudflare

Este documento fornece instruções detalhadas para implementar as landing pages do Gente Networking no **Cloudflare Pages**, com integração completa ao **Cloudflare D1** (banco de dados) e **Cloudflare R2** (armazenamento de arquivos).

---

## Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração do Cloudflare D1 (Banco de Dados)](#configuração-do-cloudflare-d1-banco-de-dados)
4. [Configuração do Cloudflare R2 (Armazenamento)](#configuração-do-cloudflare-r2-armazenamento)
5. [Configuração do Cloudflare Pages](#configuração-do-cloudflare-pages)
6. [Deploy via GitHub](#deploy-via-github)
7. [Configuração de Domínios Personalizados](#configuração-de-domínios-personalizados)
8. [Variáveis de Ambiente](#variáveis-de-ambiente)
9. [Manutenção e Monitoramento](#manutenção-e-monitoramento)
10. [Troubleshooting](#troubleshooting)

---

## Visão Geral da Arquitetura

O projeto Gente Networking Landing Pages utiliza uma arquitetura moderna e escalável baseada em serviços do Cloudflare:

| Componente | Serviço | Função |
|------------|---------|--------|
| **Frontend** | Cloudflare Pages | Hospedagem das landing pages /participe e /gentehub |
| **Backend API** | Cloudflare Workers | API tRPC para comunicação com banco de dados |
| **Banco de Dados** | Cloudflare D1 | Armazenamento de leads, eventos, depoimentos e FAQs |
| **Armazenamento** | Cloudflare R2 | Hospedagem de imagens e assets |
| **CDN** | Cloudflare CDN | Distribuição global de conteúdo |

### Benefícios desta Arquitetura

- **Custo Zero ou Muito Baixo**: Cloudflare oferece planos gratuitos generosos para D1, R2 e Pages
- **Performance Global**: CDN distribuído globalmente com latência mínima
- **Escalabilidade Automática**: Infraestrutura serverless que escala automaticamente
- **Segurança Integrada**: DDoS protection, SSL/TLS automático e WAF inclusos

---

## Pré-requisitos

Antes de iniciar a configuração, certifique-se de ter:

- ✅ Conta no [Cloudflare](https://dash.cloudflare.com/sign-up) (gratuita)
- ✅ Conta no [GitHub](https://github.com/signup) (gratuita)
- ✅ Repositório GitHub criado para o projeto
- ✅ Código do projeto versionado no GitHub
- ✅ Acesso ao dashboard do Cloudflare

---

## Configuração do Cloudflare D1 (Banco de Dados)

O Cloudflare D1 é um banco de dados SQL serverless baseado em SQLite, ideal para aplicações edge.

### Passo 1: Criar o Banco de Dados D1

1. Acesse o [Dashboard do Cloudflare](https://dash.cloudflare.com)
2. No menu lateral esquerdo, clique em **Workers & Pages**
3. Clique na aba **D1**
4. Clique no botão **Create database**
5. Preencha os campos:
   - **Database name**: `gente-networking-db`
   - **Location**: Escolha a região mais próxima (ex: Western North America)
6. Clique em **Create**

#### Passo 2: Executar as Migrações do Banco de Dados

Após criar o banco, você precisa criar as tabelas. **IMPORTANTE**: Os scripts SQL foram organizados em arquivos individuais no diretório `cloudflare-d1-scripts/` e devem ser executados **NA ORDEM NUMÉRICA** (01, 02, 03, etc.) para evitar erros de dependências.

#### Opção A: Via Dashboard do Cloudflare (Recomendado)

1. No dashboard do D1, clique no banco `gente-networking-db`
2. Clique na aba **Console**
3. Execute cada script SQL **NA ORDEM**:
   - Copie o conteúdo de `cloudflare-d1-scripts/01-create-users.sql`
   - Cole no console e clique em **Execute**
   - Repita para os scripts 02, 03, 04, 05, 06, 07, 08 e 09
4. Verifique se as tabelas foram criadas com sucesso

**Ordem de Execução dos Scripts:**
1. `01-create-users.sql` - Tabela de usuários
2. `02-create-leads.sql` - Tabela de leads
3. `03-create-page-content.sql` - Conteúdo editável
4. `04-create-events.sql` - Eventos
5. `05-create-testimonials.sql` - Depoimentos
6. `06-create-faqs.sql` - FAQs
7. `07-create-images.sql` - Imagens
8. `08-create-event-settings.sql` - Configurações de eventos
9. `09-create-email-notifications.sql` - Notificações por email

#### Opção B: Via Wrangler CLI
```bash
# Instalar Wrangler CLI globalmente
npm install -g wrangler

# Fazer login no Cloudflare
wrangler login

# Executar migrações NA ORDEM
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/01-create-users.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/02-create-leads.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/03-create-page-content.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/04-create-events.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/05-create-testimonials.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/06-create-faqs.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/07-create-images.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/08-create-event-settings.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/09-create-email-notifications.sql
```

**Consulte o arquivo `cloudflare-d1-scripts/README.md` para instruções detalhadas e script automatizado.**

### Passo 3: Verificar as Tabelas Criadas

Execute o seguinte comando SQL no Console do D1 para verificar:

```sql
SELECT name FROM sqlite_master WHERE type='table';
```

Você deve ver as seguintes tabelas:
- `users` - Usuários do sistema
- `leads` - Leads capturados dos formulários
- `page_content` - Conteúdo editável das páginas
- `events` - Eventos do Gente HUB
- `testimonials` - Depoimentos de membros
- `faqs` - Perguntas frequentes
- `images` - Imagens hospedadas no R2
- `event_settings` - Configurações dos eventos (link WhatsApp, datas)
- `email_notifications` - Controle de notificações por email

### Passo 4: Inserir Dados Iniciais (Opcional)

Você pode inserir alguns dados de exemplo para testar:

```sql
-- Inserir um evento de exemplo
INSERT INTO events (title, description, eventDate, startTime, endTime, location, maxAttendees, status)
VALUES (
  'Gente HUB - Janeiro 2026',
  'Networking + Palestra TedX Style',
  '2026-01-25 07:30:00',
  '07:30',
  '09:30',
  'Online via Zoom',
  50,
  'upcoming'
);

-- Inserir um depoimento de exemplo
INSERT INTO testimonials (name, role, company, content, page, `order`, active)
VALUES (
  'João Silva',
  'CEO',
  'Tech Solutions',
  'O GeNtE transformou minha rede de contatos e gerou negócios reais.',
  'both',
  1,
  1
);

-- Inserir uma FAQ de exemplo
INSERT INTO faqs (question, answer, page, `order`, active)
VALUES (
  'Como funciona o GeNtE?',
  'O GeNtE é um grupo de networking estruturado com reuniões quinzenais online.',
  'both',
  1,
  1
);
```

---

## Configuração do Cloudflare R2 (Armazenamento)

O Cloudflare R2 é um serviço de armazenamento de objetos compatível com S3, sem custos de egress.

### Passo 1: Criar um Bucket R2

1. No Dashboard do Cloudflare, clique em **R2** no menu lateral
2. Clique em **Create bucket**
3. Preencha os campos:
   - **Bucket name**: `gente-networking-assets`
   - **Location**: Automatic (recomendado)
4. Clique em **Create bucket**

### Passo 2: Configurar Acesso Público (para imagens)

1. Clique no bucket `gente-networking-assets`
2. Vá para a aba **Settings**
3. Em **Public access**, clique em **Allow Access**
4. Copie a **Public bucket URL** (será algo como: `https://pub-xxxxx.r2.dev`)
5. Guarde esta URL, você precisará dela nas variáveis de ambiente

### Passo 3: Criar API Token para Acesso Programático

1. No menu R2, clique em **Manage R2 API Tokens**
2. Clique em **Create API token**
3. Preencha:
   - **Token name**: `gente-networking-upload`
   - **Permissions**: Object Read & Write
   - **Buckets**: Selecione `gente-networking-assets`
4. Clique em **Create API Token**
5. **IMPORTANTE**: Copie e guarde em local seguro:
   - **Access Key ID**
   - **Secret Access Key**
   - **Endpoint URL**

### Passo 4: Fazer Upload das Imagens Iniciais

Você pode fazer upload manual das imagens fornecidas:

1. No bucket `gente-networking-assets`, clique em **Upload**
2. Crie uma pasta chamada `images`
3. Faça upload de todos os arquivos da pasta `client/public/images/` do projeto
4. As imagens estarão disponíveis em: `https://pub-xxxxx.r2.dev/images/nome-da-imagem.png`

---

## Configuração do Cloudflare Pages

O Cloudflare Pages hospedará suas landing pages com deploy automático via GitHub.

### Passo 1: Conectar o Repositório GitHub

1. No Dashboard do Cloudflare, clique em **Workers & Pages**
2. Clique em **Create application**
3. Selecione a aba **Pages**
4. Clique em **Connect to Git**
5. Autorize o Cloudflare a acessar sua conta GitHub
6. Selecione o repositório do projeto: `objetivatech/ranktopseo` (ou o nome do seu repositório)
7. Clique em **Begin setup**

### Passo 2: Configurar Build Settings

Na tela de configuração, preencha:

| Campo | Valor |
|-------|-------|
| **Project name** | `gente-networking-lps` |
| **Production branch** | `main` |
| **Framework preset** | `Vite` |
| **Build command** | `pnpm build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (deixe em branco) |

### Passo 3: Configurar Variáveis de Ambiente

Ainda na tela de configuração, role até **Environment variables** e adicione:

```
NODE_VERSION=22
```

**Importante**: As demais variáveis de ambiente serão configuradas após o primeiro deploy.

### Passo 4: Fazer o Deploy Inicial

1. Clique em **Save and Deploy**
2. Aguarde o build e deploy (leva cerca de 2-5 minutos)
3. Após concluído, você verá uma URL como: `https://gente-networking-lps.pages.dev`

---

## Deploy via GitHub

Após a configuração inicial, todo push para a branch `main` do GitHub acionará um deploy automático.

### Workflow de Deploy

```
Código Local → Git Push → GitHub → Cloudflare Pages → Deploy Automático
```

### Como Fazer Deploy de Atualizações

```bash
# 1. Fazer alterações no código
# 2. Commitar as alterações
git add .
git commit -m "Atualização das landing pages"

# 3. Enviar para o GitHub
git push origin main

# 4. O Cloudflare Pages detectará automaticamente e fará o deploy
```

### Monitorar o Deploy

1. Acesse o Dashboard do Cloudflare
2. Vá em **Workers & Pages** → **gente-networking-lps**
3. Clique na aba **Deployments**
4. Você verá o status do deploy em tempo real

---

## Configuração de Domínios Personalizados

Para usar domínios personalizados (ex: `gentenetworking.com.br/participe`):

### Passo 1: Adicionar Domínio ao Cloudflare Pages

1. No projeto do Pages, clique na aba **Custom domains**
2. Clique em **Set up a custom domain**
3. Digite seu domínio: `gentenetworking.com.br`
4. Clique em **Continue**

### Passo 2: Configurar DNS

Se o domínio já estiver no Cloudflare:
1. O Cloudflare criará automaticamente o registro DNS necessário
2. Aguarde a propagação (até 24 horas, geralmente alguns minutos)

Se o domínio NÃO estiver no Cloudflare:
1. Adicione um registro CNAME no seu provedor DNS:
   - **Name**: `@` ou `www`
   - **Target**: `gente-networking-lps.pages.dev`
   - **TTL**: Automático

### Passo 3: Configurar Subpastas (/participe e /gentehub)

As rotas `/participe` e `/gentehub` já estão configuradas no código do projeto através do React Router. Elas funcionarão automaticamente após o deploy.

### Passo 4: Ativar SSL/TLS

1. No Cloudflare, vá em **SSL/TLS**
2. Selecione o modo **Full (strict)**
3. O certificado SSL será provisionado automaticamente

---

## Variáveis de Ambiente

Após o primeiro deploy, configure as variáveis de ambiente necessárias:

### Passo 1: Acessar Configurações do Projeto

1. No Dashboard do Cloudflare, vá em **Workers & Pages**
2. Clique no projeto `gente-networking-lps`
3. Clique na aba **Settings**
4. Role até **Environment variables**

### Passo 2: Adicionar Variáveis de Produção

Clique em **Add variable** e adicione cada uma das seguintes variáveis:

#### Variáveis do Banco de Dados D1

```
DATABASE_URL=<será configurado via binding, não precisa adicionar manualmente>
```

#### Variáveis do R2

```
R2_BUCKET_NAME=gente-networking-assets
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
R2_ACCESS_KEY_ID=<seu access key do R2>
R2_SECRET_ACCESS_KEY=<seu secret key do R2>
R2_ENDPOINT=<endpoint do R2>
```

#### Variáveis de Aplicação

```
NODE_ENV=production
VITE_APP_TITLE=Gente Networking
VITE_APP_LOGO=/images/logo-gente-networking.png
```

### Passo 3: Configurar Bindings do D1 e R2

Ainda nas configurações do projeto:

1. Role até **Bindings**
2. Clique em **Add** ao lado de **D1 database**
3. Preencha:
   - **Variable name**: `DB`
   - **D1 database**: Selecione `gente-networking-db`
4. Clique em **Save**

5. Clique em **Add** ao lado de **R2 bucket**
6. Preencha:
   - **Variable name**: `R2_BUCKET`
   - **R2 bucket**: Selecione `gente-networking-assets`
7. Clique em **Save**

### Passo 4: Fazer Redeploy

Após adicionar as variáveis:
1. Vá na aba **Deployments**
2. Clique nos três pontos do último deploy
3. Clique em **Retry deployment**

---

## Manutenção e Monitoramento

### Acessar Logs do Cloudflare Pages

1. No projeto do Pages, clique na aba **Deployments**
2. Clique em um deployment específico
3. Clique em **View build log** para ver logs de build
4. Use **Real-time logs** para ver logs de runtime

### Monitorar Uso do D1

1. Vá em **Workers & Pages** → **D1**
2. Clique no banco `gente-networking-db`
3. Veja métricas de:
   - Queries executadas
   - Armazenamento utilizado
   - Latência média

### Monitorar Uso do R2

1. Vá em **R2**
2. Clique no bucket `gente-networking-assets`
3. Veja métricas de:
   - Objetos armazenados
   - Tamanho total
   - Requests de leitura/escrita

### Backup do Banco de Dados

Para fazer backup do D1:

```bash
# Via Wrangler CLI
wrangler d1 export gente-networking-db --output=backup.sql
```

Ou via Dashboard:
1. Acesse o banco no D1
2. Clique em **Console**
3. Execute: `.dump` para exportar todo o banco

---

## Troubleshooting

### Problema: Build Falha no Cloudflare Pages

**Sintomas**: Deploy falha com erro de build

**Soluções**:
1. Verifique se a variável `NODE_VERSION=22` está configurada
2. Verifique se o comando de build está correto: `pnpm build`
3. Verifique se o `package.json` tem o script `build` definido
4. Veja os logs de build para identificar o erro específico

### Problema: Imagens Não Carregam

**Sintomas**: Imagens aparecem quebradas nas landing pages

**Soluções**:
1. Verifique se o bucket R2 está com acesso público habilitado
2. Verifique se a variável `R2_PUBLIC_URL` está correta
3. Verifique se as imagens foram feitas upload no caminho correto: `/images/nome.png`
4. Teste o acesso direto à imagem: `https://pub-xxxxx.r2.dev/images/logo-gente-networking.png`

### Problema: Formulários Não Enviam Leads

**Sintomas**: Ao submeter formulário, nada acontece ou erro aparece

**Soluções**:
1. Verifique se o binding do D1 está configurado corretamente
2. Verifique os logs do Cloudflare Pages para ver erros de API
3. Teste a conexão com o banco via Console do D1
4. Verifique se as tabelas foram criadas corretamente

### Problema: Rotas /participe e /gentehub Retornam 404

**Sintomas**: Ao acessar as rotas diretamente, retorna 404

**Soluções**:
1. Crie um arquivo `_redirects` na pasta `public/` com o conteúdo:
   ```
   /*    /index.html   200
   ```
2. Isso configurará o SPA routing corretamente no Cloudflare Pages

### Problema: Dashboard /admin Não Autentica

**Sintomas**: Não consegue acessar o dashboard administrativo

**Soluções**:
1. Verifique se você está logado no sistema
2. Verifique se seu usuário tem role `admin` no banco de dados
3. Para promover um usuário a admin, execute no Console do D1:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'seu@email.com';
   ```

---

## Próximos Passos

Após concluir a configuração:

1. ✅ Teste todas as funcionalidades das landing pages
2. ✅ Acesse o dashboard administrativo em `/admin`
3. ✅ Configure o domínio personalizado
4. ✅ Faça upload de todas as imagens necessárias no R2
5. ✅ Insira dados iniciais (eventos, depoimentos, FAQs)
6. ✅ Configure monitoramento e alertas
7. ✅ Documente o processo para sua equipe

---

## Suporte e Recursos Adicionais

### Documentação Oficial

- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Comunidade

- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Discord](https://discord.gg/cloudflaredev)

### Limites do Plano Gratuito

| Serviço | Limite Gratuito |
|---------|-----------------|
| **Pages** | 500 builds/mês, Bandwidth ilimitado |
| **D1** | 5 GB storage, 5 milhões de reads/dia |
| **R2** | 10 GB storage, 1 milhão de requests/mês |

---

**Documentação criada por**: Manus AI  
**Última atualização**: Janeiro 2026  
**Versão**: 1.0
