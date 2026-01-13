/**
 * tRPC Context para Cloudflare Workers
 * Verifica sessão via cookie admin_session (autenticação simples)
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

// Web Crypto API compatible signature function (MUST match simple-login.ts)
async function verifyCookie(data: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const expectedSignature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );
  
  const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return signature === expectedSignatureHex;
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

  console.log('[Auth Context] Cookie admin_session presente:', !!sessionCookie);

  if (sessionCookie) {
    try {
      // Separar sessão e assinatura
      const [sessionB64, signatureHex] = sessionCookie.split('.');

      console.log('[Auth Context] Cookie parseado:', { hasSession: !!sessionB64, hasSignature: !!signatureHex });

      if (sessionB64 && signatureHex) {
        // Verificar assinatura (usar mesmo fallback do simple-login.ts)
        const jwtSecret = env.JWT_SECRET || 'gente-networking-default-secret-2026';
        console.log('[Auth Context] JWT_SECRET configurado:', !!env.JWT_SECRET);
        
        const isValid = await verifyCookie(sessionB64, signatureHex, jwtSecret);

        console.log('[Auth Context] Assinatura válida:', isValid);

        if (isValid) {
          // Decodificar sessão
          const sessionJson = atob(sessionB64);
          const sessionData: SessionData = JSON.parse(sessionJson);

          // Verificar expiração
          const now = Math.floor(Date.now() / 1000);
          console.log('[Auth Context] Expiração:', { exp: sessionData.exp, now, valid: sessionData.exp >= now });
          
          if (sessionData.exp >= now) {
            user = {
              email: sessionData.email,
              name: sessionData.name,
              picture: sessionData.picture || "",
            };
            
            console.log('[Auth Context] Usuário autenticado:', user.email);
          } else {
            console.log('[Auth Context] Sessão expirada');
          }
        } else {
          console.log('[Auth Context] Assinatura inválida');
        }
      }
    } catch (error) {
      console.error('[Auth Context] Erro ao verificar sessão:', error);
    }
  } else {
    console.log('[Auth Context] Nenhum cookie de sessão encontrado');
  }
  
  return {
    user,
    db: env.DB,
    bucket: env.BUCKET,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
