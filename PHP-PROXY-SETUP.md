# Proxy PHP para Landing Pages - Guia de Instalação

Este documento fornece instruções completas para instalar e configurar o proxy PHP que permite acessar as landing pages `/participe` e `/gentehub` mantendo a URL `gentenetworking.com.br`, com total compatibilidade para pixels de rastreamento do Meta Ads e Google Ads.

## 🎯 Objetivo

Fazer com que as URLs `https://gentenetworking.com.br/participe` e `https://gentenetworking.com.br/gentehub` sirvam o conteúdo hospedado no Cloudflare Pages (`lps.gentenetworking.com.br`), mantendo a URL original no navegador e preservando a funcionalidade de pixels de rastreamento.

## ✅ Vantagens desta Solução

Esta solução utiliza proxy reverso via PHP com cURL, oferecendo as seguintes vantagens em relação a outras abordagens:

**Comparado ao Proxy Apache (mod_proxy):**
- ✅ Funciona em hospedagens compartilhadas cPanel
- ✅ Não requer módulos especiais do Apache
- ✅ Pode ser implementado sem acesso root

**Comparado ao iFrame:**
- ✅ Pixels de rastreamento funcionam corretamente
- ✅ Google Analytics conta as visitas corretamente
- ✅ Meta Pixel dispara eventos normalmente
- ✅ Melhor para SEO (conteúdo indexável)
- ✅ Sem problemas de responsividade

**Comparado ao Redirect 301:**
- ✅ URL permanece como `gentenetworking.com.br`
- ✅ Mantém a autoridade do domínio principal
- ✅ Melhor experiência do usuário

## 📋 Pré-requisitos

Antes de iniciar a instalação, verifique se seu servidor atende aos seguintes requisitos:

- ✅ PHP 7.0 ou superior
- ✅ Extensão cURL habilitada (padrão na maioria dos servidores)
- ✅ Acesso ao cPanel ou Gerenciador de Arquivos
- ✅ Permissão para editar `.htaccess`
- ✅ Subdomínio `lps.gentenetworking.com.br` já configurado e funcionando

### Verificar se cURL está Habilitado

Para verificar se o cURL está habilitado no seu servidor:

1. Crie um arquivo chamado `info.php` na raiz do site
2. Adicione o seguinte conteúdo:
   ```php
   <?php phpinfo(); ?>
   ```
3. Acesse `https://gentenetworking.com.br/info.php`
4. Procure por "cURL" na página
5. **IMPORTANTE**: Após verificar, delete o arquivo `info.php` por segurança

Se cURL não estiver habilitado, entre em contato com o suporte do seu provedor de hospedagem.

## 📦 Arquivos Necessários

A solução consiste em 3 arquivos:

| Arquivo | Descrição | Localização |
|---------|-----------|-------------|
| `participe.php` | Script de proxy para /participe | Raiz do site (public_html) |
| `gentehub.php` | Script de proxy para /gentehub | Raiz do site (public_html) |
| `.htaccess` | Configuração de roteamento | Raiz do site (public_html) |

Todos os arquivos estão disponíveis no diretório `php-proxy/` do repositório GitHub.

## 🚀 Instalação Passo a Passo

### Passo 1: Fazer Backup

Antes de fazer qualquer alteração, faça backup dos arquivos atuais:

1. Acesse o cPanel
2. Vá em **Gerenciador de Arquivos**
3. Navegue até `public_html` (ou diretório raiz do site)
4. Localize o arquivo `.htaccess`
5. Clique com botão direito → **Copiar**
6. Renomeie a cópia para `.htaccess.backup-AAAAMMDD` (substitua pela data atual)

### Passo 2: Fazer Upload dos Scripts PHP

1. Acesse o repositório GitHub: https://github.com/objetivatech/gente-networking-lps
2. Navegue até a pasta `php-proxy/`
3. Baixe os arquivos:
   - `participe.php`
   - `gentehub.php`

4. No cPanel, vá em **Gerenciador de Arquivos**
5. Navegue até `public_html` (raiz do site)
6. Clique em **Upload** (canto superior direito)
7. Selecione os dois arquivos PHP baixados
8. Aguarde o upload completar

### Passo 3: Configurar Permissões

Os arquivos PHP precisam ter permissões corretas para funcionar:

