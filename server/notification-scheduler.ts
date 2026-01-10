import {
  createEmailNotification,
  getPendingNotifications,
  updateNotificationStatus,
  incrementNotificationRetry,
} from "./event-settings-db";
import {
  sendEmail,
  getReminder5DaysEmail,
  getReminder2DaysEmail,
  getReminder2HoursEmail,
} from "./email-service";
import { getLeadById } from "./db";
import { getEventById } from "./db";

// Maximum retry attempts for failed emails
const MAX_RETRY_ATTEMPTS = 3;

/**
 * Schedule email notifications for a lead
 * Creates 3 reminder notifications: 5 days, 2 days, and 2 hours before event
 */
export async function scheduleEventNotifications(
  leadId: number,
  eventId: number,
  eventDate: Date
) {
  const notifications = [
    {
      leadId,
      eventId,
      notificationType: "reminder_5days" as const,
      scheduledFor: new Date(eventDate.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days before
      status: "pending" as const,
    },
    {
      leadId,
      eventId,
      notificationType: "reminder_2days" as const,
      scheduledFor: new Date(eventDate.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days before
      status: "pending" as const,
    },
    {
      leadId,
      eventId,
      notificationType: "reminder_2hours" as const,
      scheduledFor: new Date(eventDate.getTime() - 2 * 60 * 60 * 1000), // 2 hours before
      status: "pending" as const,
    },
  ];

  for (const notification of notifications) {
    try {
      await createEmailNotification(notification);
    } catch (error) {
      console.error("[Notification Scheduler] Failed to create notification:", error);
    }
  }
}

/**
 * Process pending notifications
 * Should be called periodically (e.g., every 5 minutes via cron job)
 */
export async function processPendingNotifications() {
  console.log("[Notification Scheduler] Processing pending notifications...");

  const pending = await getPendingNotifications();

  if (pending.length === 0) {
    console.log("[Notification Scheduler] No pending notifications");
    return;
  }

  console.log(`[Notification Scheduler] Found ${pending.length} pending notifications`);

  for (const notification of pending) {
    try {
      // Skip if max retries exceeded
      if (notification.retryCount >= MAX_RETRY_ATTEMPTS) {
        console.log(
          `[Notification Scheduler] Max retries exceeded for notification ${notification.id}`
        );
        await updateNotificationStatus(
          notification.id,
          "failed",
          `Max retry attempts (${MAX_RETRY_ATTEMPTS}) exceeded`
        );
        continue;
      }

      // Get lead and event details
      const lead = await getLeadById(notification.leadId);
      const event = await getEventById(notification.eventId);

      if (!lead || !event) {
        console.error(
          `[Notification Scheduler] Lead or event not found for notification ${notification.id}`
        );
        await updateNotificationStatus(
          notification.id,
          "failed",
          "Lead or event not found"
        );
        continue;
      }

      // Format event date and time
      const eventDate = new Date(event.eventDate);
      const eventDateStr = eventDate.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const eventTimeStr = event.startTime || "19:00";

      // Generate email based on notification type
      let html: string;
      let subject: string;

      switch (notification.notificationType) {
        case "reminder_5days":
          html = getReminder5DaysEmail({
            name: lead.name,
            eventDate: eventDateStr,
            eventTime: eventTimeStr,
          });
          subject = "Faltam 5 dias para o Gente HUB! 📅";
          break;

        case "reminder_2days":
          html = getReminder2DaysEmail({
            name: lead.name,
            eventDate: eventDateStr,
            eventTime: eventTimeStr,
          });
          subject = "Faltam apenas 2 dias para o Gente HUB! ⏰";
          break;

        case "reminder_2hours":
          html = getReminder2HoursEmail({
            name: lead.name,
            eventDate: eventDateStr,
            eventTime: eventTimeStr,
            zoomLink: event.location || "https://zoom.us/j/exemplo",
          });
          subject = "O Gente HUB começa em 2 horas! 🚀";
          break;

        default:
          console.error(
            `[Notification Scheduler] Unknown notification type: ${notification.notificationType}`
          );
          continue;
      }

      // Send email
      await sendEmail({
        to: lead.email,
        subject,
        html,
      });

      // Mark as sent
      await updateNotificationStatus(notification.id, "sent");
      console.log(
        `[Notification Scheduler] Sent ${notification.notificationType} to ${lead.email}`
      );
    } catch (error) {
      console.error(
        `[Notification Scheduler] Failed to send notification ${notification.id}:`,
        error
      );

      // Increment retry count
      await incrementNotificationRetry(notification.id);

      // Update status to failed with error message
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await updateNotificationStatus(notification.id, "failed", errorMessage);
    }
  }

  console.log("[Notification Scheduler] Finished processing notifications");
}

/**
 * Start the notification scheduler
 * Runs every 5 minutes
 */
export function startNotificationScheduler() {
  console.log("[Notification Scheduler] Starting scheduler...");

  // Run immediately on start
  processPendingNotifications().catch((error) => {
    console.error("[Notification Scheduler] Error in initial run:", error);
  });

  // Then run every 5 minutes
  const interval = setInterval(() => {
    processPendingNotifications().catch((error) => {
      console.error("[Notification Scheduler] Error in scheduled run:", error);
    });
  }, 5 * 60 * 1000); // 5 minutes

  // Return cleanup function
  return () => {
    console.log("[Notification Scheduler] Stopping scheduler...");
    clearInterval(interval);
  };
}

// Helper function to manually trigger notification processing (for testing)
export async function triggerNotificationProcessing() {
  return processPendingNotifications();
}
