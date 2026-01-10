-- Script 06: Criar tabela faqs
-- Executar após users

CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  page TEXT CHECK(page IN ('participe', 'gentehub', 'both')) DEFAULT 'both' NOT NULL,
  displayOrder INTEGER DEFAULT 0 NOT NULL,
  isActive INTEGER DEFAULT 1 NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_faqs_page ON faqs(page);
CREATE INDEX IF NOT EXISTS idx_faqs_isActive ON faqs(isActive);
CREATE INDEX IF NOT EXISTS idx_faqs_displayOrder ON faqs(displayOrder);
