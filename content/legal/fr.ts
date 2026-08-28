import type { LegalContent } from './types';

const MAIL = 'kitchenprime@outlook.com';
const ADDRESS = '539 route de Saint-Joseph CS 20811 — 44308 Nantes Cedex 3, France';
const SIRET = '622 028 777 02677';
const PHONE = '+33 7 56 97 65 02';

export const fr: LegalContent = {
  cgv: {
    eyebrow: 'Contrat de vente',
    title: 'Conditions générales de vente',
    subtitle: 'Dernière mise à jour : août 2026',
    back: 'Retour à l’accueil',
    sections: [
      {
        h: 'Article 1 — Objet et champ d’application',
        blocks: [
          {
            t: 'p',
            text: `Les présentes Conditions Générales de Vente (CGV) régissent l’ensemble des ventes conclues entre **KitchenPrime** (${ADDRESS}, SIRET ${SIRET}) et tout acheteur consommateur ou professionnel, via le site kitchenprime.com ou tout autre support de commande.`,
          },
          {
            t: 'p',
            text: 'KitchenPrime commercialise des robots culinaires **Thermomix® TM7 d’occasion reconditionnés**, des accessoires et livres associés, ainsi que de l’électroménager et des équipements de maison connectée neufs. KitchenPrime n’est pas un revendeur officiel Vorwerk.',
          },
        ],
      },
      {
        h: 'Article 2 — Prix',
        blocks: [
          {
            t: 'p',
            text: 'Les prix affichés sont indiqués en euros (€) **toutes taxes comprises (TTC)**, TVA française applicable. KitchenPrime se réserve le droit de modifier ses prix à tout moment ; les produits sont facturés au prix en vigueur au moment de la validation de la commande.',
          },
          { t: 'p', text: 'Les frais de livraison sont offerts sur toute commande destinée à la France métropolitaine.' },
        ],
      },
      {
        h: 'Article 3 — Commandes',
        blocks: [
          {
            t: 'p',
            text: 'La commande est validée à la réception du paiement intégral. KitchenPrime accuse réception par e-mail dans un délai de 24 h. Toute commande vaut acceptation des présentes CGV.',
          },
          {
            t: 'p',
            text: 'KitchenPrime se réserve le droit d’annuler ou de refuser toute commande avec motif légitime (rupture de stock, anomalie de prix, suspicion de fraude), avec remboursement intégral dans les 14 jours.',
          },
        ],
      },
      {
        h: 'Article 4 — Paiement',
        blocks: [
          { t: 'p', text: 'Les modes de paiement acceptés sont :' },
          {
            t: 'ul',
            items: [
              'Carte bancaire (Visa, Mastercard)',
              'Virement bancaire (SEPA et international)',
              'Apple Pay',
            ],
          },
          { t: 'p', text: 'Le paiement est sécurisé par chiffrement SSL/TLS. KitchenPrime ne conserve aucune donnée bancaire.' },
        ],
      },
      {
        h: 'Article 5 — Livraison',
        blocks: [
          {
            t: 'p',
            text: 'Les commandes sont expédiées en France et dans l’Union européenne. Les délais estimatifs sont de **3 à 7 jours ouvrés** après confirmation du paiement. En cas de retard supérieur à 30 jours, le client peut annuler la commande et sera intégralement remboursé.',
          },
          {
            t: 'p',
            text: 'KitchenPrime ne peut être tenu responsable de retards imputables au transporteur ou à des événements de force majeure.',
          },
        ],
      },
      {
        h: 'Article 6 — Droit de rétractation',
        blocks: [
          {
            t: 'p',
            text: 'Conformément aux articles L221-18 et suivants du Code de la consommation, le consommateur dispose d’un **délai de 14 jours calendaires** à compter de la réception du produit pour exercer son droit de rétractation, sans motif à fournir.',
          },
          {
            t: 'p',
            text: `Pour exercer ce droit, contactez-nous par e-mail à [${MAIL}](mailto:${MAIL}) ou via WhatsApp avant l’expiration du délai. Le remboursement intégral intervient dans les **14 jours** suivant la réception du retour, par le même moyen de paiement.`,
          },
          { t: 'p', text: 'Les frais de retour sont à la charge du client, sauf si le produit est défectueux ou non conforme.' },
        ],
      },
      {
        h: 'Article 7 — Garanties légales',
        blocks: [
          { t: 'p', text: 'Les produits bénéficient de :' },
          {
            t: 'ul',
            items: [
              '**Garantie légale de conformité** (art. L217-4 C. conso) : 2 ans pour les produits neufs, 1 an pour les produits d’occasion, pour tout défaut existant au moment de la délivrance.',
              '**Garantie légale des vices cachés** (art. 1641 C. civ.) : 2 ans à compter de la découverte du vice.',
              '**Garantie commerciale KitchenPrime** : 24 mois pièces et main-d’œuvre sur les robots reconditionnés.',
            ],
          },
          {
            t: 'p',
            text: 'En cas de produit non conforme, KitchenPrime prend en charge les frais de retour et procède à la réparation, au remplacement ou au remboursement intégral, au choix du client.',
          },
        ],
      },
      {
        h: 'Article 8 — Protection des données',
        blocks: [
          {
            t: 'p',
            text: `Les données personnelles collectées (nom, adresse, e-mail, téléphone) sont utilisées exclusivement pour l’exécution des commandes. Conformément au RGPD, vous pouvez exercer vos droits à [${MAIL}](mailto:${MAIL}).`,
          },
        ],
      },
      {
        h: 'Article 9 — Médiation de la consommation',
        blocks: [
          {
            t: 'p',
            text: 'En cas de litige non résolu à l’amiable, le consommateur peut recourir gratuitement à un médiateur de la consommation agréé. La Commission européenne met également à disposition une plateforme de règlement en ligne des litiges : [ec.europa.eu/consumers/odr](https://ec.europa.eu/consumers/odr).',
          },
        ],
      },
      {
        h: 'Article 10 — Loi applicable et juridiction',
        blocks: [
          {
            t: 'p',
            text: 'Les présentes CGV sont soumises au droit français. Tout litige relève de la compétence des juridictions du ressort du Tribunal de commerce de Nantes, sauf disposition légale contraire applicable aux consommateurs.',
          },
        ],
      },
    ],
  },

  legal: {
    eyebrow: 'Informations légales',
    title: 'Mentions légales',
    back: 'Retour à l’accueil',
    sections: [
      {
        h: '1. Éditeur du site',
        blocks: [
          { t: 'p', text: 'Le présent site est édité par :' },
          {
            t: 'ul',
            items: [
              '**Raison sociale :** KitchenPrime',
              '**Forme juridique :** société commerciale',
              `**Adresse :** ${ADDRESS}`,
              `**SIRET :** ${SIRET}`,
              `**E-mail :** [${MAIL}](mailto:${MAIL})`,
              '**Directeur de la publication :** KitchenPrime',
            ],
          },
        ],
      },
      {
        h: '2. Hébergeur',
        blocks: [
          {
            t: 'ul',
            items: [
              '**Société :** Vercel Inc.',
              '**Adresse :** 340 Pine Street, Suite 701 — San Francisco, CA 94104, États-Unis',
              '**Site web :** [vercel.com](https://vercel.com)',
            ],
          },
        ],
      },
      {
        h: '3. Propriété intellectuelle',
        blocks: [
          {
            t: 'p',
            text: 'L’ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, logiciels) est la propriété exclusive de KitchenPrime, à l’exception des contenus provenant de partenaires ou licenciés. Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est interdite.',
          },
          {
            t: 'p',
            text: 'Les marques **Thermomix®** et **Vorwerk®** sont des marques déposées de Vorwerk & Co. KG. Les marques **Samsung®**, **Google Nest®**, **Dyson®** et **Ninja®** appartiennent à leurs détenteurs respectifs. KitchenPrime n’est agréé par aucune de ces marques et agit de manière indépendante.',
          },
        ],
      },
      {
        h: '4. Données personnelles',
        blocks: [
          {
            t: 'p',
            text: 'Les informations collectées lors de vos commandes sont traitées conformément au Règlement général sur la protection des données (RGPD — UE 2016/679). Elles sont utilisées exclusivement pour le traitement des commandes et ne sont pas cédées à des tiers.',
          },
          {
            t: 'p',
            text: `Vous disposez d’un droit d’accès, de rectification et de suppression de vos données. Pour l’exercer, contactez-nous à [${MAIL}](mailto:${MAIL}).`,
          },
        ],
      },
      {
        h: '5. Cookies',
        blocks: [
          {
            t: 'p',
            text: 'Ce site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement (session, panier, préférence de langue). Aucun cookie publicitaire tiers n’est déposé.',
          },
        ],
      },
      {
        h: '6. Loi applicable',
        blocks: [
          {
            t: 'p',
            text: 'Les présentes mentions légales sont soumises au droit français. Tout litige relève de la compétence exclusive des juridictions françaises.',
          },
        ],
      },
    ],
  },

  returns: {
    eyebrow: 'Retours & remboursements',
    title: 'Politique de retour',
    subtitle: 'Votre satisfaction est notre priorité',
    back: 'Retour à l’accueil',
    highlight: {
      strong: '14 jours pour changer d’avis',
      text: 'Retournez votre produit sans justification dans les 14 jours suivant la réception.',
    },
    sections: [
      {
        h: 'Comment initier un retour ?',
        blocks: [
          {
            t: 'ol',
            items: [
              `Contactez-nous par e-mail à [${MAIL}](mailto:${MAIL}) ou via WhatsApp au **${PHONE}**`,
              'Indiquez votre numéro de commande et la raison du retour',
              'Nous vous envoyons les instructions d’emballage et l’adresse de retour sous 24 h',
              'Expédiez le produit soigneusement emballé dans son état d’origine',
            ],
          },
        ],
      },
      {
        h: 'Conditions de retour',
        blocks: [
          {
            t: 'ul',
            items: [
              'Le produit doit être retourné **dans son état d’origine**, complet (accessoires et manuels inclus)',
              'Délai de retour : **14 jours calendaires** à compter de la date de réception',
              'Les frais de retour sont à la charge du client, sauf produit défectueux ou non conforme',
              'Les produits endommagés par le client ne peuvent être remboursés',
            ],
          },
        ],
      },
      {
        h: 'Remboursement',
        blocks: [
          {
            t: 'p',
            text: 'Dès réception et contrôle du retour, le remboursement est effectué dans un délai de **14 jours maximum**, par le même moyen de paiement que celui utilisé lors de l’achat.',
          },
          {
            t: 'ul',
            items: [
              '**Carte bancaire :** 3 à 5 jours ouvrés après validation',
              '**Virement bancaire :** 1 à 3 jours ouvrés',
            ],
          },
        ],
      },
      {
        h: 'Produit défectueux ou non conforme',
        blocks: [
          {
            t: 'p',
            text: 'Si votre produit présente un défaut ou n’est pas conforme à la description, KitchenPrime prend **intégralement en charge les frais de retour** et vous propose :',
          },
          {
            t: 'ul',
            items: [
              'Un remplacement par un appareil équivalent',
              'Un remboursement intégral',
              'Une réparation, selon la nature du défaut',
            ],
          },
          {
            t: 'p',
            text: 'La garantie légale de conformité couvre les produits d’occasion pendant **1 an** et les produits neufs pendant **2 ans** à compter de la date d’achat.',
          },
        ],
      },
      {
        h: 'Contact',
        blocks: [
          { t: 'p', text: 'Pour toute question concernant votre retour :' },
          {
            t: 'ul',
            items: [
              `**E-mail :** [${MAIL}](mailto:${MAIL})`,
              `**WhatsApp :** ${PHONE} (réponse sous 2 h en jours ouvrés)`,
              `**Adresse :** ${ADDRESS}`,
            ],
          },
        ],
      },
    ],
  },

  contact: {
    eyebrow: 'Assistance client',
    title: 'Nous contacter',
    subtitle: 'Réponse garantie sous 24 h en jours ouvrés',
    back: 'Retour à l’accueil',
    cards: {
      whatsapp: { title: 'WhatsApp', note: 'Réponse sous 2 h · lun–sam 9 h–19 h' },
      email: { title: 'E-mail', note: 'Réponse sous 24 h en jours ouvrés' },
      address: {
        title: 'Adresse',
        value: '539 route de Saint-Joseph',
        note: 'CS 20811 — 44308 Nantes Cedex 3, France',
      },
    },
    hours: {
      title: 'Horaires d’ouverture',
      rows: [
        ['Lundi – Vendredi', '9 h 00 – 18 h 30'],
        ['Samedi', '9 h 00 – 13 h 00'],
      ],
      closedLabel: 'Dimanche & jours fériés',
      closedValue: 'Fermé',
    },
    sections: [
      {
        h: 'Pour vos demandes de retour ou SAV',
        blocks: [
          {
            t: 'p',
            text: 'Merci de préciser dans votre message votre **numéro de commande** ainsi que la nature de votre demande. Consultez également notre [politique de retour](/fr/politique-retour) pour les modalités complètes.',
          },
        ],
      },
      {
        h: 'Informations société',
        blocks: [
          {
            t: 'ul',
            items: [
              '**Raison sociale :** KitchenPrime',
              `**SIRET :** ${SIRET}`,
              `**Adresse :** ${ADDRESS}`,
            ],
          },
        ],
      },
    ],
  },
};
