/**
 * Cloudflare Access Authentication
 * 
 * This module handles authentication using Cloudflare Access JWT validation.
 * No external OAuth dependencies - Cloudflare Access handles everything at the edge.
 * 
 * Required environment variables:
 * - CF_ACCESS_TEAM_DOMAIN: Your Cloudflare Access team domain (e.g., https://your-team.cloudflareaccess.com)
 * - CF_ACCESS_AUD: Application Audience tag from Cloudflare Access dashboard
 */

import { jwtVerify, createRemoteJWKSet, type JWTPayload } from "jose";
import type { Request } from "express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ForbiddenError } from "@shared/_core/errors";

// Environment variables
const CF_ACCESS_TEAM_DOMAIN = process.env.CF_ACCESS_TEAM_DOMAIN || "";
const CF_ACCESS_AUD = process.env.CF_ACCESS_AUD || "";
const CERTS_URL = CF_ACCESS_TEAM_DOMAIN ? `${CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs` : "";

// Initialize JWKS only if team domain is configured
let JWKS: ReturnType<typeof createRemoteJWKSet> | null = null;
if (CERTS_URL) {
  try {
    JWKS = createRemoteJWKSet(new URL(CERTS_URL));
    console.log("[CloudflareAccess] Initialized with team domain:", CF_ACCESS_TEAM_DOMAIN);
  } catch (error) {
    console.error("[CloudflareAccess] Failed to initialize JWKS:", error);
  }
} else {
  console.warn("[CloudflareAccess] CF_ACCESS_TEAM_DOMAIN not configured - authentication disabled");
}

export interface CloudflareAccessPayload extends JWTPayload {
  email?: string;
  name?: string;
  sub?: string; // User ID from Cloudflare Access
  aud?: string | string[];
  iss?: string;
}

/**
 * Verify Cloudflare Access JWT from request headers
 * @param req Express request object
 * @returns Verified JWT payload or null if verification fails
 */
export async function verifyCloudflareAccessToken(
  req: Request
): Promise<CloudflareAccessPayload | null> {
  // Check if Cloudflare Access is configured
  if (!JWKS || !CF_ACCESS_AUD || !CF_ACCESS_TEAM_DOMAIN) {
    console.warn("[CloudflareAccess] Not configured - skipping JWT verification");
    return null;
  }

  // Get JWT from Cf-Access-Jwt-Assertion header (recommended by Cloudflare)
  const token = req.headers["cf-access-jwt-assertion"] as string | undefined;

  if (!token) {
    console.warn("[CloudflareAccess] Missing Cf-Access-Jwt-Assertion header");
    return null;
  }

  try {
    // Verify the JWT using Cloudflare's public keys
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: CF_ACCESS_TEAM_DOMAIN,
      audience: CF_ACCESS_AUD,
    });

    return payload as CloudflareAccessPayload;
  } catch (error) {
    console.error("[CloudflareAccess] JWT verification failed:", error);
    return null;
  }
}

/**
 * Authenticate request using Cloudflare Access
 * Creates/updates user in database based on Cloudflare Access JWT
 * @param req Express request object
 * @returns User object from database
 * @throws ForbiddenError if authentication fails
 */
export async function authenticateRequest(req: Request): Promise<User> {
  // Verify Cloudflare Access JWT
  const payload = await verifyCloudflareAccessToken(req);

  if (!payload || !payload.email) {
    throw ForbiddenError("Invalid or missing Cloudflare Access token");
  }

  const signedInAt = new Date();
  
  // Use email as the unique identifier
  const userEmail = payload.email;
  const userName = payload.name || payload.email.split("@")[0];

  // Check if user exists by email
  let user = await db.getUserByEmail(userEmail);

  if (!user) {
    // Create new user with Cloudflare Access info
    const openId = payload.sub || `cf-access-${userEmail}`;
    await db.upsertUser({
      openId,
      name: userName,
      email: userEmail,
      loginMethod: "cloudflare-access",
      lastSignedIn: signedInAt,
    });
    user = await db.getUserByEmail(userEmail);
  } else {
    // Update last signed in time
    await db.upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt,
    });
  }

  if (!user) {
    throw ForbiddenError("Failed to create or retrieve user");
  }

  return user;
}
