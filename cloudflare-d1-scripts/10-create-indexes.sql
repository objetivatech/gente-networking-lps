-- Script 10: Criar todos os índices
-- Executar APÓS criar todas as tabelas (scripts 01-09)

-- Índices da tabela users
CREATE INDEX IF NOT EXISTS idx_users_openId ON users(openId);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Índices da tabela leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_createdAt ON leads(createdAt);

-- Índices da tabela page_content
CREATE INDEX IF NOT EXISTS idx_page_content_page ON page_content(page);
CREATE INDEX IF NOT EXISTS idx_page_content_section ON page_content(section);

-- Índices da tabela events
CREATE INDEX IF NOT EXISTS idx_events_eventDate ON events(eventDate);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- Índices da tabela testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_page ON testimonials(page);
CREATE INDEX IF NOT EXISTS idx_testimonials_isActive ON testimonials(isActive);
CREATE INDEX IF NOT EXISTS idx_testimonials_displayOrder ON testimonials(displayOrder);

-- Índices da tabela faqs
CREATE INDEX IF NOT EXISTS idx_faqs_page ON faqs(page);
CREATE INDEX IF NOT EXISTS idx_faqs_isActive ON faqs(isActive);
CREATE INDEX IF NOT EXISTS idx_faqs_displayOrder ON faqs(displayOrder);

-- Índices da tabela images
CREATE INDEX IF NOT EXISTS idx_images_uploadedBy ON images(uploadedBy);
CREATE INDEX IF NOT EXISTS idx_images_page ON images(page);
CREATE INDEX IF NOT EXISTS idx_images_section ON images(section);
CREATE INDEX IF NOT EXISTS idx_images_r2Key ON images(r2Key);

-- Índices da tabela event_settings
CREATE INDEX IF NOT EXISTS idx_event_settings_eventId ON event_settings(eventId);
CREATE INDEX IF NOT EXISTS idx_event_settings_isActive ON event_settings(isActive);
CREATE INDEX IF NOT EXISTS idx_event_settings_eventDate ON event_settings(eventDate);

-- Índices da tabela email_notifications
CREATE INDEX IF NOT EXISTS idx_email_notifications_leadId ON email_notifications(leadId);
CREATE INDEX IF NOT EXISTS idx_email_notifications_eventId ON email_notifications(eventId);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_scheduledFor ON email_notifications(scheduledFor);
CREATE INDEX IF NOT EXISTS idx_email_notifications_notificationType ON email_notifications(notificationType);
