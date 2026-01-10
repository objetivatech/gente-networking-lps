-- Script 09: Criar tabela email_notifications
-- Executar após leads e events

CREATE TABLE IF NOT EXISTS email_notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  leadId INTEGER NOT NULL,
  eventId INTEGER NOT NULL,
  notificationType TEXT CHECK(notificationType IN ('confirmation', 'reminder_5days', 'reminder_2days', 'reminder_2hours')) NOT NULL,
  status TEXT CHECK(status IN ('pending', 'sent', 'failed')) DEFAULT 'pending' NOT NULL,
  scheduledFor DATETIME NOT NULL,
  sentAt DATETIME,
  errorMessage TEXT,
  retryCount INTEGER DEFAULT 0 NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
