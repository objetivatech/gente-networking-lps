export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Cloudflare Access handles authentication at the edge.
 * Users are automatically redirected to Cloudflare Access login when accessing protected routes.
 * No manual login URL needed - just navigate to the protected route.
 */
export const getLoginUrl = (redirectPath: string = "/admin") => {
  // Cloudflare Access automatically handles authentication
  // Just return the protected route, Cloudflare will intercept if not authenticated
  return redirectPath;
};
