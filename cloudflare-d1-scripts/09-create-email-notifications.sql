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

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_email_notifications_leadId ON email_notifications(leadId);
CREATE INDEX IF NOT EXISTS idx_email_notifications_eventId ON email_notifications(eventId);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_scheduledFor ON email_notifications(scheduledFor);
CREATE INDEX IF NOT EXISTS idx_email_notifications_notificationType ON email_notifications(notificationType);
