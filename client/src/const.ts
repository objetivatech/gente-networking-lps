export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Cloudflare Access handles authentication at the edge.
 * Users must do a full page reload to trigger Cloudflare Access authentication.
 * SPA navigation (React Router) bypasses Cloudflare Access, so we need window.location.
 */
export const getLoginUrl = (redirectPath: string = "/admin") => {
  // Return full URL to force browser reload and trigger Cloudflare Access
  return window.location.origin + redirectPath;
};
