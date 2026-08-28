import type { Locale } from '@/lib/i18n';
import type { LegalContent } from './types';
import { fr } from './fr';
import { de } from './de';
import { it } from './it';
import { en } from './en';

/**
 * Le typage `Record<Locale, LegalContent>` fait échouer la compilation si une
 * locale est ajoutée sans son contenu légal — plus de page en français servie
 * sous `lang="de"`.
 */
const LEGAL: Record<Locale, LegalContent> = { fr, de, it, en };

export function getLegal(locale: Locale): LegalContent {
  return LEGAL[locale] ?? LEGAL.fr;
}

export type { LegalContent };
