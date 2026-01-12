/**
 * Database helpers para Cloudflare D1
 * 
 * Este arquivo contém funções para interagir com o banco D1 do Cloudflare.
 * Usa SQL direto ao invés de Drizzle ORM para compatibilidade com Workers.
 */

// ==================== USERS ====================

export async function getUserByEmail(db: D1Database, email: string) {
  const result = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first();
  return result;
}

export async function createUser(
  db: D1Database,
  data: { email: string; name: string; role?: 'admin' | 'user' }
) {
  const role = data.role || 'user';
  const result = await db
    .prepare(
      'INSERT INTO users (email, name, role, created_at) VALUES (?, ?, ?, ?) RETURNING *'
    )
    .bind(data.email, data.name, role, Date.now())
    .first();
  return result;
}

// ==================== LEADS ====================

export async function createLead(
  db: D1Database,
  data: {
    name: string;
    email: string;
    whatsapp: string;
    company: string;
    segment: string;
    source: 'participe' | 'gentehub';
  }
) {
  const result = await db
    .prepare(
      `INSERT INTO leads (name, email, whatsapp, company, segment, source, status)
       VALUES (?, ?, ?, ?, ?, ?, 'new') RETURNING *`
    )
    .bind(
      data.name,
      data.email,
      data.whatsapp,
      data.company,
      data.segment,
      data.source
    )
    .first();
  return result;
}

export async function getAllLeads(db: D1Database) {
  const result = await db
    .prepare('SELECT * FROM leads ORDER BY id DESC')
    .all();
  return result.results || [];
}

export async function getLeadsBySource(
  db: D1Database,
  source: 'participe' | 'gentehub'
) {
  const result = await db
    .prepare('SELECT * FROM leads WHERE source = ? ORDER BY id DESC')
    .bind(source)
    .all();
  return result.results || [];
}

export async function updateLeadStatus(
  db: D1Database,
  id: number,
  status: 'new' | 'contacted' | 'converted' | 'archived'
) {
  await db
    .prepare('UPDATE leads SET status = ?, updated_at = ? WHERE id = ?')
    .bind(status, Date.now(), id)
    .run();
}

// ==================== PAGE CONTENT ====================

export async function getPageContent(
  db: D1Database,
  page: 'participe' | 'gentehub'
) {
  const result = await db
    .prepare('SELECT * FROM page_content WHERE page = ?')
    .bind(page)
    .all();
  return result.results || [];
}