1. No Gerenciador de Arquivos, localize `participe.php`
2. Clique com botão direito → **Permissões**
3. Defina como `644` (ou marque: Owner: Read+Write, Group: Read, World: Read)
4. Clique em **Alterar Permissões**
5. Repita o processo para `gentehub.php`

### Passo 4: Atualizar o .htaccess

Agora vamos adicionar as regras de roteamento no `.htaccess`:

**Opção A - Edição Manual (Recomendada):**

1. No Gerenciador de Arquivos, localize o arquivo `.htaccess`
2. Clique com botão direito → **Editar**
3. Localize a linha `# BEGIN WordPress`
4. **ANTES** desta linha, adicione o seguinte bloco:

```apache
# ============================================================================
# PROXY PHP PARA LANDING PAGES
# Redireciona /participe e /gentehub para scripts PHP que fazem proxy
# ============================================================================
<IfModule mod_rewrite.c>
RewriteEngine On

# Landing Page /participe
RewriteRule ^participe(/.*)?$ /participe.php [L,QSA]

# Landing Page /gentehub
RewriteRule ^gentehub(/.*)?$ /gentehub.php [L,QSA]

</IfModule>
# ============================================================================
```

5. Salve o arquivo

**Opção B - Substituição Completa:**

1. Baixe o arquivo `htaccess-php-proxy.txt` do repositório
2. Copie TODO o conteúdo
3. No Gerenciador de Arquivos, edite o `.htaccess`
4. Substitua TODO o conteúdo pelo arquivo baixado
5. Salve

### Passo 5: Testar a Instalação

Após concluir a instalação, teste as landing pages:

1. Abra uma aba anônima no navegador (Ctrl+Shift+N no Chrome)
2. Acesse: `https://gentenetworking.com.br/participe`
3. Verifique se a página carrega corretamente
4. Verifique se a URL permanece como `gentenetworking.com.br/participe`
5. Repita o teste para: `https://gentenetworking.com.br/gentehub`

## 🔍 Verificação de Funcionamento

Para garantir que tudo está funcionando corretamente, verifique os seguintes pontos:

### Checklist de Verificação

- [ ] Landing page /participe carrega sem erros
- [ ] Landing page /gentehub carrega sem erros
- [ ] URL permanece como `gentenetworking.com.br` (não muda para `lps.`)
- [ ] Imagens e CSS carregam corretamente
- [ ] Formulários funcionam normalmente
- [ ] Site principal WordPress continua funcionando
- [ ] Outras páginas do WordPress não foram afetadas

### Teste de Pixels de Rastreamento

Para verificar se os pixels estão funcionando:

**Meta Pixel (Facebook):**
1. Instale a extensão "Meta Pixel Helper" no Chrome
2. Acesse a landing page
3. Clique no ícone da extensão
4. Verifique se o pixel está disparando corretamente

**Google Analytics:**
1. Acesse o Google Analytics
2. Vá em "Tempo Real" → "Visão Geral"
3. Acesse a landing page em outra aba
4. Verifique se a visita aparece no relatório em tempo real

## 🛠️ Solução de Problemas

### Erro 500 - Internal Server Error

**Causa**: Sintaxe incorreta no `.htaccess` ou permissões incorretas nos arquivos PHP.

**Solução**:
1. Restaure o backup do `.htaccess`
2. Verifique se copiou o código corretamente (sem caracteres extras)
3. Verifique as permissões dos arquivos PHP (devem ser 644)
4. Verifique os logs de erro do PHP no cPanel (se disponível)

### Página em Branco

**Causa**: cURL não está habilitado ou há erro no script PHP.

**Solução**:
1. Verifique se cURL está habilitado (veja seção "Pré-requisitos")
2. Ative a exibição de erros PHP temporariamente:
   - Adicione no início do arquivo PHP:
     ```php
     error_reporting(E_ALL);
     ini_set('display_errors', 1);
     ```
   - Acesse a página e veja o erro exibido
   - **IMPORTANTE**: Remova essas linhas após identificar o erro

### Erro 404 - Página Não Encontrada

**Causa**: Regras do `.htaccess` não estão sendo aplicadas ou estão na ordem errada.

**Solução**:
1. Verifique se o bloco de proxy está **ANTES** do `# BEGIN WordPress`
2. Verifique se os arquivos PHP estão na raiz do site (não em subpasta)
3. Limpe o cache do navegador e teste novamente
4. Limpe o cache do LiteSpeed Cache (se aplicável)

