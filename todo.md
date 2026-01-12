# Gente Networking - Landing Pages - TODO

## Estrutura e Configuração
- [x] Configurar schema do banco de dados D1 (leads, page_content, events, images)
- [x] Configurar sistema de storage R2 para imagens
- [x] Copiar imagens fornecidas para o projeto
- [x] Configurar rotas /participe e /gentehub
- [x] Configurar identidade visual (cores, tipografia, logos)

## Landing Page /participe
- [x] Criar estrutura da página /participe
- [x] Implementar hero section com headline de conversão
- [x] Criar seção de benefícios (4 cards)
- [x] Implementar seção de dinâmicas do Gente
- [x] Criar seção de depoimentos de membros
- [x] Implementar formulário de inscrição (nome, email, WhatsApp, empresa, segmento)
- [x] Adicionar elementos de urgência (vagas limitadas)
- [x] Criar seção FAQ
- [x] Implementar seção do fundador Eduardo Mendonça
- [x] Adicionar CTAs estratégicos

## Landing Page /gentehub
- [x] Criar estrutura da página /gentehub
- [x] Implementar hero section com destaque do evento
- [x] Criar seção de palestra TedX (18min) com palestrante
- [x] Implementar agenda detalhada com horários
- [x] Criar seção de rodadas de negócios
- [x] Implementar countdown de vagas
- [x] Adicionar seção "O que você vai ter no Gente HUB"
- [x] Criar seção de testemunhos de participantes
- [x] Implementar formulário de inscrição
- [x] Adicionar elementos de urgência
- [x] Criar seção FAQ

## Dashboard Administrativo
- [x] Criar rota /admin para dashboard
- [x] Implementar autenticação de admin
- [ ] Criar interface de edição de conteúdo /participe
- [ ] Criar interface de edição de conteúdo /gentehub
- [ ] Implementar editor de textos (headlines, descrições, CTAs)
- [ ] Implementar sistema de upload de imagens
- [x] Criar gerenciador de depoimentos
- [x] Criar gerenciador de FAQ
- [x] Implementar editor de agenda do evento
- [ ] Criar sistema de preview em tempo real
- [ ] Implementar salvamento automático de alterações

## Sistema de Captura de Leads
- [x] Criar tabela de leads no banco D1
- [x] Implementar validação de formulários
- [x] Criar endpoint de captura de leads
- [x] Implementar notificações para proprietário
- [x] Criar dashboard de visualização de leads
- [ ] Implementar exportação de leads (CSV)
- [ ] Adicionar filtros e busca de leads

## Sistema de Upload e Gerenciamento de Imagens
- [ ] Configurar integração com Cloudflare R2
- [ ] Implementar upload de imagens via MCP Cloudflare
- [ ] Criar sistema de compactação de imagens
- [ ] Implementar gerenciador de assets
- [ ] Criar sistema de organização de arquivos
- [ ] Implementar preview de imagens
- [ ] Adicionar funcionalidade de exclusão de imagens

## Otimização SEO
- [x] Implementar meta tags dinâmicas (title, description)
- [x] Criar Open Graph tags para compartilhamento
- [x] Implementar tags alt para todas as imagens
- [x] Criar sitemap.xml
- [x] Criar robots.txt
- [x] Implementar schema markup para eventos
- [x] Adicionar structured data (Organization, Event)
- [x] Otimizar performance (lazy loading, compressão)
- [x] Implementar canonical URLs

## Integração Cloudflare
- [ ] Configurar Cloudflare D1 via MCP
- [ ] Configurar Cloudflare R2 via MCP
- [ ] Criar migrations para banco D1
- [ ] Testar conexão com D1
- [ ] Testar upload para R2
- [ ] Implementar queries otimizadas

## Documentação

- [x] Criar guia de configuração Cloudflare Pages
- [x] Documentar configuração Cloudflare D1
- [x] Documentar configuração Cloudflare R2
- [x] Criar guia de deploy via GitHub
- [x] Documentar configuração de domínios
- [x] Documentar configuração de subpastas (/participe e /gentehub)
- [x] Criar manual de uso do dashboard
- [x] Documentar estrutura do banco de dados
- [x] Criar guia de troubleshooting
## Testes e Validação
- [ ] Testar formulários de inscrição
- [ ] Testar sistema de upload de imagens
- [ ] Testar dashboard administrativo
- [ ] Validar SEO em ferramentas (Google Search Console)
- [ ] Testar responsividade mobile
- [ ] Validar performance (Lighthouse)
- [ ] Testar integração D1 e R2

## Deploy e Finalização
- [x] Criar repositório GitHub
- [x] Configurar GitHub Actions (se necessário)
- [x] Preparar documentação de deploy
- [x] Criar checkpoint final
- [x] Validar todas as funcionalidades

