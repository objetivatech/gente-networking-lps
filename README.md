# Gente Networking - Landing Pages

Projeto de duas landing pages de conversão para o **Gente Networking**, grupo de networking empresarial, com dashboard administrativo completo.

## 📋 Sobre o Projeto

Este projeto contém duas landing pages otimizadas para conversão:

1. **`/participe`** - Landing page para captação de leads interessados em participar de uma reunião gratuita do Gente Networking
2. **`/gentehub`** - Landing page para inscrições no evento mensal Gente HUB, que combina networking estruturado com palestra estilo TedX

Além disso, inclui um **dashboard administrativo** (`/admin`) para gerenciar:
- Leads capturados
- Eventos futuros
- Depoimentos de membros
- Perguntas frequentes (FAQs)
- Conteúdo editável das landing pages

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Tailwind CSS 4** - Framework CSS utility-first
- **Wouter** - Router minimalista para React
- **tRPC** - Type-safe API calls
- **shadcn/ui** - Componentes UI acessíveis e customizáveis

### Backend
- **Express 4** - Framework web para Node.js
- **tRPC 11** - Type-safe API layer
- **Drizzle ORM** - ORM TypeScript-first para SQL
- **Cloudflare D1** - Banco de dados SQL serverless
- **Cloudflare R2** - Armazenamento de objetos (S3-compatible)

### Infraestrutura
- **Cloudflare Pages** - Hospedagem serverless
- **Cloudflare Workers** - Compute serverless
- **GitHub** - Versionamento de código
- **pnpm** - Gerenciador de pacotes

## 📁 Estrutura do Projeto

```
gente-networking-lps/
├── client/                    # Frontend React
│   ├── public/               # Assets estáticos
│   │   ├── images/          # Imagens do projeto
│   │   └── _redirects       # Configuração de rotas SPA
│   └── src/
│       ├── components/      # Componentes reutilizáveis
│       ├── pages/          # Páginas da aplicação
│       │   ├── Home.tsx    # Página inicial (hub)
│       │   ├── Participe.tsx  # LP Participe
│       │   ├── GenteHub.tsx   # LP Gente HUB
│       │   └── Admin.tsx      # Dashboard admin
│       ├── lib/            # Utilitários
│       └── App.tsx         # Configuração de rotas
├── server/                   # Backend Express + tRPC
│   ├── routers.ts          # Definição das APIs
│   ├── db.ts               # Helpers de banco de dados
│   └── cloudflare-r2.ts    # Integração com R2
├── drizzle/                 # Schema e migrações do banco
│   └── schema.ts           # Definição das tabelas
├── CLOUDFLARE-SETUP.md     # Guia de deploy no Cloudflare
└── README.md               # Este arquivo
```

## 🎨 Identidade Visual

O projeto segue a identidade visual do Gente Networking:

- **Cor Primária**: `#1E5A96` (Azul Gente)
- **Cor Secundária**: `#FFA500` (Laranja)
- **Tipografia**: Inter (Google Fonts)
- **Logos**: Disponíveis em `/client/public/images/`

## 🛠️ Instalação Local

### Pré-requisitos

- Node.js 22+
- pnpm 10+
- Git

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/objetivatech/ranktopseo.git
cd ranktopseo

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 4. Executar migrações do banco
pnpm db:push

# 5. Iniciar servidor de desenvolvimento
pnpm dev

# 6. Acessar no navegador
# http://localhost:3000
```

## 📦 Deploy no Cloudflare

Para fazer deploy no Cloudflare Pages com integração D1 e R2, siga o guia completo:

👉 **[CLOUDFLARE-SETUP.md](./CLOUDFLARE-SETUP.md)**

O guia inclui:
- Configuração do Cloudflare D1 (banco de dados)
- Configuração do Cloudflare R2 (armazenamento)
- Deploy automático via GitHub
- Configuração de domínios personalizados
- Variáveis de ambiente
- Troubleshooting

## 🔐 Acesso ao Dashboard Administrativo

Após o deploy, acesse o dashboard em:

```
https://seu-dominio.com/admin
```

### Promover Usuário a Admin

Por padrão, novos usuários têm role `user`. Para promover a `admin`:

```sql
-- Execute no Console do Cloudflare D1
UPDATE users SET role = 'admin' WHERE email = 'seu@email.com';
```

## 📊 Funcionalidades

### Landing Page /participe

- ✅ Hero section com proposta de valor clara
- ✅ Seção de benefícios do networking estruturado
- ✅ Dinâmicas do Gente (como funciona)
- ✅ Depoimentos de membros
- ✅ Formulário de inscrição (nome, email, WhatsApp, empresa, segmento)
- ✅ Elementos de urgência (vagas limitadas)
- ✅ FAQ
- ✅ Seção do fundador Eduardo Mendonça
- ✅ CTAs estratégicos

### Landing Page /gentehub

- ✅ Hero section com destaque do evento
- ✅ Countdown de vagas disponíveis
- ✅ Seção da palestra TedX (18min)
- ✅ Agenda detalhada do evento
- ✅ Descrição das rodadas de negócios
- ✅ Testemunhos de participantes anteriores
- ✅ Formulário de inscrição
- ✅ FAQ específica do evento
- ✅ Elementos de urgência

### Dashboard Administrativo

- ✅ Autenticação com controle de acesso (role-based)
- ✅ Visualização de leads capturados
- ✅ Estatísticas (total de leads, novos, por origem)
- ✅ Gerenciamento de eventos futuros
- ✅ Gerenciamento de depoimentos
- ✅ Gerenciamento de FAQs
- ✅ Interface responsiva e intuitiva

### Sistema de Captura de Leads

- ✅ Validação de formulários
- ✅ Armazenamento no Cloudflare D1
- ✅ Notificações para o proprietário
- ✅ Tracking de origem (participe vs gentehub)
- ✅ Status de leads (new, contacted, converted, archived)

### Otimização SEO

- ✅ Meta tags dinâmicas (title, description)
- ✅ Open Graph tags para redes sociais
- ✅ Tags alt para todas as imagens
- ✅ Structured data (Schema.org)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Performance otimizada (Lighthouse 90+)

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Verificar tipos TypeScript
pnpm check
```

## 📝 Scripts Disponíveis

```bash
pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Build para produção
pnpm start        # Inicia servidor de produção
pnpm check        # Verifica tipos TypeScript
pnpm test         # Executa testes
pnpm db:push      # Executa migrações do banco
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade do **Gente Networking** e está sob licença MIT.

## 📞 Contato

**Gente Networking**  
Website: [https://gentenetworking.com.br](https://gentenetworking.com.br)  
Email: contato@gentenetworking.com.br

---

**Desenvolvido com ❤️ por Manus AI**