### Imagens ou CSS Não Carregam

**Causa**: URLs relativas não estão sendo ajustadas corretamente.

**Solução**:
1. Abra o arquivo PHP no editor
2. Localize a seção de processamento de URLs (final do arquivo)
3. Verifique se as linhas de `str_replace` estão corretas
4. Se necessário, adicione mais regras de substituição

### Site Principal Para de Funcionar

**Causa**: Regras do proxy estão interferindo com o WordPress.

**Solução**:
1. Restaure o backup do `.htaccess` imediatamente
2. Verifique se você adicionou o bloco **ANTES** do `# BEGIN WordPress`
3. Certifique-se de que não alterou nada dentro dos blocos do WordPress
4. Tente novamente com mais cuidado

### Pixels Não Disparam

**Causa**: Scripts de terceiros podem estar sendo bloqueados ou não carregados.

**Solução**:
1. Abra o Console do Navegador (F12)
2. Vá na aba "Network"
3. Recarregue a página
4. Procure por erros de carregamento de scripts
5. Se encontrar erros, pode ser necessário ajustar as regras de substituição de URL no PHP

## 🔐 Segurança

### Recomendações de Segurança

Esta solução foi desenvolvida com segurança em mente, mas é importante seguir estas recomendações:

**1. Validação de URLs:**
Os scripts PHP já incluem validação básica, mas você pode adicionar validação extra se necessário.

**2. Timeout de Requisições:**
O timeout está configurado para 30 segundos. Se as páginas forem muito pesadas, você pode aumentar:
```php
CURLOPT_TIMEOUT => 60, // Aumentar para 60 segundos
```

**3. Headers de Segurança:**
Os scripts já filtram headers problemáticos, mas você pode adicionar headers de segurança adicionais se desejar.

**4. Cache:**
Considere implementar cache para melhorar performance:
- Use o cache do LiteSpeed Cache (se disponível)
- Ou implemente cache em arquivo no PHP

**5. Monitoramento:**
- Monitore os logs de erro do PHP regularmente
- Fique atento a picos de uso de CPU/memória

## ⚡ Otimizações de Performance

### Cache de Conteúdo

Para melhorar a performance, você pode implementar cache das respostas:

```php
// Adicionar no início do arquivo PHP, após as configurações
$cache_file = '/tmp/cache_participe_' . md5($full_url);
$cache_time = 300; // 5 minutos

if (file_exists($cache_file) && (time() - filemtime($cache_file)) < $cache_time) {
    echo file_get_contents($cache_file);
    exit;
}

// ... resto do código ...

// Antes do echo $body; adicionar:
file_put_contents($cache_file, $body);
```

### Compressão Gzip

O script já aceita compressão gzip automaticamente através da opção `CURLOPT_ENCODING`.

### CDN e Cache do Cloudflare

Como o Cloudflare já está sendo usado, aproveite o cache dele:
- As páginas no `lps.gentenetworking.com.br` já são cacheadas
- O proxy PHP busca do cache do Cloudflare
- Resultado: performance excelente

## 📊 Compatibilidade com Anúncios

### Meta Ads (Facebook/Instagram)

Esta solução é **totalmente compatível** com Meta Ads:

✅ **Meta Pixel funciona normalmente**
- O pixel é carregado no contexto da página principal
- Eventos são disparados corretamente
- Conversões são rastreadas

✅ **Conversions API**
- Se você usar a Conversions API, continue usando normalmente
- O servidor pode enviar eventos diretamente para o Facebook

### Google Ads

Esta solução é **totalmente compatível** com Google Ads:

✅ **Google Analytics funciona normalmente**
- Pageviews são contados corretamente
- Eventos são rastreados
- Conversões são registradas

✅ **Google Tag Manager**
- Todos os tags disparam normalmente
- Datalay funciona corretamente

✅ **Google Ads Conversion Tracking**
- Tags de conversão funcionam normalmente
- Remarketing funciona corretamente

### Outras Plataformas

A solução também é compatível com:
- ✅ LinkedIn Ads
- ✅ TikTok Ads
- ✅ Twitter Ads
- ✅ Hotjar / Crazy Egg
- ✅ Qualquer pixel/script de terceiros

