/**
 * Google OAuth Login Endpoint
 * Inicia o fluxo de autenticação Google OAuth 2.0
 * 
 * Variáveis de ambiente necessárias:
 * - GOOGLE_CLIENT_ID: Client ID do Google Cloud Console
 * - GOOGLE_REDIRECT_URI: URL de callback (https://seu-dominio.com/api/auth/google/callback)
 */

export async function onRequest(context: any) {
  const { env } = context;

  // Verificar variáveis de ambiente
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_REDIRECT_URI) {
    return new Response(
      JSON.stringify({
        error: 'Google OAuth não configurado. Configure GOOGLE_CLIENT_ID e GOOGLE_REDIRECT_URI nas variáveis de ambiente.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Construir URL de autorização do Google
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', env.GOOGLE_REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('access_type', 'online');
  authUrl.searchParams.set('prompt', 'select_account');

  // Redirecionar para Google OAuth
  return Response.redirect(authUrl.toString(), 302);
}
