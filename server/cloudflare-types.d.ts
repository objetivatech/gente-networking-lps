/**
 * Type definitions for Cloudflare Workers
 */

declare global {
  interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
    CF_ACCESS_TEAM_DOMAIN: string;
    CF_ACCESS_AUD: string;
  }
}

export {};
