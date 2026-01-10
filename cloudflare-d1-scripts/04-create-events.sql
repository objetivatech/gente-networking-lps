-- Script 04: Criar tabela events
-- Executar após users

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  speaker VARCHAR(255),
  speakerBio TEXT,
  speakerImage TEXT,
  eventDate DATETIME NOT NULL,
  startTime VARCHAR(10) NOT NULL,
  endTime VARCHAR(10) NOT NULL,
  location VARCHAR(255),
  maxAttendees INTEGER,
  currentAttendees INTEGER DEFAULT 0 NOT NULL,
  agenda TEXT,
  status TEXT CHECK(status IN ('upcoming', 'ongoing', 'completed', 'cancelled')) DEFAULT 'upcoming' NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_events_eventDate ON events(eventDate);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