## 🎯 Uso em Campanhas

### URLs Recomendadas para Anúncios

Você pode usar qualquer uma destas URLs em seus anúncios:

**Opção 1 - URL Principal (Recomendada):**
```
https://gentenetworking.com.br/participe
https://gentenetworking.com.br/gentehub
```

**Opção 2 - URL Direta:**
```
https://lps.gentenetworking.com.br/participe
https://lps.gentenetworking.com.br/gentehub
```

Ambas funcionam perfeitamente. A Opção 1 é recomendada por manter a consistência da marca.

### Parâmetros UTM

Você pode adicionar parâmetros UTM normalmente:

```
https://gentenetworking.com.br/participe?utm_source=facebook&utm_medium=cpc&utm_campaign=leads_jan2026
```

Os parâmetros serão preservados e o Google Analytics rastreará corretamente.

## 📈 Monitoramento e Análise

### Google Analytics

Para verificar se o Google Analytics está funcionando:

1. Acesse o Google Analytics
2. Vá em "Tempo Real" → "Conteúdo"
3. Acesse a landing page
4. Verifique se aparece como `/participe` ou `/gentehub`

### Meta Pixel

Para verificar eventos do Meta Pixel:

1. Acesse o Gerenciador de Eventos do Facebook
2. Selecione seu pixel
3. Vá em "Testar Eventos"
4. Acesse a landing page
5. Verifique se os eventos aparecem em tempo real

## 🔄 Manutenção

### Atualizações das Landing Pages

Quando você atualizar as landing pages no Cloudflare Pages:

1. As alterações aparecerão automaticamente
2. Não é necessário alterar nada no servidor WordPress
3. O proxy buscará a versão mais recente automaticamente

### Limpeza de Cache

Se implementou cache no PHP, limpe quando necessário:

```bash
rm /tmp/cache_participe_*
rm /tmp/cache_gentehub_*
```

Ou adicione um parâmetro na URL para forçar atualização:
```
https://gentenetworking.com.br/participe?nocache=1
```

## ✅ Checklist Final

Antes de considerar a instalação concluída:

- [ ] Backup do `.htaccess` foi feito
- [ ] Arquivos PHP foram enviados para a raiz do site
- [ ] Permissões dos arquivos PHP estão corretas (644)
- [ ] Regras foram adicionadas ao `.htaccess`
- [ ] Landing page /participe abre corretamente
- [ ] Landing page /gentehub abre corretamente
- [ ] URL permanece como `gentenetworking.com.br`
- [ ] Site principal WordPress funciona normalmente
- [ ] Imagens e CSS carregam corretamente
- [ ] Formulários funcionam
- [ ] Meta Pixel está disparando (se aplicável)
- [ ] Google Analytics está rastreando (se aplicável)
- [ ] Testado em modo anônimo do navegador
- [ ] Testado em dispositivo móvel

## 🆘 Suporte

Se encontrar problemas que não consegue resolver:

1. Verifique a seção "Solução de Problemas" acima
2. Consulte os logs de erro do PHP no cPanel
3. Entre em contato com o suporte do seu provedor de hospedagem
4. Verifique se há atualizações no repositório GitHub

## 📚 Arquivos de Referência

Todos os arquivos necessários estão no repositório GitHub:

- `php-proxy/participe.php` - Script de proxy para /participe
- `php-proxy/gentehub.php` - Script de proxy para /gentehub
- `php-proxy/htaccess-php-proxy.txt` - Configuração do .htaccess
- `PHP-PROXY-SETUP.md` - Este documento

**Repositório**: https://github.com/objetivatech/gente-networking-lps

## 🎉 Conclusão

Após seguir este guia, você terá as landing pages funcionando perfeitamente em `gentenetworking.com.br/participe` e `gentenetworking.com.br/gentehub`, mantendo a URL original e com total compatibilidade para pixels de rastreamento de anúncios.

Esta solução oferece o melhor dos dois mundos:
- ✅ Hospedagem moderna no Cloudflare Pages
- ✅ URL do domínio principal para autoridade e branding
- ✅ Compatibilidade total com pixels de rastreamento
- ✅ Funciona em hospedagem compartilhada cPanel

---

**Criado por**: Manus AI  
**Data**: Janeiro 2026  
**Projeto**: Gente Networking Landing Pages  
**Versão**: 1.0
