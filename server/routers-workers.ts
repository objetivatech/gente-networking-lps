/**
 * tRPC Routers para Cloudflare Workers
 * 
 * Este arquivo substitui routers.ts original e usa db-d1.ts
 * para compatibilidade com Cloudflare D1 Database.
 */

import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db-d1";

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
      .mutation(async ({ input, ctx }) => {
        const lead = await db.createLead(ctx.db, input);
        
        // TODO: Implementar notificação via Cloudflare (Email Workers ou similar)
        console.log('[Lead criado]', input);
        
        return lead;
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getAllLeads(ctx.db);
    }),
    getBySource: publicProcedure
      .input(z.enum(["participe", "gentehub"]))
      .query(async ({ input, ctx }) => {
        return db.getLeadsBySource(ctx.db, input);
      }),
    exportCSV: protectedProcedure
      .input(z.object({
        source: z.enum(["participe", "gentehub", "all"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        let leads;
        if (input.source && input.source !== "all") {
          leads = await db.getLeadsBySource(ctx.db, input.source);
        } else {
          leads = await db.getAllLeads(ctx.db);
        }
        
        // Gerar CSV simples
        const headers = ['ID', 'Nome', 'Email', 'WhatsApp', 'Empresa', 'Segmento', 'Origem', 'Status', 'Data'];
        const rows = leads.map((lead: any) => [
          lead.id,
          lead.name,
          lead.email,
          lead.whatsapp,
          lead.company,
          lead.segment,
          lead.source,
          lead.status,
          new Date(lead.created_at).toLocaleDateString('pt-BR'),
        ]);
        
        const csv = [headers, ...rows]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n');
        
        const filename = `leads-${input.source || 'all'}-${Date.now()}.csv`;
        
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
      .mutation(async ({ input, ctx }) => {
        await db.updateLeadStatus(ctx.db, input.id, input.status);
        return { success: true };
      }),
  }),

  // Content router
  content: router({
    getByPage: publicProcedure
      .input(z.enum(["participe", "gentehub"]))
      .query(async ({ input, ctx }) => {
        return await db.getPageContent(ctx.db, input);
      }),
    upsert: protectedProcedure
      .input(z.object({
        page: z.enum(["participe", "gentehub"]),
        section: z.string(),
        key: z.string(),
        value: z.string(),
        type: z.enum(["text", "html", "image", "json"]).default("text"),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.upsertPageContent(ctx.db, input);
        return { success: true };
      }),
  }),

  // Events router
  events: router({
    upcoming: publicProcedure.query(async ({ ctx }) => {
      return await db.getUpcomingEvents(ctx.db);
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input, ctx }) => {
        return await db.getEventById(ctx.db, input);
      }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        speaker: z.string().optional(),
        speakerBio: z.string().optional(),
        speakerImage: z.string().optional(),
        eventDate: z.number(), // timestamp
        startTime: z.string(),
        endTime: z.string(),
        location: z.string().optional(),
        maxAttendees: z.number().optional(),
        agenda: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createEvent(ctx.db, input);
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
          eventDate: z.number().optional(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
          location: z.string().optional(),
          maxAttendees: z.number().optional(),
          currentAttendees: z.number().optional(),
          agenda: z.string().optional(),
          status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateEvent(ctx.db, input.id, input.data);
        return { success: true };
      }),
  }),

  // Testimonials router
  testimonials: router({
    list: publicProcedure
      .input(z.enum(["participe", "gentehub", "both"]).optional())
      .query(async ({ input, ctx }) => {
        return await db.getTestimonials(ctx.db, input);
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
      .mutation(async ({ input, ctx }) => {
        return await db.createTestimonial(ctx.db, input);
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
      .mutation(async ({ input, ctx }) => {
        await db.updateTestimonial(ctx.db, input.id, input.data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        await db.deleteTestimonial(ctx.db, input);
        return { success: true };
      }),
  }),

  // FAQs router
  faqs: router({
    list: publicProcedure
      .input(z.enum(["participe", "gentehub", "both"]).optional())
      .query(async ({ input, ctx }) => {
        return await db.getFaqs(ctx.db, input);
      }),
    create: protectedProcedure
      .input(z.object({
        question: z.string(),
        answer: z.string(),
        page: z.enum(["participe", "gentehub", "both"]).default("both"),
        order: z.number().default(0),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createFaq(ctx.db, input);
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
      .mutation(async ({ input, ctx }) => {
        await db.updateFaq(ctx.db, input.id, input.data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        await db.deleteFaq(ctx.db, input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
