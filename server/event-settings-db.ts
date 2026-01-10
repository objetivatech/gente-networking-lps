import { eq, and, desc } from "drizzle-orm";
import { eventSettings, emailNotifications, InsertEventSettings, InsertEmailNotification } from "../drizzle/schema";
import { getDb } from "./db";

// Event Settings Helpers

export async function getActiveEventSettings() {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(eventSettings)
    .where(eq(eventSettings.isActive, 1))
    .orderBy(desc(eventSettings.createdAt))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getEventSettingsByEventId(eventId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(eventSettings)
    .where(eq(eventSettings.eventId, eventId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createEventSettings(settings: InsertEventSettings) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(eventSettings).values(settings);
}

export async function updateEventSettings(id: number, updates: Partial<InsertEventSettings>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(eventSettings)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(eventSettings.id, id));
}

export async function deactivateAllEventSettings() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(eventSettings)
    .set({ isActive: 0, updatedAt: new Date() });
}

// Email Notifications Helpers

export async function createEmailNotification(notification: InsertEmailNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(emailNotifications).values(notification);
  return result;
}

export async function getPendingNotifications() {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  
  const result = await db
    .select()
    .from(emailNotifications)
    .where(
      and(
        eq(emailNotifications.status, "pending"),
        // Only get notifications that are scheduled to be sent now or in the past
        // and haven't been sent yet
      )
    )
    .orderBy(emailNotifications.scheduledFor);

  // Filter in JavaScript to ensure we only get notifications that should be sent
  return result.filter(n => new Date(n.scheduledFor) <= now);
}

export async function getNotificationsByLeadId(leadId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(emailNotifications)
    .where(eq(emailNotifications.leadId, leadId))
    .orderBy(desc(emailNotifications.createdAt));

  return result;
}

export async function getNotificationsByEventId(eventId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(emailNotifications)
    .where(eq(emailNotifications.eventId, eventId))
    .orderBy(desc(emailNotifications.createdAt));

  return result;
}

export async function updateNotificationStatus(
  id: number,
  status: "sent" | "failed",
  errorMessage?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updates: any = {
    status,
    updatedAt: new Date(),
  };

  if (status === "sent") {
    updates.sentAt = new Date();
  }

  if (errorMessage) {
    updates.errorMessage = errorMessage;
  }

  await db
    .update(emailNotifications)
    .set(updates)
    .where(eq(emailNotifications.id, id));
}

export async function incrementNotificationRetry(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get current retry count
  const notification = await db
    .select()
    .from(emailNotifications)
    .where(eq(emailNotifications.id, id))
    .limit(1);

  if (notification.length === 0) return;

  const currentRetryCount = notification[0].retryCount || 0;

  await db
    .update(emailNotifications)
    .set({
      retryCount: currentRetryCount + 1,
      updatedAt: new Date(),
    })
    .where(eq(emailNotifications.id, id));
}

export async function getAllNotifications(limit = 100) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(emailNotifications)
    .orderBy(desc(emailNotifications.createdAt))
    .limit(limit);

  return result;
}
