/**
 * Endpoint de debug para simular validação de sessão do context.ts
 * Acesse: https://lps.gentenetworking.com.br/api/debug/validate-session
 */

interface Env {
  JWT_SECRET?: string;
}

interface SessionData {
  email: string;
  name: string;
  picture: string;
  exp: number;
}

export async function onRequest(context: EventContext<Env, any, Record<string, unknown>>) {
  const { request, env } = context;
  
  const debugSteps: any[] = [];
  
  // PASSO 1: Ler cookie
  const cookieHeader = request.headers.get('Cookie') || '';
  debugSteps.push({
    step: 1,
    name: 'Ler Cookie Header',
    success: !!cookieHeader,
    data: cookieHeader ? 'Cookie header presente' : 'Cookie header ausente',
  });
  
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...v] = c.trim().split('=');
      return [key, v.join('=')];
    })
  );
  
  const sessionCookie = cookies['admin_session'];
  debugSteps.push({
    step: 2,
    name: 'Encontrar admin_session',
    success: !!sessionCookie,
    data: sessionCookie ? `Cookie encontrado (${sessionCookie.length} chars)` : 'Cookie não encontrado',
  });
  
  if (!sessionCookie) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Cookie admin_session não encontrado',
      steps: debugSteps 
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // PASSO 3: Separar sessão e assinatura
  const parts = sessionCookie.split('.');
  const sessionB64 = parts[0];
  const signatureHex = parts[1];
  
  debugSteps.push({
    step: 3,
    name: 'Separar sessão e assinatura',
    success: !!(sessionB64 && signatureHex),
    data: {
      hasSession: !!sessionB64,
      hasSignature: !!signatureHex,
      sessionLength: sessionB64?.length || 0,
      signatureLength: signatureHex?.length || 0,
    },
  });
  
  if (!sessionB64 || !signatureHex) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Cookie malformado',
      steps: debugSteps 
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // PASSO 4: Verificar assinatura
  const jwtSecret = env.JWT_SECRET || 'gente-networking-default-secret-2026';
  debugSteps.push({
    step: 4,
    name: 'JWT_SECRET',
    success: true,
    data: {
      configured: !!env.JWT_SECRET,
      usingFallback: !env.JWT_SECRET,
    },
  });
  
  const expectedSignature = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(sessionB64 + jwtSecret)
  );
  const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const signatureMatch = signatureHex === expectedSignatureHex;
  debugSteps.push({
    step: 5,
    name: 'Verificar assinatura',
    success: signatureMatch,
    data: {
      receivedPrefix: signatureHex.substring(0, 16),
      expectedPrefix: expectedSignatureHex.substring(0, 16),
      match: signatureMatch,
    },
  });
  
  if (!signatureMatch) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Assinatura inválida',
      steps: debugSteps 
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // PASSO 6: Decodificar sessão
  let sessionData: SessionData;
  try {
    const sessionJson = atob(sessionB64);
    sessionData = JSON.parse(sessionJson);
    
    debugSteps.push({
      step: 6,
      name: 'Decodificar sessão',
      success: true,
      data: {
        email: sessionData.email,
        name: sessionData.name,
        exp: sessionData.exp,
      },
    });
  } catch (error) {
    debugSteps.push({
      step: 6,
      name: 'Decodificar sessão',
      success: false,
      data: error instanceof Error ? error.message : 'Erro desconhecido',
    });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Erro ao decodificar sessão',
      steps: debugSteps 
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // PASSO 7: Verificar expiração
  const now = Math.floor(Date.now() / 1000);
  const isExpired = sessionData.exp < now;
  
  debugSteps.push({
    step: 7,
    name: 'Verificar expiração',
    success: !isExpired,
    data: {
      exp: sessionData.exp,
      now: now,
      expiresIn: sessionData.exp - now,
      expired: isExpired,
    },
  });
  
  if (isExpired) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Sessão expirada',
      steps: debugSteps 
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // SUCESSO!
  return new Response(JSON.stringify({ 
    success: true,
    user: {
      email: sessionData.email,
      name: sessionData.name,
      picture: sessionData.picture,
    },
    steps: debugSteps 
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
