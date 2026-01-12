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

  console.log('[Google OAuth Context] Cookie admin_session presente:', !!sessionCookie);

  if (sessionCookie) {
    try {
      // Separar sessão e assinatura
      const [sessionB64, signatureHex] = sessionCookie.split('.');

      console.log('[Google OAuth Context] Cookie parseado:', { hasSession: !!sessionB64, hasSignature: !!signatureHex });

      if (sessionB64 && signatureHex) {
        // Verificar assinatura (usar mesmo fallback do callback)
        const jwtSecret = env.JWT_SECRET || 'gente-networking-default-secret-2026';
        console.log('[Google OAuth Context] JWT_SECRET configurado:', !!env.JWT_SECRET);
        
        const expectedSignature = await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(sessionB64 + jwtSecret)
        );
        const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        console.log('[Google OAuth Context] Assinaturas:', { 
          received: signatureHex.substring(0, 16) + '...', 
          expected: expectedSignatureHex.substring(0, 16) + '...',
          match: signatureHex === expectedSignatureHex
        });

        if (signatureHex === expectedSignatureHex) {
          // Decodificar sessão
          const sessionJson = atob(sessionB64);
          const sessionData: SessionData = JSON.parse(sessionJson);

          // Verificar expiração
          const now = Math.floor(Date.now() / 1000);
          console.log('[Google OAuth Context] Expiração:', { exp: sessionData.exp, now, valid: sessionData.exp >= now });
          
          if (sessionData.exp >= now) {
            user = {
              email: sessionData.email,
              name: sessionData.name,
              picture: sessionData.picture,
            };
            
            console.log('[Google OAuth Context] Usuário autenticado:', user.email);
          } else {
            console.log('[Google OAuth Context] Sessão expirada');
          }
        } else {
          console.log('[Google OAuth Context] Assinatura inválida');
        }
      }
    } catch (error) {
      console.error('[Google OAuth Context] Erro ao verificar sessão:', error);
    }
  } else {
    console.log('[Google OAuth Context] Nenhum cookie de sessão encontrado');
  }
  
  return {
    user,
    db: env.DB,
    bucket: env.BUCKET,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
