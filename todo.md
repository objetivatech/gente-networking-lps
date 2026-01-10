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
