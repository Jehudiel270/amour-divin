import "server-only";

import { getAuth } from "@/lib/auth/server";

export async function getSession() {
  const { data } = await getAuth().getSession();
  return data ?? null;
}

export async function getCurrentUserId() {
  const session = await getSession();
  return session?.user?.id ?? null;
}
