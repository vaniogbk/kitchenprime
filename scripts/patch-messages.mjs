/**
 * Fusionne les nouvelles clés de traduction dans messages/{locale}.json.
 * Idempotent : relancer le script ne duplique rien et écrase les valeurs
 * qu'il gère explicitement.
 *
 * Usage : node scripts/patch-messages.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const PATCH = {
  fr: {
    meta: {
      // « Revendeur officiel » contredisait les CGV (« KitchenPrime n'est pas
      // un revendeur officiel Vorwerk ») : formulation alignée sur le juridique.
      homeTitle: 'KitchenPrime — Thermomix TM7, électroménager & maison connectée',
      homeDesc:
        'Thermomix TM7 reconditionné, électroménager et maison connectée. Livraison gratuite 48 h en Europe, garantie 24 mois, paiement sécurisé.',
      catalogTitle: 'Catalogue complet — 20 produits',
      catalogDesc:
        'Robots culinaires, accessoires, livres de recettes, packs et maison connectée : les 20 références KitchenPrime, livrées en 48 h et garanties 24 mois.',
      checkoutDesc: 'Finalisez votre commande KitchenPrime en toute sécurité.',
      cartTitle: 'Mon panier',
      cartDesc: 'Les articles de votre panier KitchenPrime.',
      wishlistTitle: 'Mes favoris',
      wishlistDesc: 'Les produits KitchenPrime que vous avez mis de côté.',
      contactTitle: 'Contact & assistance',
      contactDesc:
        'Contactez KitchenPrime par WhatsApp, e-mail ou courrier. Réponse garantie sous 24 h en jours ouvrés.',
      cgvTitle: 'Conditions générales de vente',
      cgvDesc:
        'Prix, commande, livraison, droit de rétractation et garanties : les conditions générales de vente de KitchenPrime.',
      legalTitle: 'Mentions légales',
      legalDesc: 'Éditeur, hébergeur, propriété intellectuelle et données personnelles de KitchenPrime.',
      returnsTitle: 'Politique de retour',
      returnsDesc:
        '14 jours pour changer d’avis, retour gratuit et remboursement sous 14 jours. La politique de retour KitchenPrime.',
    },
    a11y: { skipToContent: 'Aller au contenu principal' },
    topbar: {
      trust: 'Livraison gratuite en Europe · Reconditionné certifié · Garantie 24 mois',
      language: 'Choix de la langue',
    },
    nav: { primary: 'Navigation principale', cartWithCount: 'Panier, {count} articles' },
    hero: {
      imageAlt: 'Robot culinaire Thermomix TM7 posé sur un plan de travail',
      viewImage: 'Voir le visuel {n}',
    },
    card: {
      wish: 'Ajouter {name} aux favoris',
      unwish: 'Retirer {name} des favoris',
      orderWa: 'Commander {name} via WhatsApp',
      added: 'Ajouté',
      ratingOutOf5: 'sur 5',
      fiveOutOfFive: '5 étoiles sur 5',
    },
    badges: {
      new: 'Nouveau',
      promo: 'Promo',
      bestseller: 'Best-seller',
      pack: 'Pack −{amount} €',
    },
    categories: { maison: 'Maison & électroménager' },
    catalog: {
      eyebrow: 'Catalogue complet · 20 produits',
      subtitle: 'Robots · Accessoires · Livres · Packs · Maison — les 20 références KitchenPrime.',
      filterHome: 'Maison',
      filterLabel: 'Filtrer par catégorie',
      resultCount: '{count, plural, =0 {Aucun produit} one {1 produit} other {# produits}}',
      noResults: 'Aucun produit ne correspond à votre recherche.',
    },
    pdp: {
      viewImage: 'Voir le visuel {n}',
      descriptionTitle: 'Description',
      featuresTitle: 'Points clés',
      relatedTitle: 'Dans la même catégorie',
      brandLabel: 'Marque',
      refLabel: 'Réf.',
    },
    cart: {
      eyebrow: 'Votre sélection',
      title: 'Mon panier',
      subtitle: 'Vérifiez vos articles avant de passer commande.',
      empty: 'Votre panier est vide.',
      emptyCta: 'Parcourir le catalogue',
      remove: 'Retirer {name} du panier',
      qty: 'Quantité pour {name}',
      total: 'Total',
      totalNote: 'Livraison offerte · TVA incluse',
      checkout: 'Passer commande',
      continue: 'Continuer mes achats',
    },
    wishlist: {
      eyebrow: 'Mis de côté',
      title: 'Mes favoris',
      subtitle: 'Les produits que vous avez enregistrés depuis ce navigateur.',
      empty: 'Vous n’avez encore aucun favori.',
      emptyCta: 'Découvrir le catalogue',
    },
    checkout: {
      greeting: 'Bonjour, {name} !',
      savedPmCard: 'Paiement par carte sécurisée',
      savedPmWise: 'Virement bancaire',
      changeCard: 'Modifier mes informations',
      useSaved: 'Utiliser mes informations enregistrées',
      processing: 'Traitement…',
      order: 'Commander',
      ibanTitle: 'Coordonnées bancaires pour votre virement',
      ibanNote: 'Indiquez votre numéro de commande en référence. Nous expédions dès réception du virement.',
      ibanFallback: 'Les coordonnées bancaires vous seront envoyées par e-mail après confirmation.',
      beneficiary: 'Bénéficiaire',
      bank: 'Banque',
      secureNote: 'Paiement 100 % sécurisé — données chiffrées SSL',
      lineSub: 'Réf. {ref} · Qté {qty}',
      genericError: 'La commande n’a pas pu être enregistrée. Réessayez dans un instant.',
      countryFR: 'France',
      countryDE: 'Allemagne',
      countryIT: 'Italie',
      countryBE: 'Belgique',
      countryCH: 'Suisse',
    },
    footer: { home: 'Maison' },
  },

  de: {
    meta: {
      homeTitle: 'KitchenPrime — Thermomix TM7, Haushaltsgeräte & Smart Home',
      homeDesc:
        'Generalüberholter Thermomix TM7, Haushaltsgeräte und Smart Home. Kostenloser 48-Stunden-Versand in Europa, 24 Monate Garantie, sichere Zahlung.',
      catalogTitle: 'Vollständiger Katalog — 20 Produkte',
      catalogDesc:
        'Küchenmaschinen, Zubehör, Kochbücher, Pakete und Smart Home: die 20 Artikel von KitchenPrime, in 48 Stunden geliefert und 24 Monate garantiert.',
      checkoutDesc: 'Schließen Sie Ihre KitchenPrime-Bestellung sicher ab.',
      cartTitle: 'Mein Warenkorb',
      cartDesc: 'Die Artikel in Ihrem KitchenPrime-Warenkorb.',
      wishlistTitle: 'Meine Favoriten',
      wishlistDesc: 'Die KitchenPrime-Produkte, die Sie vorgemerkt haben.',
      contactTitle: 'Kontakt & Support',
      contactDesc:
        'Kontaktieren Sie KitchenPrime per WhatsApp, E-Mail oder Post. Antwort garantiert innerhalb von 24 Stunden an Werktagen.',
      cgvTitle: 'Allgemeine Geschäftsbedingungen',
      cgvDesc:
        'Preise, Bestellung, Lieferung, Widerrufsrecht und Garantien: die Allgemeinen Geschäftsbedingungen von KitchenPrime.',
      legalTitle: 'Impressum',
      legalDesc: 'Anbieter, Hosting, geistiges Eigentum und personenbezogene Daten von KitchenPrime.',
      returnsTitle: 'Rückgaberichtlinie',
      returnsDesc:
        '14 Tage Widerrufsrecht, kostenlose Rücksendung und Erstattung innerhalb von 14 Tagen. Die Rückgaberichtlinie von KitchenPrime.',
    },
    a11y: { skipToContent: 'Zum Hauptinhalt springen' },
    topbar: {
      trust: 'Kostenloser Versand in Europa · Zertifiziert generalüberholt · 24 Monate Garantie',
      language: 'Sprachauswahl',
    },
    nav: { primary: 'Hauptnavigation', cartWithCount: 'Warenkorb, {count} Artikel' },
    hero: {
      imageAlt: 'Küchenmaschine Thermomix TM7 auf einer Arbeitsplatte',
      viewImage: 'Bild {n} ansehen',
    },
    card: {
      wish: '{name} zu den Favoriten hinzufügen',
      unwish: '{name} aus den Favoriten entfernen',
      orderWa: '{name} über WhatsApp bestellen',
      added: 'Hinzugefügt',
      ratingOutOf5: 'von 5',
      fiveOutOfFive: '5 von 5 Sternen',
    },
    badges: {
      new: 'Neu',
      promo: 'Aktion',
      bestseller: 'Bestseller',
      pack: 'Paket −{amount} €',
    },
    categories: { maison: 'Haushalt & Smart Home' },
    catalog: {
      eyebrow: 'Vollständiger Katalog · 20 Produkte',
      subtitle: 'Roboter · Zubehör · Bücher · Pakete · Haushalt — die 20 Artikel von KitchenPrime.',
      filterHome: 'Haushalt',
      filterLabel: 'Nach Kategorie filtern',
      resultCount: '{count, plural, =0 {Keine Produkte} one {1 Produkt} other {# Produkte}}',
      noResults: 'Kein Produkt entspricht Ihrer Suche.',
    },
    pdp: {
      viewImage: 'Bild {n} ansehen',
      descriptionTitle: 'Beschreibung',
      featuresTitle: 'Auf einen Blick',
      relatedTitle: 'Aus derselben Kategorie',
      brandLabel: 'Marke',
      refLabel: 'Art.-Nr.',
    },
    cart: {
      eyebrow: 'Ihre Auswahl',
      title: 'Mein Warenkorb',
      subtitle: 'Prüfen Sie Ihre Artikel, bevor Sie bestellen.',
      empty: 'Ihr Warenkorb ist leer.',
      emptyCta: 'Katalog durchstöbern',
      remove: '{name} aus dem Warenkorb entfernen',
      qty: 'Menge für {name}',
      total: 'Gesamt',
      totalNote: 'Versandkostenfrei · inkl. MwSt.',
      checkout: 'Zur Kasse',
      continue: 'Weiter einkaufen',
    },
    wishlist: {
      eyebrow: 'Vorgemerkt',
      title: 'Meine Favoriten',
      subtitle: 'Die Produkte, die Sie in diesem Browser gespeichert haben.',
      empty: 'Sie haben noch keine Favoriten.',
      emptyCta: 'Katalog entdecken',
    },
    checkout: {
      greeting: 'Hallo, {name}!',
      savedPmCard: 'Sichere Kartenzahlung',
      savedPmWise: 'Banküberweisung',
      changeCard: 'Meine Angaben ändern',
      useSaved: 'Gespeicherte Angaben verwenden',
      processing: 'Wird verarbeitet…',
      order: 'Bestellen',
      ibanTitle: 'Bankverbindung für Ihre Überweisung',
      ibanNote:
        'Geben Sie Ihre Bestellnummer als Verwendungszweck an. Wir versenden nach Eingang der Überweisung.',
      ibanFallback: 'Die Bankverbindung senden wir Ihnen nach der Bestätigung per E-Mail.',
      beneficiary: 'Empfänger',
      bank: 'Bank',
      secureNote: '100 % sichere Zahlung — SSL-verschlüsselte Daten',
      lineSub: 'Art.-Nr. {ref} · Menge {qty}',
      genericError: 'Die Bestellung konnte nicht gespeichert werden. Bitte versuchen Sie es gleich erneut.',
      countryFR: 'Frankreich',
      countryDE: 'Deutschland',
      countryIT: 'Italien',
      countryBE: 'Belgien',
      countryCH: 'Schweiz',
    },
    footer: { home: 'Haushalt' },
  },

  it: {
    meta: {
      homeTitle: 'KitchenPrime — Thermomix TM7, elettrodomestici e casa connessa',
      homeDesc:
        'Thermomix TM7 ricondizionato, elettrodomestici e casa connessa. Consegna gratuita in 48 ore in Europa, garanzia 24 mesi, pagamento sicuro.',
      catalogTitle: 'Catalogo completo — 20 prodotti',
      catalogDesc:
        'Robot da cucina, accessori, libri di ricette, pacchetti e casa connessa: i 20 articoli KitchenPrime, consegnati in 48 ore e garantiti 24 mesi.',
      checkoutDesc: 'Completa il tuo ordine KitchenPrime in tutta sicurezza.',
      cartTitle: 'Il mio carrello',
      cartDesc: 'Gli articoli nel tuo carrello KitchenPrime.',
      wishlistTitle: 'I miei preferiti',
      wishlistDesc: 'I prodotti KitchenPrime che hai messo da parte.',
      contactTitle: 'Contatti e assistenza',
      contactDesc:
        'Contatta KitchenPrime via WhatsApp, e-mail o posta. Risposta garantita entro 24 ore nei giorni lavorativi.',
      cgvTitle: 'Condizioni generali di vendita',
      cgvDesc:
        'Prezzi, ordine, consegna, diritto di recesso e garanzie: le condizioni generali di vendita di KitchenPrime.',
      legalTitle: 'Note legali',
      legalDesc: 'Editore, hosting, proprietà intellettuale e dati personali di KitchenPrime.',
      returnsTitle: 'Politica di reso',
      returnsDesc:
        '14 giorni per ripensarci, reso gratuito e rimborso entro 14 giorni. La politica di reso di KitchenPrime.',
    },
    a11y: { skipToContent: 'Vai al contenuto principale' },
    topbar: {
      trust: 'Consegna gratuita in Europa · Ricondizionato certificato · Garanzia 24 mesi',
      language: 'Scelta della lingua',
    },
    nav: { primary: 'Navigazione principale', cartWithCount: 'Carrello, {count} articoli' },
    hero: {
      imageAlt: 'Robot da cucina Thermomix TM7 su un piano di lavoro',
      viewImage: 'Vedi immagine {n}',
    },
    card: {
      wish: 'Aggiungi {name} ai preferiti',
      unwish: 'Rimuovi {name} dai preferiti',
      orderWa: 'Ordina {name} via WhatsApp',
      added: 'Aggiunto',
      ratingOutOf5: 'su 5',
      fiveOutOfFive: '5 stelle su 5',
    },
    badges: {
      new: 'Novità',
      promo: 'Promo',
      bestseller: 'Best seller',
      pack: 'Pack −{amount} €',
    },
    categories: { maison: 'Casa ed elettrodomestici' },
    catalog: {
      eyebrow: 'Catalogo completo · 20 prodotti',
      subtitle: 'Robot · Accessori · Libri · Pacchetti · Casa — i 20 articoli KitchenPrime.',
      filterHome: 'Casa',
      filterLabel: 'Filtra per categoria',
      resultCount: '{count, plural, =0 {Nessun prodotto} one {1 prodotto} other {# prodotti}}',
      noResults: 'Nessun prodotto corrisponde alla tua ricerca.',
    },
    pdp: {
      viewImage: 'Vedi immagine {n}',
      descriptionTitle: 'Descrizione',
      featuresTitle: 'Punti chiave',
      relatedTitle: 'Nella stessa categoria',
      brandLabel: 'Marca',
      refLabel: 'Rif.',
    },
    cart: {
      eyebrow: 'La tua selezione',
      title: 'Il mio carrello',
      subtitle: 'Controlla i tuoi articoli prima di ordinare.',
      empty: 'Il tuo carrello è vuoto.',
      emptyCta: 'Sfoglia il catalogo',
      remove: 'Rimuovi {name} dal carrello',
      qty: 'Quantità per {name}',
      total: 'Totale',
      totalNote: 'Spedizione gratuita · IVA inclusa',
      checkout: 'Vai all’ordine',
      continue: 'Continua gli acquisti',
    },
    wishlist: {
      eyebrow: 'Messi da parte',
      title: 'I miei preferiti',
      subtitle: 'I prodotti che hai salvato da questo browser.',
      empty: 'Non hai ancora nessun preferito.',
      emptyCta: 'Scopri il catalogo',
    },
    checkout: {
      greeting: 'Ciao, {name}!',
      savedPmCard: 'Pagamento con carta sicuro',
      savedPmWise: 'Bonifico bancario',
      changeCard: 'Modifica i miei dati',
      useSaved: 'Usa i dati salvati',
      processing: 'Elaborazione…',
      order: 'Ordina',
      ibanTitle: 'Coordinate bancarie per il tuo bonifico',
      ibanNote:
        'Indica il numero d’ordine come causale. Spediamo appena ricevuto il bonifico.',
      ibanFallback: 'Le coordinate bancarie ti saranno inviate per e-mail dopo la conferma.',
      beneficiary: 'Beneficiario',
      bank: 'Banca',
      secureNote: 'Pagamento 100 % sicuro — dati cifrati SSL',
      lineSub: 'Rif. {ref} · Qtà {qty}',
      genericError: 'Non è stato possibile registrare l’ordine. Riprova tra un istante.',
      countryFR: 'Francia',
      countryDE: 'Germania',
      countryIT: 'Italia',
      countryBE: 'Belgio',
      countryCH: 'Svizzera',
    },
    footer: { home: 'Casa' },
  },

  en: {
    meta: {
      homeTitle: 'KitchenPrime — Thermomix TM7, appliances & smart home',
      homeDesc:
        'Refurbished Thermomix TM7, home appliances and smart home. Free 48-hour delivery across Europe, 24-month warranty, secure payment.',
      catalogTitle: 'Full catalogue — 20 products',
      catalogDesc:
        'Food processors, accessories, recipe books, bundles and smart home: all 20 KitchenPrime products, delivered in 48 hours with a 24-month warranty.',
      checkoutDesc: 'Complete your KitchenPrime order securely.',
      cartTitle: 'My cart',
      cartDesc: 'The items in your KitchenPrime cart.',
      wishlistTitle: 'My favourites',
      wishlistDesc: 'The KitchenPrime products you have saved.',
      contactTitle: 'Contact & support',
      contactDesc:
        'Reach KitchenPrime by WhatsApp, email or post. Guaranteed reply within 24 hours on working days.',
      cgvTitle: 'Terms and conditions of sale',
      cgvDesc:
        'Pricing, ordering, delivery, right of withdrawal and warranties: the KitchenPrime terms and conditions of sale.',
      legalTitle: 'Legal notice',
      legalDesc: 'Publisher, hosting, intellectual property and personal data for KitchenPrime.',
      returnsTitle: 'Return policy',
      returnsDesc:
        '14 days to change your mind, free returns and a refund within 14 days. The KitchenPrime return policy.',
    },
    a11y: { skipToContent: 'Skip to main content' },
    topbar: {
      trust: 'Free delivery across Europe · Certified refurbished · 24-month warranty',
      language: 'Language selection',
    },
    nav: { primary: 'Main navigation', cartWithCount: 'Cart, {count} items' },
    hero: {
      imageAlt: 'Thermomix TM7 food processor on a kitchen worktop',
      viewImage: 'View image {n}',
    },
    card: {
      wish: 'Add {name} to favourites',
      unwish: 'Remove {name} from favourites',
      orderWa: 'Order {name} via WhatsApp',
      added: 'Added',
      ratingOutOf5: 'out of 5',
      fiveOutOfFive: '5 out of 5 stars',
    },
    badges: {
      new: 'New',
      promo: 'Sale',
      bestseller: 'Best seller',
      pack: 'Bundle −€{amount}',
    },
    categories: { maison: 'Home & appliances' },
    catalog: {
      eyebrow: 'Full catalogue · 20 products',
      subtitle: 'Robots · Accessories · Books · Bundles · Home — all 20 KitchenPrime products.',
      filterHome: 'Home',
      filterLabel: 'Filter by category',
      resultCount: '{count, plural, =0 {No products} one {1 product} other {# products}}',
      noResults: 'No product matches your search.',
    },
    pdp: {
      viewImage: 'View image {n}',
      descriptionTitle: 'Description',
      featuresTitle: 'Key points',
      relatedTitle: 'In the same category',
      brandLabel: 'Brand',
      refLabel: 'Ref.',
    },
    cart: {
      eyebrow: 'Your selection',
      title: 'My cart',
      subtitle: 'Check your items before placing the order.',
      empty: 'Your cart is empty.',
      emptyCta: 'Browse the catalogue',
      remove: 'Remove {name} from the cart',
      qty: 'Quantity for {name}',
      total: 'Total',
      totalNote: 'Free shipping · VAT included',
      checkout: 'Place order',
      continue: 'Continue shopping',
    },
    wishlist: {
      eyebrow: 'Saved',
      title: 'My favourites',
      subtitle: 'The products you saved from this browser.',
      empty: 'You have no favourites yet.',
      emptyCta: 'Explore the catalogue',
    },
    checkout: {
      greeting: 'Hello, {name}!',
      savedPmCard: 'Secure card payment',
      savedPmWise: 'Bank transfer',
      changeCard: 'Edit my details',
      useSaved: 'Use my saved details',
      processing: 'Processing…',
      order: 'Order',
      ibanTitle: 'Bank details for your transfer',
      ibanNote: 'Quote your order number as the reference. We ship as soon as the transfer arrives.',
      ibanFallback: 'We will email you the bank details after confirmation.',
      beneficiary: 'Beneficiary',
      bank: 'Bank',
      secureNote: '100% secure payment — SSL-encrypted data',
      lineSub: 'Ref. {ref} · Qty {qty}',
      genericError: 'The order could not be saved. Please try again in a moment.',
      countryFR: 'France',
      countryDE: 'Germany',
      countryIT: 'Italy',
      countryBE: 'Belgium',
      countryCH: 'Switzerland',
    },
    footer: { home: 'Home & appliances' },
  },
};

function deepMerge(base, patch) {
  for (const [k, v] of Object.entries(patch)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      base[k] = deepMerge(base[k] && typeof base[k] === 'object' ? base[k] : {}, v);
    } else {
      base[k] = v;
    }
  }
  return base;
}

for (const [locale, patch] of Object.entries(PATCH)) {
  const file = `messages/${locale}.json`;
  const json = JSON.parse(readFileSync(file, 'utf8'));
  deepMerge(json, patch);
  writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
  console.log(`✔ ${file}`);
}
