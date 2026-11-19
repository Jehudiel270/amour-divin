"use server";

import { z } from "zod";

import { legalConsents, profiles } from "@/db/schema";
import { getAuth } from "@/lib/auth/server";
import { getDatabase } from "@/lib/db";

const registrationInput = z.object({
  firstName: z.string().trim().min(1).max(80),
  email: z.email(),
  password: z.string().min(8).max(128),
  birthDate: z.iso.date(),
  ageConfirm: z.literal("on"),
  terms: z.literal("on"),
});

function isAdult(birthDate: string) {
  const birth = new Date(`${birthDate}T00:00:00.000Z`);
  const now = new Date();
  const latestMinorBirthDate = new Date(Date.UTC(now.getUTCFullYear() - 18, now.getUTCMonth(), now.getUTCDate()));
  return Number.isFinite(birth.getTime()) && birth <= latestMinorBirthDate;
}

export async function registerWithEmail(formData: FormData) {
  const parsed = registrationInput.safeParse({
    firstName: formData.get("firstName"),
    email: formData.get("email"),
    password: formData.get("password"),
    birthDate: formData.get("birthDate"),
    ageConfirm: formData.get("ageConfirm"),
    terms: formData.get("terms"),
  });

  if (!parsed.success) return { error: "Vérifiez les champs obligatoires et acceptez les conditions." };
  if (!isAdult(parsed.data.birthDate)) return { error: "Le service est réservé aux personnes majeures." };

  try {
    const result = await getAuth().signUp.email({
      name: parsed.data.firstName,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (result.error) return { error: result.error.message || "La création du compte a échoué." };
    if (!result.data?.user?.id) return { error: "Le compte n'a pas pu être confirmé. Réessayez." };

    const db = getDatabase();
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    const accountEmail = parsed.data.email.trim().toLowerCase();
    await db.insert(profiles).values({
      userId: result.data.user.id,
      firstName: parsed.data.firstName,
      birthDate: parsed.data.birthDate,
      church: process.env.NEXT_PUBLIC_CHURCH_NAME || "Église Amour Divin",
      status: "draft",
      role: superAdminEmail && accountEmail === superAdminEmail ? "super_admin" : "member",
    }).onConflictDoNothing();

    await db.insert(legalConsents).values([
      { userId: result.data.user.id, consentType: "terms", documentVersion: "2026-11-18" },
      { userId: result.data.user.id, consentType: "privacy", documentVersion: "2026-11-18" },
    ]).onConflictDoNothing();

    return { success: "Compte créé. Vérifiez votre adresse e-mail, puis connectez-vous pour créer votre profil." };
  } catch {
    return { error: "Inscription indisponible. Vérifiez la configuration ou réessayez plus tard." };
  }
}
