const TRUTHY_VALUES = new Set(["true", "1", "on", "enabled"]);
const FALSEY_VALUES = new Set(["false", "0", "off", "disabled"]);

function resolveBooleanFlag(rawValue: string | undefined, fallback: boolean): boolean {
  if (typeof rawValue !== "string") {
    return fallback;
  }

  const normalized = rawValue.trim().toLowerCase();
  if (TRUTHY_VALUES.has(normalized)) {
    return true;
  }
  if (FALSEY_VALUES.has(normalized)) {
    return false;
  }

  return fallback;
}

export const CART_ENABLED = resolveBooleanFlag(import.meta.env.VITE_CART_ENABLED, true);
