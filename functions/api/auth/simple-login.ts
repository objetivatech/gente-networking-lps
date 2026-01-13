import type { PagesFunction } from "@cloudflare/workers-types";
import { createHmac } from "crypto";

interface Env {
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  ADMIN_EMAILS: string;
  JWT_SECRET: string;
}

const SECRET_FALLBACK = "gente-networking-default-secret-2026";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { username, password } = await context.request.json() as { username: string; password: string };

    const env = context.env;
    const adminUsername = env.ADMIN_USERNAME || "admin";
    const adminPassword = env.ADMIN_PASSWORD || "gente2026";

    console.log("[Simple Login] Login attempt for username:", username);

    // Validar credenciais
    if (username !== adminUsername || password !== adminPassword) {
      console.log("[Simple Login] Invalid credentials");
      return new Response(
        JSON.stringify({ message: "Credenciais inválidas" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extrair primeiro email da lista ADMIN_EMAILS
    const adminEmails = (env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
    const email = adminEmails[0] || "admin@gentenetworking.com.br";

    // Criar sessão
    const sessionData = {
      email,
      name: "Administrador",
      picture: "",
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 horas
    };

    const sessionJson = JSON.stringify(sessionData);
    const sessionBase64 = Buffer.from(sessionJson).toString("base64");

    // Assinar sessão
    const secret = env.JWT_SECRET || SECRET_FALLBACK;
    const signature = createHmac("sha256", secret)
      .update(sessionBase64)
      .digest("hex");

    const signedSession = `${sessionBase64}.${signature}`;

    console.log("[Simple Login] Login successful for:", email);

    // Criar cookie
    const cookieValue = `admin_session=${signedSession}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`;

    return new Response(
      JSON.stringify({ success: true, email }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieValue,
        },
      }
    );
  } catch (error) {
    console.error("[Simple Login] Error:", error);
    return new Response(
      JSON.stringify({ message: "Erro interno do servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
