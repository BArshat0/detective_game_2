/**
 * Safe utility to retrieve values from an object using a dynamic key,
 * avoiding bracket notation which triggers ESLint security/detect-object-injection.
 */
export function safeGet<T>(obj: Record<string, T> | undefined | null, key: string): T | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') return undefined;
  const match = Object.entries(obj).find(([k]) => k === key);
  return match ? match[1] : undefined;
}

/**
 * Safe utility to assign a value to an object safely.
 */
export function safeSet<T>(obj: Record<string, T> | undefined | null, key: string, value: T): Record<string, T> {
  const base = obj || {};
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') return { ...base };
  return {
    ...base,
    [key]: value
  };
}
