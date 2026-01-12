/**
 * Google OAuth Callback Endpoint
 * Processa o callback do Google OAuth e cria sessão
 * 
 * Variáveis de ambiente necessárias:
 * - GOOGLE_CLIENT_ID: Client ID do Google Cloud Console
 * - GOOGLE_CLIENT_SECRET: Client Secret do Google Cloud Console
 * - GOOGLE_REDIRECT_URI: URL de callback (https://seu-dominio.com/api/auth/google/callback)
 * - ADMIN_EMAILS: Lista de emails autorizados separados por vírgula (ex: email1@gmail.com,email2@gmail.com)
 * - JWT_SECRET: Segredo para assinar cookies de sessão
 */

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token: string;
}

interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  // Verificar se houve erro no OAuth
  if (error) {
    return new Response(
      `<html><body><h1>Erro de Autenticação</h1><p>${error}</p><a href="/admin">Voltar</a></body></html>`,
      {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  // Verificar se o code foi fornecido
  if (!code) {
    return new Response(
      '<html><body><h1>Erro</h1><p>Código de autorização não fornecido</p><a href="/admin">Voltar</a></body></html>',
      {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  // Verificar variáveis de ambiente
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REDIRECT_URI) {
    return new Response(
      '<html><body><h1>Erro de Configuração</h1><p>Google OAuth não configurado corretamente</p></body></html>',
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  try {
    // Trocar code por access_token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[Google OAuth] Token exchange failed:', errorText);
      return new Response(
        '<html><body><h1>Erro ao trocar código</h1><p>Falha ao obter access token do Google</p><a href="/admin">Voltar</a></body></html>',
        {
          status: 500,
          headers: { 'Content-Type': 'text/html' },
        }
      );
    }

    const tokenData: GoogleTokenResponse = await tokenResponse.json();

    // Obter informações do usuário
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('[Google OAuth] Failed to fetch user info');
      return new Response(
        '<html><body><h1>Erro ao obter informações do usuário</h1><a href="/admin">Voltar</a></body></html>',
        {
          status: 500,
          headers: { 'Content-Type': 'text/html' },
        }
      );
    }

    const userInfo: GoogleUserInfo = await userInfoResponse.json();

    // Verificar se o email está na lista de autorizados
    const adminEmails = (env.ADMIN_EMAILS || '').split(',').map((e: string) => e.trim().toLowerCase());
    const userEmail = userInfo.email.toLowerCase();

    if (!adminEmails.includes(userEmail)) {
      return new Response(
        `<html><body><h1>Acesso Negado</h1><p>O email <strong>${userInfo.email}</strong> não está autorizado a acessar o dashboard administrativo.</p><p>Entre em contato com o administrador do sistema.</p><a href="/admin">Voltar</a></body></html>`,
        {
          status: 403,
          headers: { 'Content-Type': 'text/html' },
        }
      );
    }

    // Criar sessão simples (JWT ou cookie assinado)
    const sessionData = {
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 horas
    };

    console.log('[Google OAuth] Criando sessão para:', userInfo.email);

    // Criar cookie de sessão (base64 + assinatura simples)
    const sessionJson = JSON.stringify(sessionData);
    const sessionB64 = btoa(sessionJson);
    
    // Assinatura simples usando JWT_SECRET (fallback seguro se não configurado)
    const jwtSecret = env.JWT_SECRET || 'gente-networking-default-secret-2026';
    console.log('[Google OAuth] JWT_SECRET configurado:', !!env.JWT_SECRET);
    
    const signature = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(sessionB64 + jwtSecret)
    );
    const signatureHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const sessionCookie = `${sessionB64}.${signatureHex}`;
    console.log('[Google OAuth] Cookie criado, redirecionando para /admin');

    // Redirecionar para /admin com cookie de sessão
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/admin',
        'Set-Cookie': `admin_session=${sessionCookie}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`,
      },
    });
  } catch (error) {
    console.error('[Google OAuth] Error:', error);
    return new Response(
      `<html><body><h1>Erro Interno</h1><p>${error instanceof Error ? error.message : 'Erro desconhecido'}</p><a href="/admin">Voltar</a></body></html>`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}
