-- Script 02: Criar tabela leads
-- Executar após users

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email VARCHAR(320) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  company TEXT NOT NULL,
  segment TEXT NOT NULL,
  source TEXT CHECK(source IN ('participe', 'gentehub')) NOT NULL,
  status TEXT CHECK(status IN ('new', 'contacted', 'converted', 'archived')) DEFAULT 'new' NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
