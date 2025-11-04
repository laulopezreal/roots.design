const FALSEY_VALUES = new Set(["false", "0", "off", "disabled"]);

function resolveBooleanFlag(rawValue: string | undefined, fallback: boolean): boolean {
  if (typeof rawValue !== "string") {
    return fallback;
  }

  const normalized = rawValue.trim().toLowerCase();
  if (normalized.length === 0) {
    return fallback;
  }

  return !FALSEY_VALUES.has(normalized);
}

export const CART_ENABLED = resolveBooleanFlag(import.meta.env.VITE_CART_ENABLED, true);
