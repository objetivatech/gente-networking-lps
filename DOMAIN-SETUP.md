# Configuração de Domínio e Subpastas - Gente Networking Landing Pages

Este guia detalha como configurar o deploy das landing pages `/participe` e `/gentehub` **sem substituir** o site principal `https://gentenetworking.com.br`.

## 🎯 Objetivo

Garantir que as landing pages sejam acessíveis em:
- `https://gentenetworking.com.br/participe`
- `https://gentenetworking.com.br/gentehub`

**SEM** interferir no site principal que já está publicado em `https://gentenetworking.com.br`.

## ⚠️ Problema a Evitar

Se você simplesmente adicionar o domínio `gentenetworking.com.br` ao Cloudflare Pages, **TODAS as requisições** serão direcionadas para o novo projeto, substituindo completamente o site principal. Isso NÃO é o que queremos!

## 📋 Opções de Implementação

Existem **3 abordagens** para implementar as landing pages sem afetar o site principal:

### Opção 1: Subdomínio Separado + Proxy (Recomendada) ⭐

Esta é a abordagem mais segura e profissional.

**Como funciona:**
1. Deploy das landing pages em um subdomínio separado (ex: `lps.gentenetworking.com.br`)
2. Configurar proxy reverso no servidor principal para redirecionar `/participe` e `/gentehub`

**Vantagens:**
- ✅ Zero risco de substituir o site principal
- ✅ Isolamento completo entre site principal e landing pages
- ✅ Fácil de gerenciar e fazer rollback
- ✅ Permite diferentes tecnologias em cada projeto

**Desvantagens:**
- ⚠️ Requer acesso ao servidor do site principal
- ⚠️ Necessita configuração de proxy reverso

#### Passo a Passo - Opção 1

##### 1. Deploy no Cloudflare Pages com Subdomínio

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vá em **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Selecione o repositório `objetivatech/gente-networking-lps`
4. Configure o build:
   ```
   Build command: pnpm build
   Build output directory: client/dist
   Root directory: /
   ```
5. Clique em **Save and Deploy**
6. Após o deploy, vá em **Custom domains** → **Set up a custom domain**
7. Adicione o subdomínio: `lps.gentenetworking.com.br`
8. O Cloudflare criará automaticamente um registro CNAME no DNS

##### 2. Configurar DNS no Cloudflare

O Cloudflare criará automaticamente:
```
Type: CNAME
Name: lps
Content: gente-networking-lps.pages.dev
Proxy status: Proxied (laranja)
```

Aguarde a propagação do DNS (geralmente 5-15 minutos).

##### 3. Configurar Proxy Reverso no Servidor Principal

Agora você precisa configurar o servidor do site principal (`gentenetworking.com.br`) para redirecionar as rotas `/participe` e `/gentehub` para o subdomínio.

**Se o site principal usa Apache:**

Adicione no arquivo `.htaccess` ou na configuração do VirtualHost:

```apache
# Proxy para landing pages
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    
    # Landing page /participe
    ProxyPass /participe https://lps.gentenetworking.com.br/participe
    ProxyPassReverse /participe https://lps.gentenetworking.com.br/participe
    
    # Landing page /gentehub
    ProxyPass /gentehub https://lps.gentenetworking.com.br/gentehub
    ProxyPassReverse /gentehub https://lps.gentenetworking.com.br/gentehub
</IfModule>
```

