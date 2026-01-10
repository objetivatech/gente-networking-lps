import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Leads router
  leads: router({
    create: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        whatsapp: z.string(),
        company: z.string(),
        segment: z.string(),
        source: z.enum(["participe", "gentehub"]),
      }))
      .mutation(async ({ input }) => {
        const lead = await db.createLead(input);
        // Notificar o proprietário
        await notifyOwner({
          title: `Novo Lead: ${input.source}`,
          content: `Nome: ${input.name}\nEmail: ${input.email}\nEmpresa: ${input.company}\nSegmento: ${input.segment}\nWhatsApp: ${input.whatsapp}`,
        });
        return lead;
      }),
    list: protectedProcedure.query(async () => {
      return await db.getAllLeads();
    }),
     getBySource: publicProcedure
      .input(z.enum(["participe", "gentehub"]))
      .query(async ({ input }) => {
        return db.getLeadsBySource(input);
      }),
    exportCSV: protectedProcedure
      .input(z.object({
        source: z.enum(["participe", "gentehub", "all"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { leadsToCSV, generateCSVFilename } = await import("./export-leads");
        
        let leads;
        if (input.source && input.source !== "all") {
          leads = await db.getLeadsBySource(input.source);
        } else {
          leads = await db.getAllLeads();
        }
        
        const csv = leadsToCSV(leads);
        const filename = generateCSVFilename(input.source === "all" ? undefined : input.source);
        
        return {
          csv,
          filename,
        };
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "converted", "archived"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateLeadStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // Content router
  content: router({
    getByPage: publicProcedure
      .input(z.enum(["participe", "gentehub"]))
      .query(async ({ input }) => {
        return await db.getPageContent(input);
      }),
    upsert: protectedProcedure
      .input(z.object({
        page: z.enum(["participe", "gentehub"]),
        section: z.string(),
        key: z.string(),
        value: z.string(),
        type: z.enum(["text", "html", "image", "json"]).default("text"),
      }))
      .mutation(async ({ input }) => {
        await db.upsertPageContent(input);
        return { success: true };
      }),
  }),

  // Events router
  events: router({
    upcoming: publicProcedure.query(async () => {
      return await db.getUpcomingEvents();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getEventById(input);
      }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        speaker: z.string().optional(),
        speakerBio: z.string().optional(),
        speakerImage: z.string().optional(),
        eventDate: z.date(),
        startTime: z.string(),
        endTime: z.string(),
        location: z.string().optional(),
        maxAttendees: z.number().optional(),
        agenda: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createEvent(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          speaker: z.string().optional(),
          speakerBio: z.string().optional(),
          speakerImage: z.string().optional(),
          eventDate: z.date().optional(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
          location: z.string().optional(),
          maxAttendees: z.number().optional(),
          currentAttendees: z.number().optional(),
          agenda: z.string().optional(),
          status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateEvent(input.id, input.data);
        return { success: true };
      }),
  }),

  // Testimonials router
  testimonials: router({
    list: publicProcedure
      .input(z.enum(["participe", "gentehub", "both"]).optional())
      .query(async ({ input }) => {
        return await db.getTestimonials(input);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        role: z.string(),
        company: z.string().optional(),
        content: z.string(),
        image: z.string().optional(),
        page: z.enum(["participe", "gentehub", "both"]).default("both"),
        order: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return await db.createTestimonial(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          role: z.string().optional(),
          company: z.string().optional(),
          content: z.string().optional(),
          image: z.string().optional(),
          page: z.enum(["participe", "gentehub", "both"]).optional(),
          order: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateTestimonial(input.id, input.data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteTestimonial(input);
        return { success: true };
      }),
  }),

  // FAQs router
  faqs: router({
    list: publicProcedure
      .input(z.enum(["participe", "gentehub", "both"]).optional())
      .query(async ({ input }) => {
        return await db.getFaqs(input);
      }),
    create: protectedProcedure
      .input(z.object({
        question: z.string(),
        answer: z.string(),
        page: z.enum(["participe", "gentehub", "both"]).default("both"),
        order: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return await db.createFaq(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          question: z.string().optional(),
          answer: z.string().optional(),
          page: z.enum(["participe", "gentehub", "both"]).optional(),
          order: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateFaq(input.id, input.data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteFaq(input);
        return { success: true };
      }),
  }),

  // Event Settings router
  eventSettings: router({
    getActive: publicProcedure.query(async () => {
      const { getActiveEventSettings } = await import("./event-settings-db");
      return getActiveEventSettings();
    }),
    update: protectedProcedure
      .input(
        z.object({
          eventId: z.number(),
          whatsappGroupLink: z.string().optional(),
          eventDate: z.date(),
          eventEndTime: z.date(),
        })
      )
      .mutation(async ({ input }) => {
        const { createEventSettings, deactivateAllEventSettings } = await import(
          "./event-settings-db"
        );
        await deactivateAllEventSettings();
        await createEventSettings({
          ...input,
          isActive: 1,
        });
        return { success: true };
      }),
  }),

  // Email Notifications router
  emailNotifications: router({
    getAll: protectedProcedure.query(async () => {
      const { getAllNotifications } = await import("./event-settings-db");
      return getAllNotifications();
    }),
    getByLead: protectedProcedure
      .input(z.object({ leadId: z.number() }))
      .query(async ({ input }) => {
        const { getNotificationsByLeadId } = await import("./event-settings-db");
        return getNotificationsByLeadId(input.leadId);
      }),
    triggerProcessing: protectedProcedure
      .mutation(async () => {
        const { triggerNotificationProcessing } = await import(
          "./notification-scheduler"
        );
        await triggerNotificationProcessing();
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
