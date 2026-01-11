# Solução: Proxy Reverso com WordPress + LiteSpeed

Este documento explica como configurar o proxy reverso para as landing pages `/participe` e `/gentehub` em um servidor que já hospeda um site WordPress com LiteSpeed Cache.

## 🔍 Problema Identificado

Quando você tentava acessar `https://gentenetworking.com.br/participe` ou `/gentehub`, recebia erro 404, mesmo com o proxy configurado no `.htaccess`.

**Causa raiz**: As regras de rewrite do WordPress estavam capturando as requisições ANTES do proxy funcionar. O WordPress redireciona todas as URLs que não correspondem a arquivos ou diretórios físicos para `/index.php`, e como `/participe` e `/gentehub` não existem fisicamente no servidor, o WordPress processava essas rotas e retornava 404.

## ✅ Solução

A solução envolve adicionar **exceções** nas regras de rewrite do WordPress para que `/participe` e `/gentehub` sejam ignoradas pelo WordPress e processadas pelo proxy reverso.

## 📋 Passo a Passo

### 1. Fazer Backup do .htaccess Atual

Antes de fazer qualquer alteração, faça backup do arquivo `.htaccess` atual:

1. Acesse o cPanel
2. Vá em **Gerenciador de Arquivos**
3. Navegue até a raiz do site (`public_html` ou equivalente)
4. Clique com botão direito no arquivo `.htaccess`
5. Selecione **Copiar**
6. Renomeie a cópia para `.htaccess.backup`

### 2. Editar o .htaccess

Localize a seção **BEGIN WordPress** no seu `.htaccess`. Ela se parece com isto:

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

### 3. Adicionar Exceções para as Landing Pages

**IMEDIATAMENTE APÓS** a linha `RewriteBase /` e **ANTES** da linha `RewriteRule ^index\.php$ - [L]`, adicione estas duas linhas:

```apache
RewriteRule ^participe(/.*)?$ - [L,PT]
RewriteRule ^gentehub(/.*)?$ - [L,PT]
```

O resultado final deve ficar assim:

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /

# EXCEÇÕES PARA LANDING PAGES
RewriteRule ^participe(/.*)?$ - [L,PT]
RewriteRule ^gentehub(/.*)?$ - [L,PT]

RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

### 4. Mover o Proxy para DEPOIS do WordPress

Certifique-se de que a configuração do proxy está **DEPOIS** da seção `# END WordPress`:

```apache
# END WordPress

# PROXY REVERSO PARA LANDING PAGES
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    SSLProxyEngine On
    
    # Landing page /participe
    ProxyPass /participe https://lps.gentenetworking.com.br/participe
    ProxyPassReverse /participe https://lps.gentenetworking.com.br/participe
    
    # Landing page /gentehub
    ProxyPass /gentehub https://lps.gentenetworking.com.br/gentehub
    ProxyPassReverse /gentehub https://lps.gentenetworking.com.br/gentehub
</IfModule>
```

### 5. Adicionar SSLProxyEngine

Note que adicionamos a diretiva `SSLProxyEngine On` na configuração do proxy. Isso é necessário porque o subdomínio usa HTTPS.

### 6. Salvar e Testar

1. Salve o arquivo `.htaccess`
2. Aguarde alguns segundos para o servidor processar as mudanças
3. Teste acessando:
   - `https://gentenetworking.com.br/participe`
   - `https://gentenetworking.com.br/gentehub`

## 📝 Arquivo .htaccess Completo

Para facilitar, criamos um arquivo `.htaccess` completo e corrigido no repositório: `htaccess-wordpress-proxy.txt`

Você pode simplesmente copiar todo o conteúdo desse arquivo e substituir o seu `.htaccess` atual (após fazer backup).

## 🔧 Como Funciona

### Explicação das Regras

**1. Exceções do WordPress:**
```apache
RewriteRule ^participe(/.*)?$ - [L,PT]
RewriteRule ^gentehub(/.*)?$ - [L,PT]
```

- `^participe(/.*)?$` - Captura `/participe` e qualquer coisa depois (como `/participe/teste`)
- `-` - Não faz nenhuma reescrita
- `[L,PT]` - **L** (Last) = para de processar regras de rewrite, **PT** (Pass Through) = passa a requisição para o próximo handler (o proxy)

**2. Proxy Reverso:**
```apache
ProxyPass /participe https://lps.gentenetworking.com.br/participe
ProxyPassReverse /participe https://lps.gentenetworking.com.br/participe
```

