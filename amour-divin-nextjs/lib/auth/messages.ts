export function translateAuthError(error: unknown, fallback = "La demande n’a pas pu être effectuée. Réessayez.") {
  if (!error || typeof error !== "object") return fallback;

  const record = error as { code?: string; message?: string };
  const code = String(record.code ?? "").toUpperCase();
  const message = String(record.message ?? "").toLowerCase();

  if (code.includes("INVALID") && (code.includes("PASSWORD") || code.includes("CREDENTIAL"))) {
    return "Votre mot de passe actuel est incorrect.";
  }
  if (code === "INVALID_EMAIL_OR_PASSWORD" || message.includes("invalid email or password")) {
    return "Adresse e-mail ou mot de passe incorrect.";
  }
  if (code.includes("USER_NOT_FOUND") || message.includes("user not found") || message.includes("email not found")) {
    return "Aucun compte n’est associé à cette adresse e-mail.";
  }
  if (code.includes("EMAIL") && (code.includes("EXIST") || code.includes("ALREADY") || message.includes("already exists"))) {
    return "Un compte existe déjà avec cette adresse e-mail.";
  }
  if (code.includes("RATE") || message.includes("rate limit") || message.includes("too many")) {
    return "Trop de tentatives ont été effectuées. Attendez quelques minutes puis réessayez.";
  }
  if (code.includes("PASSWORD") && (code.includes("SHORT") || code.includes("LENGTH") || message.includes("password"))) {
    return "Le mot de passe doit contenir entre 8 et 128 caractères.";
  }
  if (code.includes("VERIFICATION") || message.includes("verify") || message.includes("verification")) {
    return "Veuillez d’abord vérifier votre adresse e-mail.";
  }
  if (code.includes("NETWORK") || message.includes("network") || message.includes("fetch")) {
    return "Le service d’authentification est momentanément indisponible.";
  }

  return fallback;
}