export async function upsertPageContent(
  db: D1Database,
  data: {
    page: 'participe' | 'gentehub';
    section: string;
    key: string;
    value: string;
    type?: 'text' | 'html' | 'image' | 'json';
  }
) {
  const type = data.type || 'text';
  
  // Check if exists
  const existing = await db
    .prepare(
      'SELECT id FROM page_content WHERE page = ? AND section = ? AND key = ?'
    )
    .bind(data.page, data.section, data.key)
    .first();
  
  if (existing) {
    // Update
    await db
      .prepare(
        'UPDATE page_content SET value = ?, type = ?, updated_at = ? WHERE id = ?'
      )
      .bind(data.value, type, Date.now(), existing.id)
      .run();
  } else {
    // Insert
    await db
      .prepare(
        `INSERT INTO page_content (page, section, key, value, type, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        data.page,
        data.section,
        data.key,
        data.value,
        type,
        Date.now(),
        Date.now()
      )
      .run();
  }
}

// ==================== EVENTS ====================

export async function getUpcomingEvents(db: D1Database) {
  const result = await db
    .prepare(
      `SELECT * FROM events 
       WHERE status = 'upcoming' 
       ORDER BY event_date ASC`
    )
    .all();
  return result.results || [];
}

export async function getEventById(db: D1Database, id: number) {
  const result = await db
    .prepare('SELECT * FROM events WHERE id = ?')
    .bind(id)
    .first();
  return result;
}

export async function createEvent(
  db: D1Database,
  data: {
    title: string;
    description: string;
    speaker?: string;
    speakerBio?: string;
    speakerImage?: string;
    eventDate: number; // timestamp
    startTime: string;
    endTime: string;
    location?: string;
    maxAttendees?: number;
    agenda?: string;
  }
) {
  const result = await db
    .prepare(
      `INSERT INTO events (
        title, description, speaker, speaker_bio, speaker_image,
        event_date, start_time, end_time, location, max_attendees,
        current_attendees, agenda, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 'upcoming', ?, ?) RETURNING *`
    )
    .bind(
      data.title,
      data.description,
      data.speaker || null,
      data.speakerBio || null,
      data.speakerImage || null,
      data.eventDate,
      data.startTime,
      data.endTime,
      data.location || null,
      data.maxAttendees || null,
      data.agenda || null,
      Date.now(),
      Date.now()
    )
    .first();
  return result;
}

export async function updateEvent(
  db: D1Database,
  id: number,
  data: Partial<{
    title: string;
    description: string;
    speaker: string;
    speakerBio: string;
    speakerImage: string;
    eventDate: number;
    startTime: string;
    endTime: string;
    location: string;
    maxAttendees: number;
    currentAttendees: number;
    agenda: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  }>
) {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (data.title !== undefined) {
    updates.push('title = ?');
    values.push(data.title);
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    values.push(data.description);
  }
  if (data.speaker !== undefined) {
    updates.push('speaker = ?');
    values.push(data.speaker);
  }
  if (data.speakerBio !== undefined) {
    updates.push('speaker_bio = ?');
    values.push(data.speakerBio);
  }
  if (data.speakerImage !== undefined) {
    updates.push('speaker_image = ?');
    values.push(data.speakerImage);
  }
  if (data.eventDate !== undefined) {
    updates.push('event_date = ?');
    values.push(data.eventDate);
  }
  if (data.startTime !== undefined) {
    updates.push('start_time = ?');
    values.push(data.startTime);
  }
  if (data.endTime !== undefined) {
    updates.push('end_time = ?');
    values.push(data.endTime);
  }
  if (data.location !== undefined) {
    updates.push('location = ?');
    values.push(data.location);
  }
  if (data.maxAttendees !== undefined) {
    updates.push('max_attendees = ?');
    values.push(data.maxAttendees);
  }
  if (data.currentAttendees !== undefined) {
    updates.push('current_attendees = ?');
    values.push(data.currentAttendees);
  }
  if (data.agenda !== undefined) {
    updates.push('agenda = ?');
    values.push(data.agenda);
  }
  if (data.status !== undefined) {
    updates.push('status = ?');
    values.push(data.status);
  }
  
  updates.push('updated_at = ?');
  values.push(Date.now());
  
  values.push(id);
  
  await db
    .prepare(`UPDATE events SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run();
}

// ==================== TESTIMONIALS ====================

export async function getTestimonials(
  db: D1Database,
  page?: 'participe' | 'gentehub' | 'both'
) {
  let query = 'SELECT * FROM testimonials';
  const params: any[] = [];
  
  if (page && page !== 'both') {
    query += " WHERE page = ? OR page = 'both'";
    params.push(page);
  }
  
  query += ' ORDER BY "order" ASC, created_at DESC';
  
  const stmt = params.length > 0 
    ? db.prepare(query).bind(...params)
    : db.prepare(query);
  
  const result = await stmt.all();
  return result.results || [];
}

export async function createTestimonial(
  db: D1Database,
  data: {
    name: string;
    role: string;
    company?: string;
    content: string;
    image?: string;
    page: 'participe' | 'gentehub' | 'both';
    order: number;
  }
) {
  const result = await db
    .prepare(
      `INSERT INTO testimonials (name, role, company, content, image, page, "order", created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
    )
    .bind(
      data.name,
      data.role,
      data.company || null,
      data.content,
      data.image || null,
      data.page,
      data.order,
      Date.now()
    )
    .first();
  return result;
}

export async function updateTestimonial(
  db: D1Database,
  id: number,
  data: Partial<{
    name: string;
    role: string;
    company: string;
    content: string;
    image: string;
    page: 'participe' | 'gentehub' | 'both';
    order: number;
  }>
) {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.role !== undefined) {
    updates.push('role = ?');
    values.push(data.role);
  }
  if (data.company !== undefined) {
    updates.push('company = ?');
    values.push(data.company);
  }
  if (data.content !== undefined) {
    updates.push('content = ?');
    values.push(data.content);
  }
  if (data.image !== undefined) {
    updates.push('image = ?');
    values.push(data.image);
  }
  if (data.page !== undefined) {
    updates.push('page = ?');
    values.push(data.page);
  }
  if (data.order !== undefined) {
    updates.push('"order" = ?');
    values.push(data.order);
  }
  
  values.push(id);
  
  await db
    .prepare(`UPDATE testimonials SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run();
}

export async function deleteTestimonial(db: D1Database, id: number) {
  await db.prepare('DELETE FROM testimonials WHERE id = ?').bind(id).run();
}

// ==================== FAQS ====================

export async function getFaqs(
  db: D1Database,
  page?: 'participe' | 'gentehub' | 'both'
) {
  let query = 'SELECT * FROM faqs';
  const params: any[] = [];
  
  if (page && page !== 'both') {
    query += " WHERE page = ? OR page = 'both'";
    params.push(page);
  }
  
  query += ' ORDER BY "order" ASC, created_at DESC';
  
  const stmt = params.length > 0 
    ? db.prepare(query).bind(...params)
    : db.prepare(query);
  
  const result = await stmt.all();
  return result.results || [];
}

export async function createFaq(
  db: D1Database,
  data: {
    question: string;
    answer: string;
    page: 'participe' | 'gentehub' | 'both';
    order: number;
  }
) {
  const result = await db
    .prepare(
      `INSERT INTO faqs (question, answer, page, "order", created_at)
       VALUES (?, ?, ?, ?, ?) RETURNING *`
    )
    .bind(data.question, data.answer, data.page, data.order, Date.now())
    .first();
  return result;
}

export async function updateFaq(
  db: D1Database,
  id: number,
  data: Partial<{
    question: string;
    answer: string;
    page: 'participe' | 'gentehub' | 'both';
    order: number;
  }>
) {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (data.question !== undefined) {
    updates.push('question = ?');
    values.push(data.question);
  }
  if (data.answer !== undefined) {
    updates.push('answer = ?');
    values.push(data.answer);
  }
  if (data.page !== undefined) {
    updates.push('page = ?');
    values.push(data.page);
  }
  if (data.order !== undefined) {
    updates.push('"order" = ?');
    values.push(data.order);
  }
  
  values.push(id);
  
  await db
    .prepare(`UPDATE faqs SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run();
}

export async function deleteFaq(db: D1Database, id: number) {
  await db.prepare('DELETE FROM faqs WHERE id = ?').bind(id).run();
}
