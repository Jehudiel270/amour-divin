import { getAuth } from "@/lib/auth/server";

type AuthMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type AuthRouteContext = { params: Promise<{ path: string[] }> };

async function handle(method: AuthMethod, request: Request, context: AuthRouteContext) {
  const { path } = await context.params;
  if (method === "POST" && path.join("/") === "sign-up/email") {
    return Response.json({ error: "Utilisez le formulaire d'inscription sécurisé." }, { status: 403 });
  }
  const handlers = getAuth().handler();
  return handlers[method](request, context);
}

export const GET = (request: Request, context: AuthRouteContext) => handle("GET", request, context);
export const POST = (request: Request, context: AuthRouteContext) => handle("POST", request, context);
export const PUT = (request: Request, context: AuthRouteContext) => handle("PUT", request, context);
export const PATCH = (request: Request, context: AuthRouteContext) => handle("PATCH", request, context);
export const DELETE = (request: Request, context: AuthRouteContext) => handle("DELETE", request, context);