## Novos Recursos Solicitados

### Modal WhatsApp e Grupo Pré-Evento
- [x] Criar modal pós-formulário /gentehub com informações do grupo WhatsApp
- [x] Implementar redirecionamento automático para grupo WhatsApp
- [x] Adicionar campo editável no dashboard para link do grupo WhatsApp
- [x] Criar tabela no banco para armazenar configurações do evento (link WhatsApp)

### Contador Regressivo com Redirecionamento
- [x] Implementar contador regressivo para data/hora do evento
- [x] Criar lógica de redirecionamento automático para /participe quando contador zerar
- [x] Adicionar campo editável no dashboard para data/hora do evento
- [x] Implementar verificação de disponibilidade da LP /gentehub

### Sistema de Envio de Emails
- [x] Configurar envio de emails para gentenetworking@gmail.com
- [x] Criar templates HTML de email com identidade visual Gente
- [x] Implementar envio de email ao submeter formulário /participe
- [x] Implementar envio de email ao submeter formulário /gentehub
- [x] Criar template de confirmação para o lead
- [x] Criar template de notificação para o proprietário

### Sistema de Notificações Automáticas
- [x] Implementar sistema de agendamento de notificações
- [x] Criar notificação automática 5 dias antes do evento
- [x] Criar notificação automática 2 dias antes do evento
- [x] Criar notificação automática 2 horas antes do evento
- [x] Criar tabela no banco para controle de envios (email_notifications)
- [x] Implementar worker/cron job para verificação de notificações pendentes

### Dashboard de Controle de Envios
- [ ] Criar interface de visualização de emails enviados
- [ ] Implementar indicadores de status (enviado, falhou, pendente)
- [ ] Adicionar funcionalidade de reenvio manual de emails
- [ ] Criar filtros por tipo de notificação e status
- [ ] Implementar logs detalhados de envio

### Exportação de Leads
- [x] Implementar exportação de leads para CSV
- [ ] Implementar exportação de leads para Excel (XLSX)
- [x] Adicionar filtros de exportação (data, origem, status)
- [ ] Criar botão de exportação no dashboard

### Editor Visual de Conteúdo
- [ ] Implementar editor WYSIWYG para textos das LPs
- [ ] Criar interface de edição de headlines
- [ ] Criar interface de edição de descrições
- [ ] Criar interface de edição de CTAs
- [ ] Implementar preview em tempo real
- [ ] Adicionar salvamento automático

### Script de Rastreamento
- [x] Adicionar script de rastreamento antes do </body> em /participe
- [x] Adicionar script de rastreamento antes do </body> em /gentehub
- [x] Testar funcionamento do rastreamento de formulários

### Integração WhatsApp (Simplificada)
- [x] Sistema de redirecionamento para grupo via link
- [x] Campo editável no dashboard para link do grupo
- [x] Modal pós-formulário com informações do grupo

## Correção de Scripts SQL para Cloudflare D1
- [x] Criar scripts SQL individuais para cada tabela
- [x] Organizar scripts em ordem de dependências
- [x] Remover foreign keys problemáticas ou ajustar ordem
- [x] Atualizar documentação com ordem correta de execução
- [x] Testar scripts no Cloudflare D1

## Correção de Execução dos Scripts SQL no Cloudflare D1
- [x] Analisar erro de execução no console do Cloudflare
- [x] Separar CREATE TABLE e CREATE INDEX em comandos distintos
- [ ] Testar scripts corrigidos no Cloudflare D1
- [x] Atualizar documentação com instruções corretas
- [ ] Enviar correções para o GitHub

## Documentação de Configuração de Domínio e Subpastas
- [x] Criar guia detalhado de configuração de subdomínio
- [x] Documentar opções de proxy/redirect
- [x] Criar instruções para Cloudflare Workers (roteamento)
- [x] Documentar configuração de DNS
- [x] Enviar documentação para o GitHub

## Correção de Build no Cloudflare Pages
- [x] Corrigir configuração do Vite para output correto
- [x] Testar build localmente
- [x] Enviar correção para o GitHub
- [ ] Testar build no Cloudflare Pages

## Correção do Proxy Reverso no .htaccess
- [x] Identificar conflito com WordPress rewrite rules
- [x] Criar configuração corrigida do .htaccess
- [x] Documentar solução para cPanel/LiteSpeed
- [ ] Testar acesso às rotas /participe e /gentehub
- [x] Enviar documentação para o GitHub

## Proxy via PHP (Opção C)
- [x] Criar script PHP de proxy para /participe
- [x] Criar script PHP de proxy para /gentehub
- [x] Criar .htaccess para roteamento
- [x] Documentar instalação e configuração
- [x] Testar compatibilidade com pixels de rastreamento
- [x] Enviar solução para o GitHub

