import { describe, it, expect } from 'vitest';
import {
  ALL_PAYMENT_METHODS,
  ENABLED_PAYMENT_METHODS,
  DEFAULT_PAYMENT_METHOD,
  isPaymentMethodEnabled,
  validateIban,
  validateBic,
  normalizeIban,
  formatIban,
} from '@/lib/payment';

describe('moyens de paiement', () => {
  it('n’active que le virement bancaire', () => {
    expect([...ENABLED_PAYMENT_METHODS]).toEqual(['wise']);
  });

  it('n’active que des moyens connus', () => {
    for (const m of ENABLED_PAYMENT_METHODS) {
      expect(ALL_PAYMENT_METHODS).toContain(m);
    }
  });

  it('propose par défaut un moyen effectivement activé', () => {
    expect(isPaymentMethodEnabled(DEFAULT_PAYMENT_METHOD)).toBe(true);
  });

  it('rejette un moyen désactivé ou inconnu', () => {
    expect(isPaymentMethodEnabled('card')).toBe(false);
    expect(isPaymentMethodEnabled('bitcoin')).toBe(false);
  });
});

describe('normalisation d’IBAN', () => {
  it('retire espaces et tirets et met en majuscules', () => {
    expect(normalizeIban(' fr76 3000-1007 9412 ')).toBe('FR76300010079412');
  });

  it('regroupe par blocs de quatre pour l’affichage', () => {
    expect(formatIban('FR7630001007941234567890185')).toBe(
      'FR76 3000 1007 9412 3456 7890 185',
    );
  });
});

describe('validation d’IBAN', () => {
  // La boutique n'encaisse que par virement : un IBAN erroné n'échoue nulle
  // part, il envoie simplement l'argent des clients à côté.
  const valides = [
    ['FR7630001007941234567890185', 'France'],
    ['DE89370400440532013000', 'Allemagne'],
    ['IT60X0542811101000000123456', 'Italie'],
    ['BE68539007547034', 'Belgique'],
    ['NL91ABNA0417164300', 'Pays-Bas'],
  ];

  for (const [iban, pays] of valides) {
    it(`accepte un IBAN ${pays} correct`, () => {
      expect(validateIban(iban).valid, `${pays} rejeté à tort`).toBe(true);
    });
  }

  it('accepte un IBAN saisi avec des espaces', () => {
    expect(validateIban('FR76 3000 1007 9412 3456 7890 185').valid).toBe(true);
  });

  it('rejette une clé de contrôle fausse', () => {
    // Dernier chiffre modifié : la structure reste valide, seul le mod-97 tombe.
    const r = validateIban('FR7630001007941234567890186');
    expect(r.valid).toBe(false);
    if (!r.valid) expect(r.reason).toMatch(/contrôle/i);
  });

  it('rejette une longueur incorrecte pour le pays', () => {
    const r = validateIban('FR763000100794123456789018');
    expect(r.valid).toBe(false);
    if (!r.valid) expect(r.reason).toMatch(/27 caractères/);
  });

  it('rejette un format non conforme', () => {
    for (const bad of ['', 'XX00', '1234567890', 'FRAB3000100794']) {
      expect(validateIban(bad).valid, `« ${bad} » accepté à tort`).toBe(false);
    }
  });

  it('rejette un IBAN dont un chiffre a été transposé', () => {
    // Erreur de saisie la plus courante : deux chiffres intervertis.
    const bon = 'FR7630001007941234567890185';
    const transpose = bon.slice(0, 10) + bon[11] + bon[10] + bon.slice(12);
    expect(transpose).not.toBe(bon);
    expect(validateIban(transpose).valid).toBe(false);
  });
});

describe('validation de BIC', () => {
  it('accepte 8 et 11 caractères', () => {
    expect(validateBic('BNPAFRPP').valid).toBe(true);
    expect(validateBic('BNPAFRPPXXX').valid).toBe(true);
  });

  it('tolère un champ vide, car facultatif', () => {
    expect(validateBic('').valid).toBe(true);
  });

  it('rejette une longueur ou une forme invalide', () => {
    for (const bad of ['NOPE', 'BNPAFRP', 'BNPAFRPPXX', '12345678']) {
      expect(validateBic(bad).valid, `« ${bad} » accepté à tort`).toBe(false);
    }
  });
});
