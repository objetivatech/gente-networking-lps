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
- [ ] Implementar meta tags dinâmicas (title, description)
- [ ] Criar Open Graph tags para compartilhamento
- [ ] Implementar tags alt para todas as imagens
- [ ] Criar sitemap.xml
- [ ] Criar robots.txt
- [ ] Implementar schema markup para eventos
- [ ] Adicionar structured data (Organization, Event)
- [ ] Otimizar performance (lazy loading, compressão)
- [ ] Implementar canonical URLs

## Integração Cloudflare
- [ ] Configurar Cloudflare D1 via MCP
- [ ] Configurar Cloudflare R2 via MCP
- [ ] Criar migrations para banco D1
- [ ] Testar conexão com D1
- [ ] Testar upload para R2
- [ ] Implementar queries otimizadas

## Documentação
- [ ] Criar guia de configuração Cloudflare Pages
- [ ] Documentar configuração Cloudflare D1
- [ ] Documentar configuração Cloudflare R2
- [ ] Criar guia de deploy via GitHub
- [ ] Documentar configuração de domínios
- [ ] Documentar configuração de subpastas (/participe e /gentehub)
- [ ] Criar manual de uso do dashboard
- [ ] Documentar estrutura do banco de dados
- [ ] Criar guia de troubleshooting

## Testes e Validação
- [ ] Testar formulários de inscrição
- [ ] Testar sistema de upload de imagens
- [ ] Testar dashboard administrativo
- [ ] Validar SEO em ferramentas (Google Search Console)
- [ ] Testar responsividade mobile
- [ ] Validar performance (Lighthouse)
- [ ] Testar integração D1 e R2

## Deploy e Finalização
- [ ] Criar repositório GitHub
- [ ] Configurar GitHub Actions (se necessário)
- [ ] Preparar documentação de deploy
- [ ] Criar checkpoint final
- [ ] Validar todas as funcionalidades