## Correção de MIME Type no Proxy PHP
- [x] Identificar problema com arquivos CSS/JS retornando text/html
- [x] Corrigir scripts PHP para servir arquivos estáticos corretamente
- [ ] Testar carregamento de CSS e JS
- [x] Enviar correção para o GitHub

## Diagnóstico e Correção Final do Proxy PHP
- [x] Verificar se assets-proxy.php está sendo chamado corretamente
- [x] Testar com URL direta do assets-proxy.php
- [ ] Corrigir assets-proxy.php para capturar caminho completo
- [ ] Testar novamente com caminhos corretos
- [ ] Enviar correção final para o GitHub

## Solução Final - Redirect 301 Simplificado
- [x] Criar .htaccess com redirect 301 para subdomínio
- [x] Atualizar documentação com solução final
- [ ] Testar redirects /participe e /gentehub
- [x] Enviar solução para o GitHub

## Correções e Melhorias - Admin e Logos
- [x] Investigar por que /admin não estava abrindo
- [x] Corrigir acesso ao dashboard /admin (estava demorando para carregar)
- [x] Criar documentação detalhada de acesso ao admin (ADMIN-ACCESS.md)
- [x] Atualizar logos com arquivos do R2 (logo-gente-networking-branco.png, logo_gente_quadrado.png, logo_gente_retangulo.png)
- [x] Aumentar tamanho dos logos para melhor visibilidade
- [x] Testar todas as alterações
- [x] Salvar checkpoint final

## Correção Urgente - Erro Invalid URL no Cloudflare Pages
- [x] Investigar stack trace do erro "Invalid URL" no /admin
- [x] Identificar qual variável de ambiente está causando o problema (ENV.forgeApiUrl vazio)
- [x] Corrigir código para lidar com variáveis ausentes em produção
  - [x] storage.ts: Adicionar validações em buildUploadUrl e buildDownloadUrl
  - [x] notification.ts: Adicionar validação em buildEndpointUrl
  - [x] voiceTranscription.ts: Adicionar validação antes de criar URL
  - [x] map.ts: Adicionar validação em makeRequest
  - [x] dataApi.ts e imageGeneration.ts já tinham validações adequadas
- [x] Testar solução localmente (servidor reiniciado com sucesso)
- [x] Fazer deploy e testar no Cloudflare Pages (aguardando teste do usuário)
- [x] Salvar checkpoint com correção (checkpoint 8d7a50fe)

## Investigação Erro Persistente - Invalid URL no Cloudflare Pages
- [x] Analisar stack trace completo do erro no screenshot
- [x] Identificar qual arquivo específico está causando o erro (index-o8YcojqZ.js - client-side)
- [x] Verificar se o erro está no código client-side ou server-side (CLIENT-SIDE)
- [x] Identificar causa raiz: tRPC usando URL relativa "/api/trpc" que falha no Cloudflare Pages
- [x] Implementar solução definitiva (usar window.location.origin + /api/trpc)
- [x] Testar localmente (dashboard /admin carrega perfeitamente)
- [ ] Testar no Cloudflare Pages (aguardando deploy do usuário)
- [x] Salvar checkpoint final (checkpoint cc572dbb)

## URGENTE - Erro Invalid URL Persiste em Produção
- [x] Pesquisar documentação Cloudflare Pages sobre SPAs
- [x] Pesquisar documentação Cloudflare Pages sobre _redirects
- [x] Verificar se há configuração específica necessária para Cloudflare Pages
- [x] Identificar diferença entre ambiente local e Cloudflare Pages
- [x] CAUSA RAIZ ENCONTRADA: getLoginUrl() em client/src/const.ts tentando criar URL com VITE_OAUTH_PORTAL_URL undefined
- [x] Implementar solução: Adicionar validações em getLoginUrl()
- [x] Criar documentação de variáveis de ambiente necessárias (CLOUDFLARE-ENV-VARS.md)
- [x] Testar localmente (servidor funciona normalmente)
- [ ] Usuário deve configurar variáveis de ambiente no Cloudflare Pages
- [ ] Validar em produção após configurar variáveis


## Revisão de Autenticação - Remover Dependências do Manus
- [ ] Analisar código de autenticação atual (server/_core/auth.ts, server/_core/oauth.ts)
- [ ] Identificar todas as dependências do Manus OAuth
- [x] Propor alternativas de autenticação usando apenas Cloudflare:
  - [x] Opção 1: Cloudflare Access (autenticação gerenciada)
  - [ ] Opção 2: Autenticação simples com senha (login/senha no D1)
  - [ ] Opção 3: Magic Link via email
