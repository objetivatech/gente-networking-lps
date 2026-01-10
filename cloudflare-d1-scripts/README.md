# Scripts SQL para Cloudflare D1

Este diretório contém os scripts SQL organizados para criação do banco de dados no Cloudflare D1.

## ⚠️ IMPORTANTE

O console do Cloudflare D1 executa **APENAS UM COMANDO SQL POR VEZ**. Por isso, os scripts foram simplificados para conter apenas o comando CREATE TABLE. Os índices foram movidos para um script separado (10-create-indexes.sql) que deve ser executado por último.

## 📋 Ordem de Execução

Execute os scripts **NA ORDEM NUMÉRICA** no console SQL do Cloudflare D1:

### Passo 1: Criar Tabelas (scripts 01-09)

1. **01-create-users.sql** - Tabela de usuários (base para outras tabelas)
2. **02-create-leads.sql** - Tabela de leads capturados
3. **03-create-page-content.sql** - Conteúdo editável das páginas
4. **04-create-events.sql** - Eventos do Gente HUB
5. **05-create-testimonials.sql** - Depoimentos de membros
6. **06-create-faqs.sql** - Perguntas frequentes
7. **07-create-images.sql** - Imagens hospedadas no R2
8. **08-create-event-settings.sql** - Configurações dos eventos (link WhatsApp, datas)
9. **09-create-email-notifications.sql** - Controle de notificações por email

### Passo 2: Criar Índices (script 10)

10. **10-create-indexes.sql** - Todos os índices de otimização (executar por último)

## 🚀 Como Executar no Console do Cloudflare

### Via Dashboard do Cloudflare (Recomendado)

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vá em **Workers & Pages** → **D1**
3. Selecione seu banco de dados `gente-networking-db`
4. Clique na aba **Console**
5. Para cada script (01 a 10):
   - Abra o arquivo no seu editor de código
   - Copie **TODO** o conteúdo do arquivo
   - Cole no console do Cloudflare
   - Clique em **Execute**
   - Aguarde a confirmação de sucesso
   - Passe para o próximo script

### Via Wrangler CLI

Se preferir usar a linha de comando:

```bash
# Instalar Wrangler CLI globalmente
npm install -g wrangler

# Fazer login no Cloudflare
wrangler login

# Executar cada script NA ORDEM
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/01-create-users.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/02-create-leads.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/03-create-page-content.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/04-create-events.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/05-create-testimonials.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/06-create-faqs.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/07-create-images.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/08-create-event-settings.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/09-create-email-notifications.sql
wrangler d1 execute gente-networking-db --file=./cloudflare-d1-scripts/10-create-indexes.sql
```

### Script Bash Automatizado

Você pode criar um arquivo `run-migrations.sh` para executar todos de uma vez:

```bash
#!/bin/bash
DATABASE_NAME="gente-networking-db"

echo "🚀 Iniciando criação do banco de dados Cloudflare D1..."
echo ""

for i in {01..10}; do
  file="cloudflare-d1-scripts/${i}-*.sql"
  if [ -f $file ]; then
    echo "📝 Executando $file..."
    wrangler d1 execute $DATABASE_NAME --file="$file"
    if [ $? -eq 0 ]; then
      echo "✅ Concluído: $file"
    else
      echo "❌ Erro ao executar: $file"
      exit 1
    fi
    echo ""
  fi
done

echo "✅ Todas as tabelas e índices foram criados com sucesso!"
```

Torne o script executável e rode:
```bash
chmod +x run-migrations.sh
./run-migrations.sh
```

## 🔍 Verificação

Após executar todos os scripts, verifique se as tabelas foram criadas corretamente:

```sql
-- Listar todas as tabelas
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
```

Você deve ver 9 tabelas:
- `email_notifications`
- `event_settings`
- `events`
- `faqs`
- `images`
- `leads`
- `page_content`
- `testimonials`
- `users`

Para verificar os índices:
```sql
-- Listar todos os índices
SELECT name FROM sqlite_master WHERE type='index' ORDER BY name;
```

Para verificar a estrutura de uma tabela específica:
```sql
-- Exemplo: ver estrutura da tabela users
PRAGMA table_info(users);
```

## 📝 Notas Importantes

- **Ordem é Crítica**: Execute os scripts na ordem numérica (01 → 10)
- **Um Comando Por Vez**: O console do Cloudflare D1 processa apenas um comando SQL por execução
- **Índices Por Último**: O script 10 (índices) só deve ser executado após criar todas as tabelas
- **Foreign Keys**: Removidas para compatibilidade com Cloudflare D1
- **CHECK Constraints**: Utilizados para garantir valores válidos em campos enum
- **DATETIME**: Cloudflare D1 usa DATETIME em vez de TIMESTAMP do MySQL

## 🆘 Solução de Problemas

### Erro: "no such table: main.users"

**Causa**: Você tentou executar o script 10 (índices) antes de criar as tabelas

**Solução**: Execute os scripts 01-09 primeiro, depois o script 10

### Erro: "table already exists"

**Causa**: A tabela já foi criada anteriormente

**Solução**: Não é um erro crítico. O `IF NOT EXISTS` previne duplicação. Você pode continuar com o próximo script.

### Erro: "duplicate column name"

**Causa**: Você está tentando recriar uma tabela que já existe com estrutura diferente

**Solução**: Se precisar recriar, primeiro delete a tabela:
```sql
DROP TABLE IF EXISTS nome_da_tabela;
```
⚠️ **ATENÇÃO**: Isso apaga todos os dados da tabela!

### Erro: "FOREIGN KEY constraint failed"

**Causa**: Este erro não deve ocorrer, pois removemos todas as foreign keys

**Solução**: Verifique se você está usando os scripts corretos deste diretório

## 📚 Referências

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

## 💡 Dicas

1. **Copie e Cole com Cuidado**: Certifique-se de copiar TODO o conteúdo do arquivo, incluindo comentários
2. **Aguarde a Confirmação**: Sempre aguarde a mensagem de sucesso antes de executar o próximo script
3. **Use Wrangler para Produção**: Para ambientes de produção, prefira usar Wrangler CLI para maior confiabilidade
4. **Faça Backup**: Sempre faça backup do banco antes de fazer alterações estruturais
