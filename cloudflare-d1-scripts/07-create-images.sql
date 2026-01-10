-- Script 07: Criar tabela images
-- Executar após users
-- NOTA: Foreign key removida para compatibilidade com Cloudflare D1

CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename VARCHAR(255) NOT NULL,
  originalName VARCHAR(255) NOT NULL,
  mimeType VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  r2Key TEXT NOT NULL,
  uploadedBy INTEGER NOT NULL,
  page TEXT CHECK(page IN ('participe', 'gentehub', 'both')),
  section VARCHAR(100),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_images_uploadedBy ON images(uploadedBy);
CREATE INDEX IF NOT EXISTS idx_images_page ON images(page);
CREATE INDEX IF NOT EXISTS idx_images_section ON images(section);
CREATE INDEX IF NOT EXISTS idx_images_r2Key ON images(r2Key);
