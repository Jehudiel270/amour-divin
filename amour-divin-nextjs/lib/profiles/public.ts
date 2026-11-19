import "server-only";

import { and, eq, ilike } from "drizzle-orm";

import { profilePhotos, profiles } from "@/db/schema";
import { getDatabase } from "@/lib/db";

function calculateAge(birthDate: string) {
  const birth = new Date(`${birthDate}T00:00:00.000Z`);
  const today = new Date();
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const beforeBirthday = today.getUTCMonth() < birth.getUTCMonth()
    || (today.getUTCMonth() === birth.getUTCMonth() && today.getUTCDate() < birth.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export async function listPublicProfiles(city?: string, limit = 50) {
  const churchName = process.env.NEXT_PUBLIC_CHURCH_NAME?.trim();
  const filters = [eq(profiles.status, "active" as const), eq(profiles.isVisible, true), eq(profilePhotos.status, "approved" as const), eq(profilePhotos.position, 0)];
  if (churchName) filters.push(eq(profiles.church, churchName));
  if (city) filters.push(ilike(profiles.city, `%${city}%`));

  const rows = await getDatabase()
    .select({
      id: profiles.userId,
      firstName: profiles.firstName,
      birthDate: profiles.birthDate,
      city: profiles.city,
      profession: profiles.profession,
      church: profiles.church,
      bio: profiles.bio,
      values: profiles.faithValues,
      interests: profiles.interests,
      lookingFor: profiles.lookingFor,
      photo: profilePhotos.secureUrl,
    })
    .from(profiles)
    .innerJoin(profilePhotos, and(eq(profilePhotos.userId, profiles.userId), eq(profilePhotos.position, 0)))
    .where(and(...filters))
    .limit(limit);

  return rows.map(({ birthDate, ...profile }) => ({
    ...profile,
    age: calculateAge(birthDate),
    verified: false,
    lastSeen: "",
  }));
}

export async function getPublicProfile(userId: string) {
  const churchName = process.env.NEXT_PUBLIC_CHURCH_NAME?.trim();
  const [row] = await getDatabase()
    .select({
      id: profiles.userId,
      firstName: profiles.firstName,
      birthDate: profiles.birthDate,
      city: profiles.city,
      profession: profiles.profession,
      church: profiles.church,
      bio: profiles.bio,
      values: profiles.faithValues,
      interests: profiles.interests,
      lookingFor: profiles.lookingFor,
      photo: profilePhotos.secureUrl,
    })
    .from(profiles)
    .innerJoin(profilePhotos, and(eq(profilePhotos.userId, profiles.userId), eq(profilePhotos.position, 0), eq(profilePhotos.status, "approved")))
    .where(and(eq(profiles.userId, userId), eq(profiles.status, "active"), eq(profiles.isVisible, true), ...(churchName ? [eq(profiles.church, churchName)] : [])))
    .limit(1);

  if (!row) return undefined;
  const { birthDate, ...profile } = row;
  return { ...profile, age: calculateAge(birthDate), verified: false, lastSeen: "" };
}
