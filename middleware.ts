import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/stellen(.*)",
  "/templates(.*)",
  "/einstellungen(.*)",
  "/api/jobs(.*)",
  "/api/templates(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Only run middleware on protected/authenticated routes.
    // Public routes (/, /sign-in, /sign-up, /bewerben, static assets) are excluded
    // so that missing Clerk env vars do not cause 500 errors on the landing page.
    "/stellen(.*)",
    "/templates(.*)",
    "/einstellungen(.*)",
    "/api/jobs(.*)",
    "/api/templates(.*)",
    "/api/webhooks(.*)",
  ],
};
