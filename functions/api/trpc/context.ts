/**
 * Context do tRPC para Cloudflare Workers
 * 
 * Cria o contexto para cada requisição tRPC, incluindo:
 * - Autenticação via Cloudflare Access JWT
 * - Acesso ao D1 Database
 * - Acesso ao R2 Bucket
 */

import { jwtVerify, createRemoteJWKSet } from 'jose';

interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  CF_ACCESS_TEAM_DOMAIN: string;
  CF_ACCESS_AUD: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export async function createContext(context: EventContext<Env, any, Record<string, unknown>>) {
  const { request, env } = context;
  
  // Extrair JWT do Cloudflare Access
  // Tentar primeiro do header, depois do cookie
  let cfAccessJwt = request.headers.get('Cf-Access-Jwt-Assertion');
  
  if (!cfAccessJwt) {
    // Extrair do cookie CF_Authorization
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const cfAuthCookie = cookies.find(c => c.startsWith('CF_Authorization='));
      if (cfAuthCookie) {
        cfAccessJwt = cfAuthCookie.split('=')[1];
      }
    }
  }
  
  let user: User | null = null;
  
  if (cfAccessJwt && env.CF_ACCESS_TEAM_DOMAIN && env.CF_ACCESS_AUD) {
    try {
      // Verificar JWT usando JWKS do Cloudflare
      const jwksUrl = `https://${env.CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`;
      const JWKS = createRemoteJWKSet(new URL(jwksUrl));
      
      const { payload } = await jwtVerify(cfAccessJwt, JWKS, {
        audience: env.CF_ACCESS_AUD,
        issuer: `https://${env.CF_ACCESS_TEAM_DOMAIN}`,
      });
      
      const email = payload.email as string;
      const name = payload.name as string || email.split('@')[0];
      
      if (email) {
        // Buscar ou criar usuário no banco D1
        user = await getOrCreateUser(env.DB, email, name);
        
        console.log('[Cloudflare Access] Usuário autenticado:', {
          email: user.email,
          name: user.name,
          role: user.role,
        });
      }
    } catch (error) {
      console.error('[Cloudflare Access] Erro ao verificar JWT:', error);
    }
  }
  
  return {
    user,
    db: env.DB,
    bucket: env.BUCKET,
  };
}

async function getOrCreateUser(db: D1Database, email: string, name: string): Promise<User> {
  // Buscar usuário existente
  const existingUser = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first<User>();
  
  if (existingUser) {
    return existingUser;
  }
  
  // Criar novo usuário admin automaticamente
  const result = await db
    .prepare(
      'INSERT INTO users (email, name, role, created_at) VALUES (?, ?, ?, ?) RETURNING *'
    )
    .bind(email, name, 'admin', Date.now())
    .first<User>();
  
  if (!result) {
    throw new Error('Falha ao criar usuário');
  }
  
  console.log('[Auto-provisioning] Novo usuário admin criado:', {
    email: result.email,
    name: result.name,
  });
  
  return result;
}

export type Context = Awaited<ReturnType<typeof createContext>>;
