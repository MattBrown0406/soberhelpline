export function fitSeoTitle(value: string, maxLength = 60): string {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;

  const suffix = " | Sober Helpline";
  if (cleaned.endsWith(suffix)) {
    const base = cleaned.slice(0, -suffix.length).trim();
    const maxBaseLength = maxLength - suffix.length;
    return `${base.slice(0, Math.max(1, maxBaseLength - 3)).trimEnd()}...${suffix}`;
  }

  return `${cleaned.slice(0, Math.max(1, maxLength - 3)).trimEnd()}...`;
}

export function fitSeoDescription(value: string, maxLength = 160): string {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, Math.max(1, maxLength - 3)).trimEnd()}...`;
}