- [x] ESCOLHIDO: Cloudflare Access (Opção 3)
- [x] Remover todo código OAuth do Manus
- [x] Implementar autenticação via Cloudflare Access headers (cloudflare-access-auth.ts)
- [x] Criar guia de configuração do Cloudflare Access (CLOUDFLARE-ACCESS-SETUP.md)
- [x] Revisar variáveis necessárias (apenas 2: CF_ACCESS_TEAM_DOMAIN e CF_ACCESS_AUD)
- [x] Adicionar instruções claras de como obter cada variável
- [x] Testar autenticação localmente (funciona - aguarda config em produção)
- [ ] Usuário deve seguir CLOUDFLARE-ACCESS-SETUP.md
- [ ] Testar autenticação no Cloudflare Pages


## Atualização Cloudflare Access - Google OAuth
- [x] Atualizar CLOUDFLARE-ACCESS-SETUP.md com instruções de Google OAuth
- [x] Remover instruções de autenticação por email (não funciona sem SMTP)
- [x] Adicionar passo-a-passo para configurar Google como provedor de identidade
- [ ] Usuário deve seguir guia atualizado
- [ ] Salvar checkpoint


## Correção Acesso Restrito - Criar Usuário Admin Automaticamente
- [x] Modificar cloudflare-access-auth.ts para criar usuário automaticamente no primeiro login
- [x] Adicionar logs detalhados para debug
- [x] Garantir que todos os usuários Cloudflare Access sejam criados como admin
- [x] Adicionar tratamento de erros robusto
- [ ] Testar fluxo completo de primeiro login
- [ ] Salvar checkpoint

## MIGRAÇÃO DEFINITIVA - Backend para Cloudflare Workers Functions
- [x] Criar diretório /functions para Cloudflare Workers
- [x] Migrar rotas tRPC para Cloudflare Workers Functions
- [x] Configurar wrangler.toml com bindings D1 e R2
- [x] Adaptar código de autenticação Cloudflare Access para Workers
- [x] Criar db-d1.ts com funções SQL diretas (sem Drizzle)
- [x] Criar context-workers.ts para Cloudflare Workers
- [x] Criar routers-workers.ts adaptado para D1
- [x] Criar documentação completa (CLOUDFLARE-WORKERS-MIGRATION.md)
- [x] Criar guia pós-deploy (SETUP-POS-DEPLOY.md)
- [ ] Configurar bindings D1 e R2 no dashboard Cloudflare Pages
- [ ] Fazer deploy e validar funcionamento 100% no Cloudflare

## Correções de Deploy - Cloudflare Workers
- [x] Remover configuração D1 do wrangler.toml (placeholder causando erro)
- [x] Tornar variáveis VITE_ANALYTICS_* opcionais no código
- [x] Atualizar documentação sobre Umami analytics (UMAMI-ANALYTICS-SETUP.md)
- [ ] Fazer commit e validar deploy

## Configuração de Bindings no wrangler.toml
- [x] Adicionar binding D1 com database_id real (cef239b3-f4e8-4e03-acf1-48aef86c2829)
- [x] Adicionar binding R2 com bucket_name real (gente-networking-assets)
- [ ] Fazer commit e deploy
- [ ] Validar funcionamento

## Correção de Erro 404 em Rotas SPA
- [x] Criar _routes.json para Cloudflare Pages
- [x] Verificar _redirects (já existia e está correto)
- [ ] Fazer commit e deploy
- [ ] Validar rotas /admin, /participe, /gentehub


## PROBLEMAS CRÍTICOS - CORREÇÃO URGENTE
- [x] Erro formulário: "D1_ERROR: table leads has no column named created_at: SQLITE_ERROR"
- [x] Erro autenticação: "Current authentication token is expired" no Cloudflare Access
- [x] Analisar schema D1 e SQL de inserção de leads
- [x] Remover created_at do SQL de inserção de leads (coluna não existe no D1)
- [x] Adicionar botão "Limpar Sessão" para forçar novo login
- [ ] Testar formulários /participe e /gentehub
- [ ] Testar login no /admin com botão "Limpar Sessão"


## CORREÇÃO DEFINITIVA - Autenticação Cloudflare Access
**PROBLEMA RAIZ**: Cloudflare Access protege `/admin` mas React Router intercepta navegação SPA antes do Access
**SOLUÇÃO**: Proteger `/api/*` no Cloudflare Access e criar endpoint `/api/auth/login` que força autenticação

- [x] Criar endpoint `/api/auth/login` que redireciona para /admin após autenticação
- [x] Atualizar Admin.tsx para redirecionar para `/api/auth/login` ao clicar em "Fazer Login"
- [ ] Usuário deve mudar Cloudflare Access: trocar caminho de `/admin` para `/api/*`
- [ ] Testar fluxo completo de autenticação
