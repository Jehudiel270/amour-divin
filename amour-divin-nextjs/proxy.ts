import { getAuth } from "@/lib/auth/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  return getAuth().middleware({ loginUrl: "/connexion" })(request);
}

export const config = {
  matcher: [
    "/creation-profil/:path*",
    "/decouvrir/:path*",
    "/favoris/:path*",
    "/demandes/:path*",
    "/matchs/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/reglages/:path*",
    "/signaler/:path*",
    "/profil/:path*",
    "/admin/:path*",
  ],
};