Certifique-se de que os módulos `mod_proxy` e `mod_proxy_http` estão habilitados:
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl restart apache2
```

**Se o site principal usa Nginx:**

Adicione no arquivo de configuração do site:

```nginx
# Proxy para landing pages
location /participe {
    proxy_pass https://lps.gentenetworking.com.br/participe;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /gentehub {
    proxy_pass https://lps.gentenetworking.com.br/gentehub;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Teste e recarregue a configuração:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

##### 4. Testar

Acesse:
- `https://gentenetworking.com.br/participe` → Deve mostrar a landing page Participe
- `https://gentenetworking.com.br/gentehub` → Deve mostrar a landing page Gente HUB
- `https://gentenetworking.com.br` → Deve mostrar o site principal (inalterado)

---

### Opção 2: Cloudflare Workers para Roteamento

Esta opção usa Cloudflare Workers para interceptar requisições e rotear para o projeto correto.

**Como funciona:**
1. Deploy das landing pages no Cloudflare Pages (sem custom domain)
2. Criar um Cloudflare Worker que intercepta requisições para `/participe` e `/gentehub`
3. O Worker faz proxy para o projeto do Cloudflare Pages

**Vantagens:**
- ✅ Não requer acesso ao servidor principal
- ✅ Tudo gerenciado no Cloudflare
- ✅ Fácil de configurar

**Desvantagens:**
- ⚠️ Consome cota de Workers (10.000 requisições/dia no plano gratuito)
- ⚠️ Adiciona latência mínima (geralmente imperceptível)

#### Passo a Passo - Opção 2

##### 1. Deploy no Cloudflare Pages (Sem Custom Domain)

1. Faça o deploy normal no Cloudflare Pages
2. **NÃO** adicione custom domain
3. Anote a URL do projeto: `https://gente-networking-lps.pages.dev`

##### 2. Criar Cloudflare Worker

1. No Cloudflare Dashboard, vá em **Workers & Pages** → **Create application** → **Create Worker**
2. Nomeie o worker: `gente-networking-router`
3. Cole o código abaixo:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Se a requisição é para /participe ou /gentehub, redirecionar para o Pages
    if (url.pathname.startsWith('/participe') || url.pathname.startsWith('/gentehub')) {
      // URL do projeto no Cloudflare Pages
      const pagesUrl = 'https://gente-networking-lps.pages.dev';
      
      // Construir nova URL mantendo o path e query string
      const newUrl = new URL(url.pathname + url.search, pagesUrl);
      
      // Fazer fetch para o Cloudflare Pages
      const response = await fetch(newUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      
      // Retornar a resposta
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }
    
    // Para todas as outras rotas, fazer fetch para o site principal
    // IMPORTANTE: Substitua pela URL real do seu site principal
    const mainSiteUrl = 'https://seu-site-principal.com';
    const newUrl = new URL(url.pathname + url.search, mainSiteUrl);
    
    return fetch(newUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
  },
};
```

4. Clique em **Save and Deploy**

##### 3. Adicionar Route ao Worker

1. No Worker criado, vá na aba **Triggers** → **Routes** → **Add route**
2. Adicione as rotas:
   ```
   gentenetworking.com.br/participe*
   gentenetworking.com.br/gentehub*
   ```
3. Selecione a zona: `gentenetworking.com.br`
4. Clique em **Add route**

##### 4. Testar

Acesse:
- `https://gentenetworking.com.br/participe`
- `https://gentenetworking.com.br/gentehub`

---

### Opção 3: Subdiretório no Mesmo Servidor (Mais Simples)

Se o site principal está hospedado em um servidor que você controla, a opção mais simples é fazer o build das landing pages e colocá-las diretamente em subdiretórios.

**Como funciona:**
1. Fazer build do projeto localmente
2. Fazer upload dos arquivos para `/participe` e `/gentehub` no servidor

**Vantagens:**
- ✅ Mais simples de implementar
- ✅ Sem custos adicionais
- ✅ Sem dependência de serviços externos

**Desvantagens:**
- ⚠️ Não usa Cloudflare Pages
- ⚠️ Requer acesso FTP/SSH ao servidor
- ⚠️ Deploy manual (sem CI/CD automático)
- ⚠️ Não aproveita os recursos do Cloudflare (D1, R2)

#### Passo a Passo - Opção 3

##### 1. Build Local do Projeto

```bash
# Clonar o repositório
git clone https://github.com/objetivatech/gente-networking-lps.git
cd gente-networking-lps

# Instalar dependências
pnpm install

# Fazer build
pnpm build
```

Os arquivos compilados estarão em `client/dist/`.

##### 2. Configurar Base Path

Antes do build, você precisa configurar o base path para que os assets funcionem corretamente.

Edite o arquivo `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/', // Manter como raiz
  // ... resto da configuração
});
```

E configure o router para funcionar com subpastas. Edite `client/src/App.tsx`:

```typescript
// Adicionar base prop ao Router
<Router base="/participe">
  {/* rotas da landing page participe */}
</Router>

<Router base="/gentehub">
  {/* rotas da landing page gentehub */}
</Router>
```

##### 3. Upload para o Servidor

Faça upload dos arquivos de `client/dist/` para os diretórios correspondentes no servidor:

```
/var/www/gentenetworking.com.br/participe/
/var/www/gentenetworking.com.br/gentehub/
```

##### 4. Configurar .htaccess (se Apache)

Crie um arquivo `.htaccess` em cada subdiretório:

```apache
# /var/www/gentenetworking.com.br/participe/.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /participe/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /participe/index.html [L]
</IfModule>
```

```apache
# /var/www/gentenetworking.com.br/gentehub/.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /gentehub/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /gentehub/index.html [L]
</IfModule>
```

---

## 🎯 Recomendação Final

Para o seu caso específico, recomendo a **Opção 1 (Subdomínio + Proxy)** pelos seguintes motivos:

1. **Segurança**: Zero risco de substituir o site principal
2. **Profissionalismo**: URLs limpas (`gentenetworking.com.br/participe`)
3. **Escalabilidade**: Fácil de adicionar mais landing pages no futuro
4. **Cloudflare**: Aproveita todos os recursos (D1, R2, analytics)
5. **CI/CD**: Deploy automático via GitHub

## 📝 Checklist de Implementação

- [ ] Escolher a opção de implementação (1, 2 ou 3)
- [ ] Fazer deploy no Cloudflare Pages
- [ ] Configurar subdomínio (se Opção 1)
- [ ] Configurar proxy reverso (se Opção 1)
- [ ] Criar e configurar Worker (se Opção 2)
- [ ] Testar acesso às landing pages
- [ ] Verificar que o site principal não foi afetado
- [ ] Configurar Cloudflare D1 e R2
- [ ] Testar formulários e captura de leads
- [ ] Configurar variáveis de ambiente de email

## 🆘 Solução de Problemas

### Landing page não carrega (404)

**Causa**: Roteamento incorreto ou proxy não configurado

**Solução**: 
- Verifique se o proxy reverso está configurado corretamente
- Teste acessando diretamente o subdomínio: `https://lps.gentenetworking.com.br/participe`
- Verifique os logs do servidor principal

### Site principal foi substituído

**Causa**: Custom domain adicionado incorretamente no Cloudflare Pages

**Solução**:
1. Vá no Cloudflare Pages → Projeto → Custom domains
2. Remova o domínio `gentenetworking.com.br`
3. Adicione apenas o subdomínio `lps.gentenetworking.com.br`

### Assets não carregam (CSS/JS)

**Causa**: Base path incorreto

**Solução**:
- Verifique se o `base` no `vite.config.ts` está correto
- Se usar Opção 3, certifique-se de que os paths estão relativos

### Erro de CORS

**Causa**: Headers de proxy não configurados

**Solução**:
- Adicione os headers corretos no proxy reverso (veja exemplos acima)
- Certifique-se de que `proxy_set_header Host $host` está presente

## 📚 Referências

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Apache mod_proxy Documentation](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html)
- [Nginx Reverse Proxy Guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

## 💡 Dicas Finais

1. **Sempre faça backup** do site principal antes de fazer alterações
2. **Teste em ambiente de staging** antes de aplicar em produção
3. **Use o subdomínio** para testes antes de configurar o proxy
4. **Monitore os logs** do servidor após a configuração
5. **Documente** todas as alterações feitas no servidor principal
