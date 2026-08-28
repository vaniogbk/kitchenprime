/**
 * Moyens de paiement proposés sur la boutique.
 *
 * Source unique, partagée par le tunnel de commande et l'API : impossible que
 * l'interface propose un moyen que le serveur refuse, ou l'inverse. Réactiver
 * la carte se fait en ajoutant `'card'` à `ENABLED_PAYMENT_METHODS` — tout le
 * code des processeurs (Stripe, Mollie, Adyen, SumUp) reste en place.
 */
export const ALL_PAYMENT_METHODS = ['card', 'wise'] as const;
export type PaymentMethod = (typeof ALL_PAYMENT_METHODS)[number];

/** Actuellement : virement bancaire uniquement. */
export const ENABLED_PAYMENT_METHODS: readonly PaymentMethod[] = ['wise'];

export const isPaymentMethodEnabled = (m: string): m is PaymentMethod =>
  (ENABLED_PAYMENT_METHODS as readonly string[]).includes(m);

/** Moyen retenu par défaut dans le tunnel. */
export const DEFAULT_PAYMENT_METHOD: PaymentMethod = ENABLED_PAYMENT_METHODS[0] ?? 'wise';

/* ─────────────────────────── Validation d'IBAN ───────────────────────────
 * La boutique n'encaisse que par virement : l'IBAN affiché aux clients est
 * la donnée la plus critique du site. Une faute de frappe n'y provoque aucune
 * erreur visible — elle envoie simplement l'argent nulle part.
 * ------------------------------------------------------------------------ */

/** Longueur attendue de l'IBAN par pays, pour les pays desservis. */
const IBAN_LENGTHS: Record<string, number> = {
  FR: 27, DE: 22, IT: 27, BE: 16, CH: 21, ES: 24, NL: 18,
  LU: 20, AT: 20, PT: 25, IE: 22, GB: 22, PL: 28, MC: 27,
};

/** Retire espaces et tirets, met en majuscules. */
export const normalizeIban = (raw: string) => raw.replace(/[\s-]/g, '').toUpperCase();

/** Regroupe par blocs de 4 pour l'affichage. */
export const formatIban = (raw: string) =>
  normalizeIban(raw).replace(/(.{4})/g, '$1 ').trim();

export type IbanCheck = { valid: true } | { valid: false; reason: string };

/**
 * Valide un IBAN : structure, longueur nationale, puis somme de contrôle
 * mod-97 (norme ISO 7064). Le mod-97 est calculé chiffre par chiffre, car le
 * nombre obtenu dépasse largement la précision d'un entier JavaScript.
 */
export function validateIban(raw: string): IbanCheck {
  const iban = normalizeIban(raw);

  if (iban.length === 0) return { valid: false, reason: 'IBAN vide.' };
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) {
    return {
      valid: false,
      reason: 'Format invalide : deux lettres de pays, deux chiffres de contrôle, puis le numéro de compte.',
    };
  }

  const country = iban.slice(0, 2);
  const expected = IBAN_LENGTHS[country];
  if (expected && iban.length !== expected) {
    return {
      valid: false,
      reason: `Un IBAN ${country} compte ${expected} caractères, celui-ci en a ${iban.length}.`,
    };
  }
  if (iban.length < 15 || iban.length > 34) {
    return { valid: false, reason: 'Longueur hors des bornes admises (15 à 34 caractères).' };
  }

  // Les quatre premiers caractères passent à la fin, les lettres deviennent
  // des nombres (A=10 … Z=35), puis le reste modulo 97 doit valoir 1.
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const digits = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));

  let remainder = 0;
  for (const d of digits) remainder = (remainder * 10 + Number(d)) % 97;

  if (remainder !== 1) {
    return { valid: false, reason: 'Clé de contrôle incorrecte — vérifiez la saisie.' };
  }
  return { valid: true };
}

/** Valide un BIC/SWIFT (8 ou 11 caractères). Champ facultatif. */
export function validateBic(raw: string): IbanCheck {
  const bic = raw.replace(/\s/g, '').toUpperCase();
  if (bic.length === 0) return { valid: true };
  if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic)) {
    return { valid: false, reason: 'BIC invalide : 8 ou 11 caractères (ex. BNPAFRPPXXX).' };
  }
  return { valid: true };
}
