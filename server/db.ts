import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  leads, 
  InsertLead, 
  Lead,
  pageContent,
  PageContent,
  InsertPageContent,
  events,
  Event,
  InsertEvent,
  testimonials,
  Testimonial,
  InsertTestimonial,
  faqs,
  Faq,
  InsertFaq,
  images,
  Image,
  InsertImage
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= LEADS =============

export async function createLead(lead: InsertLead): Promise<Lead> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(leads).values(lead);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(leads).where(eq(leads.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getLeadById(id: number): Promise<Lead | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllLeads(): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function getLeadsBySource(source: "participe" | "gentehub"): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(leads).where(eq(leads.source, source)).orderBy(desc(leads.createdAt));
}

export async function updateLeadStatus(id: number, status: "new" | "contacted" | "converted" | "archived"): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(leads).set({ status }).where(eq(leads.id, id));
}

// ============= PAGE CONTENT =============

export async function getPageContent(page: "participe" | "gentehub"): Promise<PageContent[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(pageContent).where(eq(pageContent.page, page));
}

export async function getContentByKey(page: "participe" | "gentehub", section: string, key: string): Promise<PageContent | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(pageContent)
    .where(and(
      eq(pageContent.page, page),
      eq(pageContent.section, section),
      eq(pageContent.key, key)
    ))
    .limit(1);

  return result[0];
}

export async function upsertPageContent(content: InsertPageContent): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(pageContent).values(content).onDuplicateKeyUpdate({
    set: { value: content.value, updatedAt: new Date() }
  });
}

// ============= EVENTS =============

export async function getUpcomingEvents(): Promise<Event[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(events)
    .where(eq(events.status, "upcoming"))
    .orderBy(events.eventDate);
}

export async function getEventById(id: number): Promise<Event | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result[0];
}

export async function createEvent(event: InsertEvent): Promise<Event> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(events).values(event);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(events).where(eq(events.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function updateEvent(id: number, event: Partial<InsertEvent>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(events).set(event).where(eq(events.id, id));
}

// ============= TESTIMONIALS =============

export async function getTestimonials(page?: "participe" | "gentehub" | "both"): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];

  if (page) {
    return await db.select().from(testimonials)
      .where(and(
        eq(testimonials.page, page),
        eq(testimonials.active, 1)
      ))
      .orderBy(testimonials.order);
  }

  return await db.select().from(testimonials)
    .where(eq(testimonials.active, 1))
    .orderBy(testimonials.order);
}

export async function createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(testimonials).values(testimonial);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(testimonials).where(eq(testimonials.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(testimonials).set(testimonial).where(eq(testimonials.id, id));
}

export async function deleteTestimonial(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(testimonials).set({ active: 0 }).where(eq(testimonials.id, id));
}

// ============= FAQS =============

export async function getFaqs(page?: "participe" | "gentehub" | "both"): Promise<Faq[]> {
  const db = await getDb();
  if (!db) return [];

  if (page) {
    return await db.select().from(faqs)
      .where(and(
        eq(faqs.page, page),
        eq(faqs.active, 1)
      ))
      .orderBy(faqs.order);
  }

  return await db.select().from(faqs)
    .where(eq(faqs.active, 1))
    .orderBy(faqs.order);
}

export async function createFaq(faq: InsertFaq): Promise<Faq> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(faqs).values(faq);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(faqs).where(eq(faqs.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function updateFaq(id: number, faq: Partial<InsertFaq>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(faqs).set(faq).where(eq(faqs.id, id));
}

export async function deleteFaq(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(faqs).set({ active: 0 }).where(eq(faqs.id, id));
}

// ============= IMAGES =============

export async function createImage(image: InsertImage): Promise<Image> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(images).values(image);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(images).where(eq(images.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getAllImages(): Promise<Image[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(images).orderBy(desc(images.createdAt));
}

export async function getImageById(id: number): Promise<Image | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(images).where(eq(images.id, id)).limit(1);
  return result[0];
}
