import "server-only";

import { eq } from "drizzle-orm";

import { adminPermissions, profiles } from "@/db/schema";
import { getSession } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";

export type AdminPermission = "dashboard" | "users" | "profiles" | "reports" | "contact" | "billing" | "content";

export async function getAdminContext(requiredPermission?: AdminPermission) {
  const session = await getSession();
  const userId = session?.user?.id ?? null;
  if (!userId) return null;

  const db = getDatabase();
  let [profile] = await db.select({ role: profiles.role }).from(profiles).where(eq(profiles.userId, userId)).limit(1);
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const sessionEmail = session?.user?.email?.trim().toLowerCase();

  if (profile && superAdminEmail && sessionEmail === superAdminEmail && profile.role !== "super_admin") {
    await db.update(profiles).set({ role: "super_admin", updatedAt: new Date() }).where(eq(profiles.userId, userId));
    profile = { role: "super_admin" };
  }

  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) return null;
  if (profile.role === "super_admin") {
    return {
      userId,
      role: "super_admin" as const,
      permissions: ["dashboard", "users", "profiles", "reports", "contact", "billing", "content"] as AdminPermission[],
    };
  }

  const permissions = await db.select({ permission: adminPermissions.permission })
    .from(adminPermissions).where(eq(adminPermissions.userId, userId));
  const list = permissions.map((item) => item.permission as AdminPermission);
  if (requiredPermission && !list.includes(requiredPermission)) return null;
  return { userId, role: "admin" as const, permissions: list };
}

export async function getAdminUserId(requiredPermission?: AdminPermission) {
  const context = await getAdminContext(requiredPermission);
  return context?.userId ?? null;
}
