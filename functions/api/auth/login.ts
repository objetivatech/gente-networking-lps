/**
 * Endpoint de login que força autenticação via Cloudflare Access
 * 
 * Este endpoint é protegido pelo Cloudflare Access.
 * Quando o usuário acessa, o Cloudflare Access intercepta e força login.
 * Após autenticação bem-sucedida, redireciona de volta para /admin.
 */

interface Env {
  CF_ACCESS_TEAM_DOMAIN: string;
  CF_ACCESS_AUD: string;
}

export async function onRequest(context: EventContext<Env, any, Record<string, unknown>>) {
  const { request } = context;
  
  // Verificar se tem JWT do Cloudflare Access
  const cfAccessJwt = request.headers.get('Cf-Access-Jwt-Assertion');
  
  if (cfAccessJwt) {
    // Autenticado! Redirecionar para /admin
    return Response.redirect(new URL('/admin', request.url), 302);
  }
  
  // Não autenticado - Cloudflare Access vai interceptar e forçar login
  return new Response('Redirecting to login...', {
    status: 401,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
