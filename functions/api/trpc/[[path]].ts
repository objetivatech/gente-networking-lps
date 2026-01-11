/**
 * Cloudflare Workers Function para tRPC
 * 
 * Este arquivo implementa o handler do tRPC usando Cloudflare Workers
 * ao invés de Express. Todas as rotas /api/trpc/* são tratadas aqui.
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../../server/routers-workers';
import { createContext } from '../../../server/_core/context-workers';

interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  CF_ACCESS_TEAM_DOMAIN: string;
  CF_ACCESS_AUD: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: context.request,
    router: appRouter,
    createContext: () => createContext(context),
    onError:
      context.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
            );
          }
        : undefined,
  });
};
