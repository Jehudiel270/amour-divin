import { redirect } from "next/navigation";

import { getAdminContext } from "@/lib/auth/authorization";

export const dynamic = "force-dynamic";

export default async function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  const context = await getAdminContext();
  if (!context) redirect("/decouvrir");
  return children;
}
