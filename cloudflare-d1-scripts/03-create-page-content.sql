-- Script 03: Criar tabela page_content
-- Executar após users

CREATE TABLE IF NOT EXISTS page_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT CHECK(page IN ('participe', 'gentehub')) NOT NULL,
  section VARCHAR(100) NOT NULL,
  contentKey VARCHAR(100) NOT NULL,
  contentValue TEXT NOT NULL,
  contentType TEXT CHECK(contentType IN ('text', 'html', 'image', 'url')) DEFAULT 'text' NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(page, section, contentKey)
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_page_content_page ON page_content(page);
CREATE INDEX IF NOT EXISTS idx_page_content_section ON page_content(section);
