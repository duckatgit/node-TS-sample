export function validateFields<T extends Record<string, any>>(
  obj: T,
  requiredFields: (keyof T)[] = []
): { valid: true } | { valid: false; missingFields: (keyof T)[] } {
  const missing: (keyof T)[] = [];

  for (const field of requiredFields) {
    if (!obj[field]) {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    return {
      valid: false,
      missingFields: missing,
    };
  }

  return { valid: true };
}
