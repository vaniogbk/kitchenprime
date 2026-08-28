/**
 * Modèle des pages légales (CGV, mentions, retours, contact).
 *
 * Le texte est stocké comme donnée plutôt que dans du JSX : une seule page
 * générique le rend, et une traduction manquante devient une erreur de type
 * plutôt qu'une page en français servie sous `lang="de"`.
 *
 * Ce contenu n'est lu que par des Server Components : il ne part jamais dans
 * le bundle client.
 */

/** Balisage accepté dans les textes : `**gras**` et `[libellé](url)`. */
export type RichText = string;

export type Block =
  | { t: 'p'; text: RichText }
  | { t: 'ul'; items: RichText[] }
  | { t: 'ol'; items: RichText[] };

export type Section = {
  h: string;
  blocks: Block[];
};

export type LegalPage = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Encadré mis en avant en tête de page. */
  highlight?: { strong: string; text: string };
  sections: Section[];
  /** Libellé du bouton de retour à l'accueil. */
  back: string;
};

/** Coordonnées affichées sur la page contact. */
export type ContactPage = LegalPage & {
  cards: {
    whatsapp: { title: string; note: string };
    email: { title: string; note: string };
    address: { title: string; value: string; note: string };
  };
  hours: { title: string; rows: Array<[string, string]>; closedLabel: string; closedValue: string };
};

export type LegalContent = {
  cgv: LegalPage;
  legal: LegalPage;
  returns: LegalPage;
  contact: ContactPage;
};
