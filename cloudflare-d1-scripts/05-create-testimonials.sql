-- Script 05: Criar tabela testimonials
-- Executar após users

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  role VARCHAR(255),
  testimonial TEXT NOT NULL,
  avatar TEXT,
  page TEXT CHECK(page IN ('participe', 'gentehub', 'both')) DEFAULT 'both' NOT NULL,
  displayOrder INTEGER DEFAULT 0 NOT NULL,
  isActive INTEGER DEFAULT 1 NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_testimonials_page ON testimonials(page);
CREATE INDEX IF NOT EXISTS idx_testimonials_isActive ON testimonials(isActive);
CREATE INDEX IF NOT EXISTS idx_testimonials_displayOrder ON testimonials(displayOrder);
