# 📊 Configuração do Umami Analytics (Opcional)

O Umami é um sistema de analytics open-source, focado em privacidade, que substitui o Google Analytics.

## ⚠️ Importante

A configuração do Umami é **100% opcional**. O site funciona perfeitamente sem ele. Se você não configurar, os warnings no build são normais e podem ser ignorados.

---

## 🎯 O que você precisa

Para ativar o Umami Analytics, você precisa de **2 variáveis de ambiente**:

1. **`VITE_ANALYTICS_ENDPOINT`**: URL do servidor Umami
2. **`VITE_ANALYTICS_WEBSITE_ID`**: ID do seu site no Umami (você já tem)

---

## 🔧 Como Configurar

### Passo 1: Identificar o Endpoint do Umami

**Se você usa Umami Cloud (cloud.umami.is):**
```
VITE_ANALYTICS_ENDPOINT=https://cloud.umami.is
```

**Se você usa Umami self-hosted:**
```
VITE_ANALYTICS_ENDPOINT=https://seu-dominio-umami.com
```

**Se você usa Analytics.umami.is (versão antiga):**
```
VITE_ANALYTICS_ENDPOINT=https://analytics.umami.is
```

### Passo 2: Adicionar Variáveis no Cloudflare Pages

1. Acesse: **Workers & Pages** → **gente-networking-lps**
2. Vá em **Settings** → **Environment variables**
3. Clique em **Add variables**
4. Adicione as duas variáveis:

**Variável 1:**
- **Variable name**: `VITE_ANALYTICS_ENDPOINT`
- **Value**: `https://cloud.umami.is` (ou seu endpoint)
- **Environment**: Marque **Production** e **Preview**

**Variável 2:**
- **Variable name**: `VITE_ANALYTICS_WEBSITE_ID`
- **Value**: `<seu-website-id-do-umami>`
- **Environment**: Marque **Production** e **Preview**

5. Clique em **Save**

### Passo 3: Fazer Redeploy

Após adicionar as variáveis, faça um redeploy:

```bash
git commit --allow-empty -m "trigger: Redeploy com Umami configurado"
git push github main
```

Ou pelo dashboard:
1. Vá em **Deployments**
2. Clique nos **3 pontinhos** do último deploy
3. Clique em **Retry deployment**

---

## 🧪 Testando

Após o deploy:

1. Acesse seu site: `https://lps.gentenetworking.com.br`
2. Abra o **DevTools** (F12)
3. Vá na aba **Network**
4. Procure por requisições para `script.js` do Umami
5. Se aparecer, o Umami está funcionando! ✅

Você também pode verificar no dashboard do Umami se as visitas estão sendo registradas.

---

## ❌ Desativar Umami

Se você **não quer usar** o Umami:

1. **Não adicione** as variáveis `VITE_ANALYTICS_*` no Cloudflare Pages
2. Os warnings no build vão continuar aparecendo, mas são **inofensivos**
3. O script Umami simplesmente não será carregado no site

O código já está preparado para funcionar sem o Umami!

---

## 📚 Mais Informações

- [Umami Cloud](https://cloud.umami.is)
- [Umami Docs](https://umami.is/docs)
- [Como obter Website ID](https://umami.is/docs/add-a-website)

---

## 🔍 Troubleshooting

### Warning no build: "VITE_ANALYTICS_ENDPOINT is not defined"

**É normal!** Se você não configurou as variáveis, esse warning vai aparecer. Pode ignorar.

### Script Umami não carrega

1. Verifique se as variáveis estão configuradas no Cloudflare Pages
2. Verifique se o endpoint está correto (com `https://`)
3. Verifique se o Website ID está correto
4. Faça um redeploy após adicionar as variáveis

### Analytics não aparecem no dashboard Umami

1. Limpe o cache do navegador
2. Desative ad-blockers (eles podem bloquear o Umami)
3. Verifique se o Website ID está correto
4. Aguarde alguns minutos (pode haver delay)
