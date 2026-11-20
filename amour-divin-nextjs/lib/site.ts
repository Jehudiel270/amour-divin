export function getChurchName(value = process.env.NEXT_PUBLIC_CHURCH_NAME): string {
  const configured = value?.trim();
  if (!configured) return "Église Amour Divin";

  return configured
    .replaceAll("Ã‰", "É")
    .replace(/^(?:�|\\?)+glise\b/i, "Église");
}
