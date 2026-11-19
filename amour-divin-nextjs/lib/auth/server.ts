import "server-only";

import { createNeonAuth } from "@neon/auth/next/server";

let authInstance: ReturnType<typeof createNeonAuth> | undefined;

export function getAuth() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !cookieSecret) {
    throw new Error("La configuration de l’authentification Neon est incomplète.");
  }

  if (!authInstance) {
    authInstance = createNeonAuth({
      baseUrl,
      cookies: { secret: cookieSecret },
    });
  }

  return authInstance;
}
