-- Script 08: Criar tabela event_settings
-- Executar após events

CREATE TABLE IF NOT EXISTS event_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  eventId INTEGER NOT NULL,
  whatsappGroupLink TEXT,
  eventDate DATETIME NOT NULL,
  eventEndTime DATETIME NOT NULL,
  isActive INTEGER DEFAULT 1 NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_event_settings_eventId ON event_settings(eventId);
CREATE INDEX IF NOT EXISTS idx_event_settings_isActive ON event_settings(isActive);
CREATE INDEX IF NOT EXISTS idx_event_settings_eventDate ON event_settings(eventDate);
