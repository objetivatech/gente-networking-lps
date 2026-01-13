import type { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  JWT_SECRET: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
}

// Mesma função do simple-login.ts
async function signCookie(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );
  
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Mesma função do context.ts
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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const env = context.env;
    const JWT_SECRET = env.JWT_SECRET || "gente-networking-default-secret-2026";
    
    // PASSO 1: Criar sessão (simular login)
    const sessionData = {
      email: "test@admin.local",
      name: "Test Admin",
      picture: "",
      exp: Math.floor(Date.now() / 1000) + 86400,
    };
    
    const sessionJson = JSON.stringify(sessionData);
    const sessionBase64 = btoa(sessionJson);
    
    // PASSO 2: Assinar sessão
    const signature = await signCookie(sessionBase64, JWT_SECRET);
    const signedSession = `${sessionBase64}.${signature}`;
    
    // PASSO 3: Validar sessão (simular context.ts)
    const [receivedSessionB64, receivedSignature] = signedSession.split('.');
    const isValid = await verifyCookie(receivedSessionB64, receivedSignature, JWT_SECRET);
    
    // PASSO 4: Decodificar e verificar
    const decodedJson = atob(receivedSessionB64);
    const decodedData = JSON.parse(decodedJson);
    
    return new Response(
      JSON.stringify({
        success: true,
        test: "Fluxo completo de autenticação",
        steps: {
          "1_create_session": {
            sessionData,
            sessionBase64: sessionBase64.substring(0, 50) + "...",
            sessionBase64Length: sessionBase64.length,
          },
          "2_sign_session": {
            signature: signature.substring(0, 32) + "...",
            signatureLength: signature.length,
            signedSession: signedSession.substring(0, 80) + "...",
          },
          "3_validate_session": {
            receivedSessionB64Match: receivedSessionB64 === sessionBase64,
            receivedSignatureMatch: receivedSignature === signature,
            isValid,
            validationResult: isValid ? "✅ ASSINATURA VÁLIDA" : "❌ ASSINATURA INVÁLIDA",
          },
          "4_decode_session": {
            decodedData,
            dataMatch: decodedData.email === sessionData.email,
          },
        },
        environment: {
          JWT_SECRET_configured: !!env.JWT_SECRET,
          JWT_SECRET_value: JWT_SECRET === "gente-networking-default-secret-2026" ? "usando fallback" : "configurado",
          ADMIN_USERNAME: env.ADMIN_USERNAME || "não configurado",
          ADMIN_PASSWORD: env.ADMIN_PASSWORD ? "configurado" : "não configurado",
        },
        conclusion: isValid 
          ? "✅ Fluxo de autenticação funcionando corretamente! Se o login não funciona, o problema está no frontend ou no cookie não sendo enviado."
          : "❌ Fluxo de autenticação com problema! Assinaturas não batem.",
      }, null, 2),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: String(error),
        message: "Erro ao testar autenticação",
      }, null, 2),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
