/**
 * tRPC Context para Cloudflare Workers
 * Verifica sessão via cookie admin_session (Google OAuth independente)
 */

interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  JWT_SECRET: string;
}

interface SessionData {
  email: string;
  name: string;
  picture: string;
  exp: number;
}

interface User {
  email: string;
  name: string;
  picture: string;
}

export async function createContext(context: EventContext<Env, any, Record<string, unknown>>) {
  const { request, env } = context;
  
  // Extrair cookie admin_session
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...v] = c.trim().split('=');
      return [key, v.join('=')];
    })
  );

  const sessionCookie = cookies['admin_session'];
  let user: User | null = null;

  if (sessionCookie) {
    try {
      // Separar sessão e assinatura
      const [sessionB64, signatureHex] = sessionCookie.split('.');

      if (sessionB64 && signatureHex) {
        // Verificar assinatura
        const expectedSignature = await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(sessionB64 + (env.JWT_SECRET || 'default-secret'))
        );
        const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        if (signatureHex === expectedSignatureHex) {
          // Decodificar sessão
          const sessionJson = atob(sessionB64);
          const sessionData: SessionData = JSON.parse(sessionJson);

          // Verificar expiração
          const now = Math.floor(Date.now() / 1000);
          if (sessionData.exp >= now) {
            user = {
              email: sessionData.email,
              name: sessionData.name,
              picture: sessionData.picture,
            };
            
            console.log('[Google OAuth] Usuário autenticado:', user.email);
          } else {
            console.log('[Google OAuth] Sessão expirada');
          }
        } else {
          console.log('[Google OAuth] Assinatura inválida');
        }
      }
    } catch (error) {
      console.error('[Google OAuth] Erro ao verificar sessão:', error);
    }
  }
  
  return {
    user,
    db: env.DB,
    bucket: env.BUCKET,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
