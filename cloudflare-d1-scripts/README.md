# Scripts SQL para Cloudflare D1

Este diretório contém os scripts SQL organizados para criação do banco de dados no Cloudflare D1.

## ⚠️ Importante

Os scripts devem ser executados **NA ORDEM NUMÉRICA** para evitar erros de dependências.

## 📋 Ordem de Execução

Execute os scripts na seguinte ordem no console SQL do Cloudflare D1:

1. **01-create-users.sql** - Tabela de usuários (base para outras tabelas)
2. **02-create-leads.sql** - Tabela de leads capturados
3. **03-create-page-content.sql** - Conteúdo editável das páginas
4. **04-create-events.sql** - Eventos do Gente HUB
5. **05-create-testimonials.sql** - Depoimentos de membros
6. **06-create-faqs.sql** - Perguntas frequentes
7. **07-create-images.sql** - Imagens hospedadas no R2
8. **08-create-event-settings.sql** - Configurações dos eventos (link WhatsApp, datas)
9. **09-create-email-notifications.sql** - Controle de notificações por email

## 🚀 Como Executar

### Opção 1: Via Dashboard do Cloudflare

1. Acesse o Cloudflare Dashboard
2. Vá em **Workers & Pages** → **D1**
3. Selecione seu banco de dados
4. Clique em **Console**
5. Cole o conteúdo de cada arquivo SQL na ordem indicada
6. Clique em **Execute** após cada script

### Opção 2: Via Wrangler CLI

```bash
# Executar todos os scripts na ordem
wrangler d1 execute <DATABASE_NAME> --file=cloudflare-d1-scripts/01-create-users.sql
wrangler d1 execute <DATABASE_NAME> --file=cloudflare-d1-scripts/02-create-leads.sql
wrangler d1 execute <DATABASE_NAME> --file=cloudflare-d1-scripts/03-create-page-content.sql
wrangler d1 execute <DATABASE_NAME> --file=cloudflare-d1-scripts/04-create-events.sql
wrangler d1 execute <DATABASE_NAME> --file=cloudflare-d1-scripts/05-create-testimonials.sql
wrangler d1 execute <DATABASE_NAME> --file=cloudflare-d1-scripts/06-create-faqs.sql
wrangler d1 execute <DATABASE_NAME> --file=cloudflare-d1-scripts/07-create-images.sql
wrangler d1 execute <DATABASE_NAME> --file=cloudflare-d1-scripts/08-create-event-settings.sql
wrangler d1 execute <DATABASE_NAME> --file=cloudflare-d1-scripts/09-create-email-notifications.sql
```

### Opção 3: Script Automatizado

Você pode criar um script bash para executar todos de uma vez:

```bash
#!/bin/bash
DATABASE_NAME="gente-networking-db"

for file in cloudflare-d1-scripts/*.sql; do
  echo "Executando $file..."
  wrangler d1 execute $DATABASE_NAME --file="$file"
  echo "✓ Concluído: $file"
  echo ""
done

echo "✅ Todas as tabelas foram criadas com sucesso!"
```

## 📝 Notas Importantes

- **Foreign Keys**: A tabela `images` não possui foreign key para `users` devido a limitações do Cloudflare D1. A integridade referencial deve ser mantida pela aplicação.
- **Índices**: Todos os scripts incluem índices otimizados para as consultas mais comuns.
- **CHECK Constraints**: Utilizados para garantir valores válidos em campos enum.
- **DATETIME**: Cloudflare D1 usa DATETIME em vez de TIMESTAMP do MySQL.

## 🔍 Verificação

Após executar todos os scripts, você pode verificar se as tabelas foram criadas corretamente:

```sql
-- Listar todas as tabelas
SELECT name FROM sqlite_master WHERE type='table';

-- Verificar estrutura de uma tabela específica
PRAGMA table_info(users);
```

## 🆘 Solução de Problemas

### Erro: "no such table"
- Certifique-se de executar os scripts na ordem correta
- Verifique se o script anterior foi executado com sucesso

### Erro: "FOREIGN KEY constraint failed"
- Este erro não deve ocorrer com os scripts fornecidos, pois foreign keys problemáticas foram removidas

### Erro: "duplicate column name"
- A tabela já existe. Use `DROP TABLE IF EXISTS <nome>` antes de recriar (cuidado: isso apaga os dados!)

## 📚 Referências

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
