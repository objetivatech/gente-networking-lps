# Guia de Acesso ao Dashboard Administrativo

Este documento fornece instruções detalhadas para acessar e utilizar o dashboard administrativo das landing pages do Gente Networking.

---

## 🔐 Como Acessar o Dashboard

### URL de Acesso

O dashboard administrativo está disponível na rota `/admin`:

- **Desenvolvimento Local**: `http://localhost:3000/admin`
- **Cloudflare Pages**: `https://lps.gentenetworking.com.br/admin`
- **Domínio Principal** (após redirect): `https://gentenetworking.com.br/admin` → redireciona para subdomain

### Autenticação

O dashboard utiliza **autenticação OAuth do Manus**. Apenas usuários autorizados podem acessar.

#### Primeiro Acesso

1. Acesse a URL `/admin`
2. Você verá uma tela de "Acesso Restrito"
3. Clique no botão **"Fazer Login"**
4. Será redirecionado para a página de login do Manus
5. Faça login com suas credenciais autorizadas
6. Após login bem-sucedido, você será redirecionado de volta ao dashboard

#### Tempo de Carregamento

⏱️ **Importante**: O dashboard pode levar de **5 a 15 segundos** para carregar completamente na primeira vez, pois:
- Verifica autenticação do usuário
- Carrega dados do banco de dados D1
- Inicializa queries do tRPC
- Carrega estatísticas e métricas

**Aguarde o spinner de carregamento desaparecer** antes de concluir que há um problema.

---

## 📊 Funcionalidades do Dashboard

### 1. Visão Geral (Cards de Métricas)

Na parte superior do dashboard você encontra 4 cards com estatísticas:

- **Total de Leads**: Número total de leads capturados
- **Novos Leads**: Leads com status "novo" (não contatados)
- **Participe**: Leads vindos da página /participe
- **Gente HUB**: Leads vindos da página /gentehub

### 2. Abas de Gerenciamento

O dashboard possui 5 abas principais:

#### 📋 Leads

Visualize e gerencie todos os leads capturados:

- **Lista completa** com nome, email, WhatsApp, empresa, segmento
- **Status** de cada lead (Novo, Contatado, Convertido, Arquivado)
- **Origem** (Participe ou Gente HUB)
- **Data de cadastro**
- **Ações**: Atualizar status, exportar para CSV

**Exportação de Leads:**
- Clique em "Exportar CSV" para baixar todos os leads
- Filtre por origem antes de exportar (opcional)

#### 📅 Eventos

Gerencie eventos futuros do Gente HUB:

- **Lista de eventos** com data, horário, local
- **Status** (Próximo, Em andamento, Concluído, Cancelado)
- **Número de participantes**
- **Criar novo evento**
- **Editar** ou **Excluir** eventos existentes

#### 💬 Depoimentos

Gerencie depoimentos de membros:

- **Lista de depoimentos** com autor, cargo, empresa
- **Página** onde o depoimento aparece (Participe, Gente HUB, ou Ambas)
- **Ordem de exibição**
- **Adicionar novo depoimento**
- **Editar** ou **Excluir** depoimentos

#### ❓ FAQs

Gerencie perguntas frequentes:

- **Lista de FAQs** com pergunta e resposta
- **Página** onde a FAQ aparece
- **Ordem de exibição**
- **Adicionar nova FAQ**
- **Editar** ou **Excluir** FAQs

#### 📝 Conteúdo

Edite conteúdos das landing pages:

- **Títulos** (headlines)
- **Descrições**
- **CTAs** (Call-to-Actions)
- **Textos de seções**
- **URLs de imagens**

**Nota**: As alterações de conteúdo são salvas no banco de dados D1 e refletidas imediatamente nas páginas.

---

## 🔧 Troubleshooting

### Problema: Dashboard não carrega / Tela branca

**Solução**:
1. **Aguarde 15-20 segundos** - O carregamento inicial pode ser lento
2. Verifique se você está autenticado (faça logout e login novamente)
3. Limpe o cache do navegador (Ctrl+Shift+Delete)
4. Tente em modo anônimo/privado
5. Verifique se o banco de dados D1 está configurado corretamente

### Problema: "Acesso Negado" ou "Forbidden"

**Solução**:
1. Verifique se seu usuário tem a role `admin` no banco de dados
2. Entre em contato com o administrador do sistema para verificar permissões
3. Faça logout e login novamente

### Problema: Dados não aparecem (leads, eventos, etc.)

**Solução**:
1. Verifique se os scripts SQL foram executados no Cloudflare D1
2. Confirme que as tabelas foram criadas corretamente
3. Verifique as variáveis de ambiente no Cloudflare Pages
4. Consulte os logs do Cloudflare Pages para erros

### Problema: Erro ao salvar alterações

**Solução**:
1. Verifique sua conexão com a internet
2. Confirme que você tem permissões de admin
3. Verifique se o banco de dados D1 está acessível
4. Consulte os logs do navegador (F12 → Console)

---

## 🚀 Dicas de Uso

### Gerenciamento de Leads

1. **Atualize o status** dos leads conforme você os contata:
   - `Novo` → Lead acabou de chegar
   - `Contatado` → Você já entrou em contato
   - `Convertido` → Lead virou cliente/membro
   - `Arquivado` → Lead não tem mais interesse

2. **Exporte regularmente** os leads para backup

3. **Monitore as métricas** nos cards superiores para acompanhar conversões

### Gerenciamento de Eventos

1. **Crie eventos com antecedência** para que o sistema de notificações funcione
2. **Atualize o status** conforme o evento se aproxima
3. **Configure o link do grupo WhatsApp** nas configurações do evento

### Otimização de Conteúdo

1. **Teste diferentes headlines** e monitore a taxa de conversão
2. **Atualize depoimentos** periodicamente com novos membros
3. **Adicione FAQs** baseadas em perguntas recorrentes dos leads

---

## 📞 Suporte

Se você encontrar problemas não listados aqui:

1. Verifique a documentação técnica em `/CLOUDFLARE-SETUP.md`
2. Consulte os logs do Cloudflare Pages
3. Entre em contato com o desenvolvedor do sistema

---

## 🔒 Segurança

- **Nunca compartilhe** suas credenciais de acesso
- **Faça logout** ao terminar de usar o dashboard
- **Use conexão segura** (HTTPS) sempre
- **Mantenha** as variáveis de ambiente confidenciais

---

**Última atualização**: Janeiro 2026
**Versão do documento**: 1.0
