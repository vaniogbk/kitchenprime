export const locales = ['fr', 'de', 'it', 'en'] as const;
export const defaultLocale = 'fr' as const;
export type Locale = (typeof locales)[number];

export const isLocale = (v: unknown): v is Locale =>
  typeof v === 'string' && (locales as readonly string[]).includes(v);
