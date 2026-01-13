/**
 * Endpoint de debug para diagnosticar problema de sessão
 * Acesse: https://lps.gentenetworking.com.br/api/debug/session
 */

interface Env {
  ADMIN_EMAILS: string;
  JWT_SECRET?: string;
}

export async function onRequest(context: EventContext<Env, any, Record<string, unknown>>) {
  const { request, env } = context;
  
  // Ler todos os cookies
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = cookieHeader.split(';').map(c => c.trim());
  
  // Procurar cookie admin_session
  const adminSessionCookie = cookies.find(c => c.startsWith('admin_session='));
  const adminSessionValue = adminSessionCookie ? adminSessionCookie.split('=')[1] : null;
  
  // Verificar variáveis de ambiente
  const adminEmails = env.ADMIN_EMAILS || 'NOT_SET';
  const jwtSecret = env.JWT_SECRET || 'NOT_SET';
  
  // Montar resposta de debug
  const debugInfo = {
    timestamp: new Date().toISOString(),
    url: request.url,
    method: request.method,
    headers: {
      cookie: cookieHeader || 'NO_COOKIE_HEADER',
      userAgent: request.headers.get('User-Agent'),
      referer: request.headers.get('Referer'),
    },
    cookies: {
      all: cookies.length > 0 ? cookies : ['NO_COOKIES'],
      adminSession: adminSessionValue || 'NOT_FOUND',
    },
    env: {
      adminEmails: adminEmails,
      jwtSecretConfigured: jwtSecret !== 'NOT_SET',
      jwtSecretValue: jwtSecret === 'NOT_SET' ? 'NOT_SET' : '***HIDDEN***',
    },
    diagnosis: {
      hasCookieHeader: !!cookieHeader,
      hasAdminSessionCookie: !!adminSessionValue,
      adminEmailsConfigured: adminEmails !== 'NOT_SET',
      jwtSecretConfigured: jwtSecret !== 'NOT_SET',
    }
  };
  
  return new Response(JSON.stringify(debugInfo, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
