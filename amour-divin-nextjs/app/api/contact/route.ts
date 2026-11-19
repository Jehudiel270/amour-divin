import { NextResponse } from "next/server";
import { z } from "zod";

import { contactMessages } from "@/db/schema";
import { getDatabase } from "@/lib/db";

const contactInput = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(320),
  subject: z.enum(["Question sur mon compte", "Problème technique", "Signalement", "Partenariat", "Autre"]),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = contactInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Vérifiez les champs du formulaire." }, { status: 400 });
    const [item] = await getDatabase().insert(contactMessages).values({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    }).returning({ id: contactMessages.id, createdAt: contactMessages.createdAt });
    return NextResponse.json({ received: true, id: item.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Le formulaire de contact est indisponible." }, { status: 503 });
  }
}
