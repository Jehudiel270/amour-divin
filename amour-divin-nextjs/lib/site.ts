export function getChurchName(value = process.env.NEXT_PUBLIC_CHURCH_NAME): string {
  const configured = value?.trim();
  if (!configured || /^[^A-Za-zÀ-ÿ]*glise\b/i.test(configured)) {
    return "Église Amour Divin";
  }

  return configured
    .replaceAll("Ã‰", "É")
    .replaceAll("ÃƒÂ‰", "É")
    .replace(/^.?glise\b/i, "Église");
}