- `ProxyPass` - Redireciona a requisição para o subdomínio
- `ProxyPassReverse` - Ajusta os headers de resposta para que funcionem corretamente
- `ProxyPreserveHost On` - Mantém o host original na requisição
- `SSLProxyEngine On` - Habilita proxy para URLs HTTPS

## 🆘 Solução de Problemas

### Ainda recebo erro 404

**Possíveis causas:**

1. **Módulos do Apache não habilitados** - Entre em contato com o suporte do cPanel e peça para habilitar:
   - `mod_proxy`
   - `mod_proxy_http`
   - `mod_ssl`

2. **Cache do navegador** - Limpe o cache do navegador ou teste em modo anônimo

3. **Cache do LiteSpeed** - Limpe o cache do LiteSpeed Cache:
   - Acesse o painel do WordPress
   - Vá em **LiteSpeed Cache** → **Toolbox** → **Purge All**

4. **Ordem das regras incorreta** - Verifique se as exceções estão ANTES das regras do WordPress

### Erro 500 Internal Server Error

**Causa**: Sintaxe incorreta no `.htaccess`

**Solução**:
1. Restaure o backup do `.htaccess`
2. Verifique se não há erros de digitação
3. Certifique-se de que não há linhas duplicadas

### O site principal parou de funcionar

**Causa**: Alteração acidental nas regras do WordPress

**Solução**:
1. Restaure o backup do `.htaccess`
2. Siga o passo a passo com mais atenção
3. Adicione APENAS as duas linhas de exceção, sem alterar nada mais

### Módulos de proxy não disponíveis no cPanel

Se o seu provedor não permite habilitar `mod_proxy`, você terá que usar uma das outras opções documentadas em `DOMAIN-SETUP.md`:

- **Opção 2**: Cloudflare Workers para roteamento
- **Opção 3**: Subdiretório no mesmo servidor (sem Cloudflare Pages)

## 📚 Referências Técnicas

### Flags do mod_rewrite

- `L` (Last) - Para de processar regras de rewrite após esta regra
- `PT` (Pass Through) - Passa a URL reescrita para o próximo handler (como mod_proxy)
- `R` (Redirect) - Faz um redirect HTTP (não usado aqui)

### Ordem de Processamento do Apache

1. **mod_rewrite** processa as regras de reescrita
2. Se a flag `PT` estiver presente, passa para o próximo handler
3. **mod_proxy** processa as diretivas ProxyPass
4. A requisição é enviada para o servidor de destino

### Por que a ordem importa

As regras do Apache são processadas de cima para baixo. Se o WordPress capturar a requisição primeiro (sem a flag `PT`), o proxy nunca será executado. Por isso, adicionamos as exceções ANTES das regras do WordPress.

## ✅ Checklist de Verificação

Antes de considerar a configuração concluída, verifique:

- [ ] Backup do `.htaccess` original foi feito
- [ ] Exceções adicionadas na seção WordPress
- [ ] Proxy configurado DEPOIS da seção WordPress
- [ ] `SSLProxyEngine On` está presente
- [ ] Arquivo `.htaccess` salvo corretamente
- [ ] Cache do navegador limpo
- [ ] Cache do LiteSpeed limpo
- [ ] `/participe` abre corretamente
- [ ] `/gentehub` abre corretamente
- [ ] Site principal continua funcionando
- [ ] Formulários das landing pages funcionam

## 💡 Dicas Finais

1. **Sempre faça backup** antes de editar o `.htaccess`
2. **Teste em modo anônimo** para evitar cache do navegador
3. **Não edite dentro dos blocos** marcados como "Do not edit"
4. **Mantenha comentários** para facilitar futuras manutenções
5. **Documente alterações** para referência futura

## 🎯 Resultado Esperado

Após aplicar esta configuração:

- ✅ `https://gentenetworking.com.br` - Site principal WordPress (inalterado)
- ✅ `https://gentenetworking.com.br/participe` - Landing page Participe (via proxy)
- ✅ `https://gentenetworking.com.br/gentehub` - Landing page Gente HUB (via proxy)
- ✅ `https://lps.gentenetworking.com.br/participe` - Acesso direto (continua funcionando)
- ✅ `https://lps.gentenetworking.com.br/gentehub` - Acesso direto (continua funcionando)

---

**Criado por**: Manus AI  
**Data**: Janeiro 2026  
**Projeto**: Gente Networking Landing Pages
