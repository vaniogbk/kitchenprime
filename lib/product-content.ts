import { type Locale, locales } from './i18n';
import { PRODUCTS } from './products';

/**
 * Contenu éditorial des fiches produit, traduit dans les 4 locales.
 *
 * `lib/products.ts` reste la source de vérité *canonique* (slug, réf, prix,
 * image) — ce module ne porte que le texte affiché. Les slugs, eux, restent
 * dérivés du français et identiques dans toutes les langues : ils servent de
 * clé en base et dans les commandes.
 *
 * Ce fichier n'est consommé que par des Server Components : il ne part jamais
 * dans le bundle client.
 */
export type ProductContent = {
  /** Nom affiché (H1, balise title, JSON-LD). */
  name: string;
  /** Accroche courte — meta description, carte catalogue. */
  tagline: string;
  /** Description longue (SEO). 2 paragraphes. */
  description: string;
  /** Points clés affichés en liste. */
  features: [string, string, string, string];
};

type Entry = Record<Locale, ProductContent>;

const CONTENT: Record<string, Entry> = {
  'thermomix-tm7': {
    fr: {
      name: 'Thermomix TM7',
      tagline: 'Le robot cuiseur Thermomix TM7 reconditionné, garanti 24 mois et livré sous 48 h.',
      description:
        "Le Thermomix TM7 réunit une vingtaine d'appareils en un seul : il pèse, mixe, pétrit, cuit à la vapeur, mijote, émulsionne et maintient au chaud. Son écran tactile haute définition guide chaque recette pas à pas, du premier ingrédient jusqu'au dressage, en ajustant seul la température et la vitesse.\n\nChaque TM7 vendu par KitchenPrime est un appareil d'occasion reconditionné : contrôle en 42 points, remplacement systématique des pièces d'usure, nettoyage professionnel et garantie 24 mois. Livraison offerte en France métropolitaine, retour possible sous 14 jours.",
      features: [
        'Écran tactile HD avec guidage recette pas à pas',
        'Plus de 20 fonctions culinaires en un seul appareil',
        'Reconditionné et contrôlé sur 42 points',
        'Garantie 24 mois pièces et main-d’œuvre',
      ],
    },
    de: {
      name: 'Thermomix TM7',
      tagline: 'Die generalüberholte Küchenmaschine Thermomix TM7 — 24 Monate Garantie, Lieferung in 48 Std.',
      description:
        'Der Thermomix TM7 vereint rund zwanzig Geräte in einem: Er wiegt, mixt, knetet, dampfgart, schmort, emulgiert und hält warm. Das hochauflösende Touchdisplay führt Schritt für Schritt durch jedes Rezept und regelt Temperatur und Geschwindigkeit selbstständig.\n\nJeder von KitchenPrime verkaufte TM7 ist ein generalüberholtes Gebrauchtgerät: Prüfung nach 42 Punkten, konsequenter Austausch der Verschleißteile, professionelle Reinigung und 24 Monate Garantie. Versandkostenfrei, Rückgabe innerhalb von 14 Tagen möglich.',
      features: [
        'HD-Touchdisplay mit Schritt-für-Schritt-Rezeptführung',
        'Über 20 Küchenfunktionen in einem Gerät',
        'Generalüberholt, nach 42 Punkten geprüft',
        '24 Monate Garantie auf Teile und Arbeit',
      ],
    },
    it: {
      name: 'Thermomix TM7',
      tagline: 'Il robot da cucina Thermomix TM7 ricondizionato, garanzia 24 mesi e consegna in 48 ore.',
      description:
        "Il Thermomix TM7 riunisce una ventina di apparecchi in uno solo: pesa, frulla, impasta, cuoce a vapore, stufa, emulsiona e mantiene in caldo. Il display touch ad alta definizione guida ogni ricetta passo dopo passo, regolando da sé temperatura e velocità.\n\nOgni TM7 venduto da KitchenPrime è un apparecchio usato ricondizionato: controllo in 42 punti, sostituzione sistematica dei pezzi soggetti a usura, pulizia professionale e garanzia di 24 mesi. Spedizione gratuita e reso possibile entro 14 giorni.",
      features: [
        'Display touch HD con guida alla ricetta passo dopo passo',
        'Oltre 20 funzioni di cucina in un solo apparecchio',
        'Ricondizionato e controllato in 42 punti',
        'Garanzia 24 mesi su ricambi e manodopera',
      ],
    },
    en: {
      name: 'Thermomix TM7',
      tagline: 'The refurbished Thermomix TM7 food processor — 24-month warranty, delivered in 48 hours.',
      description:
        'The Thermomix TM7 replaces around twenty appliances on its own: it weighs, blends, kneads, steams, simmers, emulsifies and keeps food warm. Its high-definition touchscreen walks you through every recipe step by step, adjusting temperature and speed by itself.\n\nEvery TM7 sold by KitchenPrime is a refurbished second-hand unit: a 42-point inspection, systematic replacement of wear parts, professional cleaning and a 24-month warranty. Free shipping and a 14-day return window.',
      features: [
        'HD touchscreen with step-by-step recipe guidance',
        'Over 20 cooking functions in a single appliance',
        'Refurbished and inspected across 42 points',
        '24-month warranty on parts and labour',
      ],
    },
  },

  'thermomix-tm6': {
    fr: {
      name: 'Thermomix TM6',
      tagline: 'Le TM6 reconditionné : la génération éprouvée, à prix contenu et garantie 24 mois.',
      description:
        "Le Thermomix TM6 reste la référence des robots cuiseurs multifonctions : mixage, cuisson lente, cuisson vapeur Varoma, pétrissage, fermentation et sous vide, pilotés depuis un écran tactile connecté au catalogue Cookidoo.\n\nGénération précédente du TM7, il offre l'essentiel des fonctions pour un budget nettement inférieur. Nos TM6 sont reconditionnés en atelier, testés à pleine charge et garantis 24 mois.",
      features: [
        'Écran tactile connecté au catalogue Cookidoo',
        'Cuisson lente, vapeur Varoma, fermentation et sous vide',
        'Reconditionné en atelier et testé à pleine charge',
        'Garantie 24 mois pièces et main-d’œuvre',
      ],
    },
    de: {
      name: 'Thermomix TM6',
      tagline: 'Der generalüberholte TM6: die bewährte Generation zum günstigeren Preis, 24 Monate Garantie.',
      description:
        'Der Thermomix TM6 bleibt die Referenz unter den Multifunktions-Küchenmaschinen: Mixen, Schongaren, Dampfgaren mit Varoma, Kneten, Fermentieren und Sous-vide — gesteuert über ein Touchdisplay mit Zugang zum Cookidoo-Katalog.\n\nAls Vorgängergeneration des TM7 bietet er die wesentlichen Funktionen zu einem deutlich niedrigeren Preis. Unsere TM6 werden in der Werkstatt generalüberholt, unter Volllast getestet und 24 Monate garantiert.',
      features: [
        'Touchdisplay mit Zugang zum Cookidoo-Katalog',
        'Schongaren, Varoma-Dampfgaren, Fermentieren und Sous-vide',
        'In der Werkstatt generalüberholt und unter Volllast getestet',
        '24 Monate Garantie auf Teile und Arbeit',
      ],
    },
    it: {
      name: 'Thermomix TM6',
      tagline: 'Il TM6 ricondizionato: la generazione collaudata a prezzo contenuto, garanzia 24 mesi.',
      description:
        'Il Thermomix TM6 resta il riferimento tra i robot da cucina multifunzione: frullatura, cottura lenta, cottura a vapore Varoma, impasto, fermentazione e sottovuoto, gestiti da un display touch collegato al catalogo Cookidoo.\n\nGenerazione precedente del TM7, offre le funzioni essenziali a un prezzo nettamente inferiore. I nostri TM6 sono ricondizionati in officina, testati a pieno carico e garantiti 24 mesi.',
      features: [
        'Display touch collegato al catalogo Cookidoo',
        'Cottura lenta, vapore Varoma, fermentazione e sottovuoto',
        'Ricondizionato in officina e testato a pieno carico',
        'Garanzia 24 mesi su ricambi e manodopera',
      ],
    },
    en: {
      name: 'Thermomix TM6',
      tagline: 'The refurbished TM6: the proven generation at a lower price, with a 24-month warranty.',
      description:
        'The Thermomix TM6 remains the benchmark multifunction food processor: blending, slow cooking, Varoma steaming, kneading, fermenting and sous-vide, all driven from a touchscreen connected to the Cookidoo catalogue.\n\nAs the generation before the TM7, it covers the essential functions at a markedly lower price. Our TM6 units are refurbished in-house, tested under full load and backed by a 24-month warranty.',
      features: [
        'Touchscreen connected to the Cookidoo catalogue',
        'Slow cooking, Varoma steaming, fermenting and sous-vide',
        'Workshop-refurbished and tested under full load',
        '24-month warranty on parts and labour',
      ],
    },
  },

  'cookidoo-abonnement-1-an': {
    fr: {
      name: 'Cookidoo · Abonnement 1 an',
      tagline: 'Un an d’accès à plus de 90 000 recettes guidées, synchronisées avec votre Thermomix.',
      description:
        "L'abonnement Cookidoo ouvre l'accès à un catalogue de plus de 90 000 recettes guidées, mises à jour chaque semaine et compatibles TM6 comme TM7. Chaque recette se transfère sur l'écran du robot, qui enchaîne alors les étapes automatiquement.\n\nLa plateforme génère aussi vos menus de la semaine et la liste de courses correspondante. Le code d'activation est envoyé par e-mail dans l'heure suivant la commande.",
      features: [
        'Plus de 90 000 recettes guidées, mises à jour chaque semaine',
        'Transfert direct des recettes sur l’écran du robot',
        'Planificateur de menus et liste de courses automatique',
        'Code d’activation envoyé par e-mail sous 1 heure',
      ],
    },
    de: {
      name: 'Cookidoo · Abo 1 Jahr',
      tagline: 'Ein Jahr Zugang zu über 90 000 geführten Rezepten, synchron mit Ihrem Thermomix.',
      description:
        'Das Cookidoo-Abo öffnet den Zugang zu über 90 000 geführten Rezepten, wöchentlich aktualisiert und kompatibel mit TM6 und TM7. Jedes Rezept lässt sich auf das Display des Geräts übertragen, das die Schritte dann automatisch abarbeitet.\n\nDie Plattform erstellt außerdem Wochenmenüs und die passende Einkaufsliste. Der Aktivierungscode wird innerhalb einer Stunde nach Bestellung per E-Mail versendet.',
      features: [
        'Über 90 000 geführte Rezepte, wöchentlich aktualisiert',
        'Direkte Rezeptübertragung auf das Gerätedisplay',
        'Menüplaner und automatische Einkaufsliste',
        'Aktivierungscode per E-Mail innerhalb 1 Stunde',
      ],
    },
    it: {
      name: 'Cookidoo · Abbonamento 1 anno',
      tagline: 'Un anno di accesso a oltre 90 000 ricette guidate, sincronizzate con il tuo Thermomix.',
      description:
        "L'abbonamento Cookidoo apre l'accesso a un catalogo di oltre 90 000 ricette guidate, aggiornate ogni settimana e compatibili sia con TM6 sia con TM7. Ogni ricetta si trasferisce sul display del robot, che esegue poi i passaggi in automatico.\n\nLa piattaforma genera anche i menu della settimana e la lista della spesa corrispondente. Il codice di attivazione viene inviato per e-mail entro un'ora dall'ordine.",
      features: [
        'Oltre 90 000 ricette guidate, aggiornate ogni settimana',
        'Trasferimento diretto delle ricette sul display del robot',
        'Pianificatore di menu e lista della spesa automatica',
        'Codice di attivazione via e-mail entro 1 ora',
      ],
    },
    en: {
      name: 'Cookidoo · 1-Year Subscription',
      tagline: 'A year of access to over 90,000 guided recipes, synced with your Thermomix.',
      description:
        'A Cookidoo subscription unlocks a catalogue of more than 90,000 guided recipes, updated weekly and compatible with both the TM6 and the TM7. Each recipe transfers to the machine’s screen, which then runs through the steps automatically.\n\nThe platform also builds your weekly menus and the matching shopping list. The activation code is emailed within an hour of your order.',
      features: [
        'Over 90,000 guided recipes, updated weekly',
        'Recipes transfer straight to the machine’s screen',
        'Menu planner and automatic shopping list',
        'Activation code emailed within 1 hour',
      ],
    },
  },

  'kit-patisserie-pro': {
    fr: {
      name: 'Kit Pâtisserie Pro',
      tagline: 'Fouet, spatule silicone, moules et poche à douille pensés pour le bol du TM7.',
      description:
        "Le Kit Pâtisserie Pro rassemble les accessoires qui manquent au bol d'origine pour pâtisser sérieusement : fouet renforcé pour monter blancs et crèmes, spatule silicone résistante à 250 °C, jeu de moules et poche à douille avec six embouts inox.\n\nChaque pièce est dimensionnée pour le bol du TM7 et passe au lave-vaisselle. Matériaux sans BPA, contact alimentaire certifié.",
      features: [
        'Fouet renforcé pour blancs en neige et crèmes montées',
        'Spatule silicone résistante jusqu’à 250 °C',
        'Poche à douille avec six embouts inox',
        'Compatible lave-vaisselle, sans BPA',
      ],
    },
    de: {
      name: 'Backset Pro',
      tagline: 'Schneebesen, Silikonspatel, Formen und Spritzbeutel — passend für den TM7-Mixtopf.',
      description:
        'Das Backset Pro versammelt das Zubehör, das dem Original-Mixtopf zum ernsthaften Backen fehlt: verstärkter Schneebesen für Eischnee und Sahne, bis 250 °C hitzebeständiger Silikonspatel, Formenset und Spritzbeutel mit sechs Edelstahltüllen.\n\nJedes Teil ist auf den TM7-Mixtopf abgestimmt und spülmaschinenfest. BPA-freie Materialien mit Lebensmittelzulassung.',
      features: [
        'Verstärkter Schneebesen für Eischnee und Schlagsahne',
        'Silikonspatel hitzebeständig bis 250 °C',
        'Spritzbeutel mit sechs Edelstahltüllen',
        'Spülmaschinenfest und BPA-frei',
      ],
    },
    it: {
      name: 'Kit Pasticceria Pro',
      tagline: 'Frusta, spatola in silicone, stampi e sac à poche pensati per il boccale del TM7.',
      description:
        "Il Kit Pasticceria Pro raccoglie gli accessori che mancano al boccale originale per fare pasticceria sul serio: frusta rinforzata per montare albumi e creme, spatola in silicone resistente fino a 250 °C, set di stampi e sac à poche con sei bocchette in acciaio inox.\n\nOgni pezzo è dimensionato per il boccale del TM7 ed è lavabile in lavastoviglie. Materiali senza BPA, idonei al contatto alimentare.",
      features: [
        'Frusta rinforzata per albumi montati e creme',
        'Spatola in silicone resistente fino a 250 °C',
        'Sac à poche con sei bocchette in acciaio inox',
        'Lavabile in lavastoviglie, senza BPA',
      ],
    },
    en: {
      name: 'Pro Baking Kit',
      tagline: 'Whisk, silicone spatula, moulds and piping bag sized for the TM7 bowl.',
      description:
        'The Pro Baking Kit gathers the accessories the standard bowl lacks for serious baking: a reinforced whisk for egg whites and whipped cream, a silicone spatula rated to 250 °C, a set of moulds and a piping bag with six stainless-steel nozzles.\n\nEvery piece is sized for the TM7 bowl and dishwasher-safe. BPA-free, food-contact certified materials.',
      features: [
        'Reinforced whisk for egg whites and whipped cream',
        'Silicone spatula heat-resistant to 250 °C',
        'Piping bag with six stainless-steel nozzles',
        'Dishwasher-safe and BPA-free',
      ],
    },
  },

  'varoma-xl-steam-set': {
    fr: {
      name: 'Varoma XL Steam Set',
      tagline: 'Deux étages de cuisson vapeur pour préparer un repas complet en une seule fournée.',
      description:
        "Le Varoma XL ajoute un second étage au panier vapeur d'origine : poisson en bas, légumes en haut, riz dans le bol — un repas complet cuit en une seule opération, sans transfert de saveurs.\n\nLe polypropylène de qualité alimentaire supporte les cycles vapeur prolongés et le lave-vaisselle. Compatible TM6 et TM7.",
      features: [
        'Deux étages superposables pour un repas complet',
        'Cuisson simultanée sans transfert de saveurs',
        'Polypropylène alimentaire, passage au lave-vaisselle',
        'Compatible Thermomix TM6 et TM7',
      ],
    },
    de: {
      name: 'Varoma XL Dampfgarset',
      tagline: 'Zwei Garebenen, um eine komplette Mahlzeit in einem Durchgang zu dämpfen.',
      description:
        'Das Varoma XL ergänzt den originalen Dampfgaraufsatz um eine zweite Ebene: Fisch unten, Gemüse oben, Reis im Mixtopf — eine vollständige Mahlzeit in einem Durchgang, ohne Geschmacksübertragung.\n\nDas lebensmittelechte Polypropylen hält langen Dampfzyklen und der Spülmaschine stand. Kompatibel mit TM6 und TM7.',
      features: [
        'Zwei stapelbare Ebenen für eine komplette Mahlzeit',
        'Gleichzeitiges Garen ohne Geschmacksübertragung',
        'Lebensmittelechtes Polypropylen, spülmaschinenfest',
        'Kompatibel mit Thermomix TM6 und TM7',
      ],
    },
    it: {
      name: 'Varoma XL Steam Set',
      tagline: 'Due piani di cottura a vapore per preparare un pasto completo in una sola volta.',
      description:
        'Il Varoma XL aggiunge un secondo piano al cestello vapore originale: pesce sotto, verdure sopra, riso nel boccale — un pasto completo cotto in una sola operazione, senza trasferimento di sapori.\n\nIl polipropilene per uso alimentare regge cicli vapore prolungati e il lavaggio in lavastoviglie. Compatibile con TM6 e TM7.',
      features: [
        'Due piani sovrapponibili per un pasto completo',
        'Cottura simultanea senza trasferimento di sapori',
        'Polipropilene alimentare, lavabile in lavastoviglie',
        'Compatibile con Thermomix TM6 e TM7',
      ],
    },
    en: {
      name: 'Varoma XL Steam Set',
      tagline: 'Two steaming tiers to cook a full meal in a single run.',
      description:
        'The Varoma XL adds a second tier to the standard steaming basket: fish below, vegetables above, rice in the bowl — a complete meal cooked in one operation, with no flavour transfer.\n\nFood-grade polypropylene stands up to long steam cycles and the dishwasher. Compatible with the TM6 and TM7.',
      features: [
        'Two stackable tiers for a complete meal',
        'Simultaneous cooking with no flavour transfer',
        'Food-grade polypropylene, dishwasher-safe',
        'Compatible with Thermomix TM6 and TM7',
      ],
    },
  },

  'couteau-lame-metal-tm7': {
    fr: {
      name: 'Couteau lame métal TM7',
      tagline: 'Lame de rechange en inox trempé, joint neuf inclus, montage sans outil.',
      description:
        "La lame est la pièce d'usure principale du robot : après quelques centaines d'heures, elle perd son mordant et hache moins net. Ce couteau de rechange en inox trempé restitue la coupe d'origine.\n\nLe joint d'étanchéité neuf est fourni — c'est lui qui empêche les fuites sous le bol. Montage sans outil en moins d'une minute.",
      features: [
        'Inox trempé, coupe équivalente à la lame d’origine',
        'Joint d’étanchéité neuf fourni',
        'Montage sans outil en moins d’une minute',
        'Compatible bol Thermomix TM7',
      ],
    },
    de: {
      name: 'Messer mit Metallklinge TM7',
      tagline: 'Ersatzklinge aus gehärtetem Edelstahl, neue Dichtung inklusive, Montage ohne Werkzeug.',
      description:
        'Die Klinge ist das wichtigste Verschleißteil des Geräts: Nach einigen hundert Betriebsstunden verliert sie ihren Biss und zerkleinert weniger sauber. Dieses Ersatzmesser aus gehärtetem Edelstahl stellt die ursprüngliche Schnittleistung wieder her.\n\nDie neue Dichtung liegt bei — sie verhindert das Auslaufen unter dem Mixtopf. Montage ohne Werkzeug in unter einer Minute.',
      features: [
        'Gehärteter Edelstahl, Schnittleistung wie im Original',
        'Neue Dichtung im Lieferumfang',
        'Montage ohne Werkzeug in unter einer Minute',
        'Passend für den Thermomix-TM7-Mixtopf',
      ],
    },
    it: {
      name: 'Coltello lama in metallo TM7',
      tagline: 'Lama di ricambio in acciaio temprato, guarnizione nuova inclusa, montaggio senza attrezzi.',
      description:
        "La lama è il principale pezzo soggetto a usura del robot: dopo qualche centinaio di ore perde il mordente e trita meno finemente. Questo coltello di ricambio in acciaio temprato restituisce il taglio originale.\n\nLa guarnizione di tenuta nuova è inclusa — è lei a impedire le perdite sotto il boccale. Montaggio senza attrezzi in meno di un minuto.",
      features: [
        'Acciaio temprato, taglio equivalente alla lama originale',
        'Guarnizione di tenuta nuova inclusa',
        'Montaggio senza attrezzi in meno di un minuto',
        'Compatibile con il boccale Thermomix TM7',
      ],
    },
    en: {
      name: 'TM7 Metal Blade',
      tagline: 'Hardened stainless replacement blade, new seal included, tool-free fitting.',
      description:
        'The blade is the machine’s main wear part: after a few hundred hours it loses its edge and chops less cleanly. This hardened stainless replacement restores the original cut.\n\nA new sealing ring is included — it is what prevents leaks underneath the bowl. Tool-free fitting in under a minute.',
      features: [
        'Hardened stainless steel, cut equivalent to the original',
        'New sealing ring included',
        'Tool-free fitting in under a minute',
        'Fits the Thermomix TM7 bowl',
      ],
    },
  },

  'bol-mixeur-secondaire': {
    fr: {
      name: 'Bol mixeur secondaire',
      tagline: 'Un second bol complet pour enchaîner deux préparations sans laver entre les deux.',
      description:
        "Enchaîner une pâte salée puis une crème sucrée impose normalement un lavage complet du bol. Avec un second bol complet — couteau, joint et couvercle inclus — vous passez d'une préparation à l'autre immédiatement.\n\nC'est l'accessoire qui change le plus la vie lors des grandes tablées et de la cuisine du dimanche. Compatible TM6 et TM7.",
      features: [
        'Bol complet : couteau, joint et couvercle inclus',
        'Deux préparations enchaînées sans lavage intermédiaire',
        'Acier inoxydable, passage au lave-vaisselle',
        'Compatible Thermomix TM6 et TM7',
      ],
    },
    de: {
      name: 'Zweiter Mixtopf',
      tagline: 'Ein kompletter Zweitmixtopf, um zwei Zubereitungen ohne Zwischenspülen zu verketten.',
      description:
        'Auf einen herzhaften Teig eine süße Creme folgen zu lassen, verlangt normalerweise ein komplettes Spülen des Mixtopfs. Mit einem zweiten kompletten Mixtopf — Messer, Dichtung und Deckel inklusive — wechseln Sie sofort von einer Zubereitung zur nächsten.\n\nDas ist das Zubehör, das bei großen Tafeln und beim Sonntagskochen den größten Unterschied macht. Kompatibel mit TM6 und TM7.',
      features: [
        'Kompletter Mixtopf: Messer, Dichtung und Deckel inklusive',
        'Zwei Zubereitungen ohne Zwischenspülen',
        'Edelstahl, spülmaschinenfest',
        'Kompatibel mit Thermomix TM6 und TM7',
      ],
    },
    it: {
      name: 'Boccale secondario',
      tagline: 'Un secondo boccale completo per concatenare due preparazioni senza lavare in mezzo.',
      description:
        "Passare da un impasto salato a una crema dolce impone normalmente un lavaggio completo del boccale. Con un secondo boccale completo — coltello, guarnizione e coperchio inclusi — si passa da una preparazione all'altra immediatamente.\n\nÈ l'accessorio che cambia di più la vita durante le grandi tavolate e la cucina della domenica. Compatibile con TM6 e TM7.",
      features: [
        'Boccale completo: coltello, guarnizione e coperchio inclusi',
        'Due preparazioni concatenate senza lavaggio intermedio',
        'Acciaio inossidabile, lavabile in lavastoviglie',
        'Compatibile con Thermomix TM6 e TM7',
      ],
    },
    en: {
      name: 'Second Mixing Bowl',
      tagline: 'A complete second bowl so you can run two preparations back to back without washing up.',
      description:
        'Following a savoury dough with a sweet cream normally means washing the bowl in between. With a complete second bowl — blade, seal and lid included — you move from one preparation to the next straight away.\n\nIt is the accessory that makes the biggest difference for large gatherings and Sunday cooking. Compatible with the TM6 and TM7.',
      features: [
        'Complete bowl: blade, seal and lid included',
        'Two preparations back to back, no washing in between',
        'Stainless steel, dishwasher-safe',
        'Compatible with Thermomix TM6 and TM7',
      ],
    },
  },

  'spatule-thermomix-officielle': {
    fr: {
      name: 'Spatule Thermomix officielle',
      tagline: 'La spatule d’origine : racle le bol sans rayer et sécurise le passage près du couteau.',
      description:
        "La spatule officielle n'est pas un simple ustensile : son embase est conçue pour ne jamais atteindre la lame, même bol en rotation. C'est la seule façon sûre de racler les parois en cours de préparation.\n\nPlastique alimentaire résistant à la chaleur, passage au lave-vaisselle, compatible tous les bols Thermomix récents.",
      features: [
        'Embase de sécurité qui ne peut pas atteindre la lame',
        'Racle les parois sans rayer le bol',
        'Plastique alimentaire résistant à la chaleur',
        'Compatible tous bols Thermomix récents',
      ],
    },
    de: {
      name: 'Original-Thermomix-Spatel',
      tagline: 'Der Originalspatel: schabt den Mixtopf, ohne zu verkratzen, und sichert den Bereich am Messer.',
      description:
        'Der Originalspatel ist nicht einfach ein Küchenhelfer: Sein Sockel ist so geformt, dass er das Messer nie erreichen kann, auch bei laufendem Mixtopf. Nur so lassen sich die Wände während der Zubereitung sicher abschaben.\n\nHitzebeständiger Lebensmittelkunststoff, spülmaschinenfest, passend für alle neueren Thermomix-Mixtöpfe.',
      features: [
        'Sicherheitssockel, der das Messer nicht erreichen kann',
        'Schabt die Wände, ohne den Mixtopf zu verkratzen',
        'Hitzebeständiger Lebensmittelkunststoff',
        'Passend für alle neueren Thermomix-Mixtöpfe',
      ],
    },
    it: {
      name: 'Spatola Thermomix originale',
      tagline: 'La spatola originale: raschia il boccale senza graffiare e mette in sicurezza la zona della lama.',
      description:
        "La spatola ufficiale non è un semplice utensile: la sua base è progettata per non raggiungere mai la lama, anche a boccale in rotazione. È l'unico modo sicuro per raschiare le pareti durante la preparazione.\n\nPlastica alimentare resistente al calore, lavabile in lavastoviglie, compatibile con tutti i boccali Thermomix recenti.",
      features: [
        'Base di sicurezza che non può raggiungere la lama',
        'Raschia le pareti senza graffiare il boccale',
        'Plastica alimentare resistente al calore',
        'Compatibile con tutti i boccali Thermomix recenti',
      ],
    },
    en: {
      name: 'Official Thermomix Spatula',
      tagline: 'The original spatula: scrapes the bowl without scratching and stays clear of the blade.',
      description:
        'The official spatula is not just a utensil: its base is shaped so it can never reach the blade, even with the bowl turning. It is the only safe way to scrape the sides mid-preparation.\n\nHeat-resistant food-grade plastic, dishwasher-safe, compatible with all recent Thermomix bowls.',
      features: [
        'Safety base that cannot reach the blade',
        'Scrapes the sides without scratching the bowl',
        'Heat-resistant food-grade plastic',
        'Compatible with all recent Thermomix bowls',
      ],
    },
  },

  'panier-de-cuisson': {
    fr: {
      name: 'Panier de cuisson',
      tagline: 'Le panier inox pour égoutter, blanchir et cuire le riz à l’intérieur du bol.',
      description:
        "Le panier de cuisson s'insère directement dans le bol : il sert à cuire le riz et les pâtes, à blanchir des légumes, mais aussi de passoire pour filtrer un bouillon ou égoutter une préparation.\n\nInox perforé, poignée intégrée pour retirer le panier brûlant sans se brûler. Compatible TM6 et TM7.",
      features: [
        'Cuisson du riz et des pâtes directement dans le bol',
        'Sert aussi de passoire pour filtrer et égoutter',
        'Poignée intégrée pour retirer le panier brûlant',
        'Inox perforé, compatible TM6 et TM7',
      ],
    },
    de: {
      name: 'Garkörbchen',
      tagline: 'Der Edelstahlkorb zum Abtropfen, Blanchieren und Reiskochen direkt im Mixtopf.',
      description:
        'Das Garkörbchen wird direkt in den Mixtopf eingesetzt: zum Garen von Reis und Nudeln, zum Blanchieren von Gemüse, aber auch als Sieb zum Filtern einer Brühe oder zum Abtropfen.\n\nPerforierter Edelstahl mit integriertem Griff, um den heißen Korb zu entnehmen, ohne sich zu verbrennen. Kompatibel mit TM6 und TM7.',
      features: [
        'Reis und Nudeln direkt im Mixtopf garen',
        'Dient zugleich als Sieb zum Filtern und Abtropfen',
        'Integrierter Griff für die heiße Entnahme',
        'Perforierter Edelstahl, kompatibel mit TM6 und TM7',
      ],
    },
    it: {
      name: 'Cestello di cottura',
      tagline: 'Il cestello in acciaio per scolare, sbollentare e cuocere il riso dentro il boccale.',
      description:
        'Il cestello di cottura si inserisce direttamente nel boccale: serve a cuocere riso e pasta, a sbollentare le verdure, ma anche da colino per filtrare un brodo o scolare una preparazione.\n\nAcciaio inox forato, manico integrato per estrarre il cestello bollente senza scottarsi. Compatibile con TM6 e TM7.',
      features: [
        'Cottura di riso e pasta direttamente nel boccale',
        'Funziona anche da colino per filtrare e scolare',
        'Manico integrato per estrarre il cestello bollente',
        'Acciaio inox forato, compatibile con TM6 e TM7',
      ],
    },
    en: {
      name: 'Simmering Basket',
      tagline: 'The stainless basket for draining, blanching and cooking rice inside the bowl.',
      description:
        'The simmering basket drops straight into the bowl: use it to cook rice and pasta, to blanch vegetables, and as a strainer for filtering stock or draining a preparation.\n\nPerforated stainless steel with an integrated handle so you can lift the hot basket out without burning yourself. Compatible with the TM6 and TM7.',
      features: [
        'Cook rice and pasta straight in the bowl',
        'Doubles as a strainer for filtering and draining',
        'Integrated handle for lifting the hot basket',
        'Perforated stainless steel, fits TM6 and TM7',
      ],
    },
  },

  'sac-de-transport-tm7': {
    fr: {
      name: 'Sac de transport TM7',
      tagline: 'Housse matelassée avec compartiments pour déplacer le robot et ses accessoires.',
      description:
        "Le TM7 pèse près de huit kilos : le déplacer sans protection, c'est prendre le risque d'un choc sur l'écran. Cette housse matelassée protège l'appareil et range séparément le bol, le Varoma et les petits accessoires.\n\nSangles renforcées, bandoulière amovible, tissu déperlant. Pratique pour les cours de cuisine et les week-ends.",
      features: [
        'Rembourrage épais protégeant l’écran et le corps du robot',
        'Compartiments séparés pour bol, Varoma et accessoires',
        'Sangles renforcées et bandoulière amovible',
        'Tissu extérieur déperlant',
      ],
    },
    de: {
      name: 'Transporttasche TM7',
      tagline: 'Gepolsterte Tasche mit Fächern für Gerät und Zubehör.',
      description:
        'Der TM7 wiegt fast acht Kilo: Ihn ungeschützt zu transportieren heißt, einen Stoß auf das Display zu riskieren. Diese gepolsterte Tasche schützt das Gerät und verstaut Mixtopf, Varoma und Kleinzubehör getrennt.\n\nVerstärkte Gurte, abnehmbarer Schulterriemen, wasserabweisender Stoff. Praktisch für Kochkurse und Wochenenden.',
      features: [
        'Dicke Polsterung schützt Display und Gehäuse',
        'Getrennte Fächer für Mixtopf, Varoma und Zubehör',
        'Verstärkte Gurte und abnehmbarer Schulterriemen',
        'Wasserabweisendes Außenmaterial',
      ],
    },
    it: {
      name: 'Borsa da trasporto TM7',
      tagline: 'Custodia imbottita con scomparti per spostare il robot e i suoi accessori.',
      description:
        "Il TM7 pesa quasi otto chili: spostarlo senza protezione significa rischiare un urto sul display. Questa custodia imbottita protegge l'apparecchio e ripone separatamente boccale, Varoma e piccoli accessori.\n\nCinghie rinforzate, tracolla removibile, tessuto idrorepellente. Pratica per i corsi di cucina e i fine settimana.",
      features: [
        'Imbottitura spessa a protezione di display e scocca',
        'Scomparti separati per boccale, Varoma e accessori',
        'Cinghie rinforzate e tracolla removibile',
        'Tessuto esterno idrorepellente',
      ],
    },
    en: {
      name: 'TM7 Carry Bag',
      tagline: 'Padded bag with compartments for moving the machine and its accessories.',
      description:
        'The TM7 weighs close to eight kilos: moving it unprotected risks a knock to the screen. This padded bag protects the machine and stores the bowl, Varoma and small accessories separately.\n\nReinforced straps, removable shoulder strap, water-repellent fabric. Handy for cookery classes and weekends away.',
      features: [
        'Thick padding protecting the screen and body',
        'Separate compartments for bowl, Varoma and accessories',
        'Reinforced straps and removable shoulder strap',
        'Water-repellent outer fabric',
      ],
    },
  },

  '500-recettes-tm7': {
    fr: {
      name: '500 Recettes TM7',
      tagline: 'L’ouvrage de référence : 500 recettes minutées, du quotidien au repas de fête.',
      description:
        "Cinq cents recettes conçues pour le TM7, classées par occasion : semaine express, batch cooking, réceptions, desserts. Chaque fiche indique le temps réel, le niveau de difficulté et les réglages exacts du robot.\n\nRelié, 480 pages, photographies en pleine page. Un index par ingrédient permet de partir de ce qui reste dans le frigo.",
      features: [
        '500 recettes classées par occasion et par saison',
        'Temps réel, difficulté et réglages exacts indiqués',
        'Index par ingrédient pour cuisiner les restes',
        'Relié, 480 pages, photographies pleine page',
      ],
    },
    de: {
      name: '500 Rezepte TM7',
      tagline: 'Das Standardwerk: 500 Rezepte mit Zeitangaben, vom Alltag bis zum Festessen.',
      description:
        'Fünfhundert Rezepte für den TM7, sortiert nach Anlass: schnelle Woche, Batch Cooking, Empfänge, Desserts. Jede Karte nennt die tatsächliche Zubereitungszeit, den Schwierigkeitsgrad und die exakten Geräteeinstellungen.\n\nGebunden, 480 Seiten, ganzseitige Fotografien. Ein Zutatenregister erlaubt es, von dem auszugehen, was im Kühlschrank übrig ist.',
      features: [
        '500 Rezepte nach Anlass und Saison geordnet',
        'Reale Zeit, Schwierigkeitsgrad und exakte Einstellungen',
        'Zutatenregister zum Verwerten von Resten',
        'Gebunden, 480 Seiten, ganzseitige Fotografien',
      ],
    },
    it: {
      name: '500 Ricette TM7',
      tagline: 'L’opera di riferimento: 500 ricette cronometrate, dal quotidiano al pranzo di festa.',
      description:
        "Cinquecento ricette pensate per il TM7, classificate per occasione: settimana express, batch cooking, ricevimenti, dessert. Ogni scheda indica il tempo reale, il livello di difficoltà e le regolazioni esatte del robot.\n\nRilegato, 480 pagine, fotografie a piena pagina. Un indice per ingrediente permette di partire da ciò che resta in frigo.",
      features: [
        '500 ricette classificate per occasione e stagione',
        'Tempo reale, difficoltà e regolazioni esatte indicati',
        'Indice per ingrediente per cucinare gli avanzi',
        'Rilegato, 480 pagine, fotografie a piena pagina',
      ],
    },
    en: {
      name: '500 TM7 Recipes',
      tagline: 'The reference volume: 500 timed recipes, from weeknights to celebration meals.',
      description:
        'Five hundred recipes written for the TM7, sorted by occasion: quick weeknights, batch cooking, entertaining, desserts. Every card gives the real preparation time, the difficulty level and the exact machine settings.\n\nHardback, 480 pages, full-page photography. An ingredient index lets you start from whatever is left in the fridge.',
      features: [
        '500 recipes sorted by occasion and season',
        'Real timings, difficulty and exact settings given',
        'Ingredient index for cooking with leftovers',
        'Hardback, 480 pages, full-page photography',
      ],
    },
  },

  'patisserie-tm7': {
    fr: {
      name: 'Pâtisserie TM7',
      tagline: 'Les bases de la pâtisserie française adaptées pas à pas au robot.',
      description:
        "Pâte feuilletée, crème pâtissière, macarons, entremets : les classiques de la pâtisserie française, réécrits pour le TM7 avec les vitesses et les températures exactes.\n\nChaque chapitre commence par la technique de base, puis décline trois variantes. Les erreurs fréquentes sont signalées à l'endroit du geste où elles surviennent.",
      features: [
        'Classiques français réécrits pour le robot',
        'Vitesses et températures exactes à chaque étape',
        'Technique de base puis trois variantes par chapitre',
        'Erreurs fréquentes signalées au bon moment',
      ],
    },
    de: {
      name: 'Patisserie TM7',
      tagline: 'Die Grundlagen der französischen Patisserie, Schritt für Schritt aufs Gerät übertragen.',
      description:
        'Blätterteig, Konditorcreme, Macarons, Entremets: die Klassiker der französischen Patisserie, für den TM7 neu geschrieben — mit exakten Geschwindigkeiten und Temperaturen.\n\nJedes Kapitel beginnt mit der Grundtechnik und leitet daraus drei Varianten ab. Häufige Fehler werden genau an der Stelle benannt, an der sie passieren.',
      features: [
        'Französische Klassiker für das Gerät neu geschrieben',
        'Exakte Geschwindigkeiten und Temperaturen je Schritt',
        'Grundtechnik plus drei Varianten pro Kapitel',
        'Häufige Fehler an der richtigen Stelle benannt',
      ],
    },
    it: {
      name: 'Pasticceria TM7',
      tagline: 'Le basi della pasticceria francese adattate passo dopo passo al robot.',
      description:
        'Pasta sfoglia, crema pasticcera, macaron, entremets: i classici della pasticceria francese, riscritti per il TM7 con velocità e temperature esatte.\n\nOgni capitolo parte dalla tecnica di base e ne declina tre varianti. Gli errori più frequenti sono segnalati nel punto esatto in cui si verificano.',
      features: [
        'Classici francesi riscritti per il robot',
        'Velocità e temperature esatte a ogni passaggio',
        'Tecnica di base e tre varianti per capitolo',
        'Errori frequenti segnalati al momento giusto',
      ],
    },
    en: {
      name: 'TM7 Pastry',
      tagline: 'The foundations of French pastry, adapted step by step to the machine.',
      description:
        'Puff pastry, crème pâtissière, macarons, entremets: the classics of French pastry, rewritten for the TM7 with exact speeds and temperatures.\n\nEvery chapter opens with the base technique, then draws three variations from it. Common mistakes are flagged at the exact step where they happen.',
      features: [
        'French classics rewritten for the machine',
        'Exact speeds and temperatures at every step',
        'Base technique plus three variations per chapter',
        'Common mistakes flagged at the right moment',
      ],
    },
  },

  'cuisine-du-monde-tm7': {
    fr: {
      name: 'Cuisine du monde TM7',
      tagline: 'Douze cuisines, deux cents recettes, toutes réglées pour le TM7.',
      description:
        "Thaïlande, Maroc, Japon, Mexique, Italie, Liban : douze cuisines abordées par leurs préparations de base — pâtes de curry, harissa, dashi, sauces mères — puis par les plats qui en découlent.\n\nLes ingrédients difficiles à trouver sont accompagnés d'un substitut réaliste, avec l'écart de goût annoncé honnêtement.",
      features: [
        'Douze cuisines, environ 200 recettes',
        'Préparations de base maison : curry, harissa, dashi',
        'Substituts réalistes pour les ingrédients rares',
        'Réglages TM7 indiqués pour chaque étape',
      ],
    },
    de: {
      name: 'Weltküche TM7',
      tagline: 'Zwölf Küchen, zweihundert Rezepte, alle auf den TM7 eingestellt.',
      description:
        'Thailand, Marokko, Japan, Mexiko, Italien, Libanon: zwölf Küchen, erschlossen über ihre Grundzubereitungen — Currypasten, Harissa, Dashi, Grundsaucen — und dann über die Gerichte, die daraus entstehen.\n\nZu schwer erhältlichen Zutaten gibt es jeweils einen realistischen Ersatz, mit ehrlich benanntem Geschmacksunterschied.',
      features: [
        'Zwölf Küchen, rund 200 Rezepte',
        'Hausgemachte Grundlagen: Curry, Harissa, Dashi',
        'Realistische Alternativen für seltene Zutaten',
        'TM7-Einstellungen für jeden Schritt angegeben',
      ],
    },
    it: {
      name: 'Cucina del mondo TM7',
      tagline: 'Dodici cucine, duecento ricette, tutte regolate per il TM7.',
      description:
        'Thailandia, Marocco, Giappone, Messico, Italia, Libano: dodici cucine affrontate attraverso le loro preparazioni di base — paste di curry, harissa, dashi, salse madri — e poi attraverso i piatti che ne derivano.\n\nGli ingredienti difficili da trovare sono accompagnati da un sostituto realistico, con la differenza di gusto dichiarata onestamente.',
      features: [
        'Dodici cucine, circa 200 ricette',
        'Preparazioni di base fatte in casa: curry, harissa, dashi',
        'Sostituti realistici per gli ingredienti rari',
        'Regolazioni TM7 indicate per ogni passaggio',
      ],
    },
    en: {
      name: 'TM7 World Cuisine',
      tagline: 'Twelve cuisines, two hundred recipes, all dialled in for the TM7.',
      description:
        'Thailand, Morocco, Japan, Mexico, Italy, Lebanon: twelve cuisines approached through their base preparations — curry pastes, harissa, dashi, mother sauces — and then through the dishes built on them.\n\nHard-to-find ingredients each come with a realistic substitute, and the difference in taste is stated honestly.',
      features: [
        'Twelve cuisines, around 200 recipes',
        'Homemade base preparations: curry, harissa, dashi',
        'Realistic substitutes for hard-to-find ingredients',
        'TM7 settings given for every step',
      ],
    },
  },

  'pack-tm7-essentiel': {
    fr: {
      name: 'Pack TM7 Essentiel',
      tagline: 'Le TM7 reconditionné, le Varoma XL et la spatule officielle — l’équipement de départ.',
      description:
        "Le pack qui couvre les six premiers mois : un Thermomix TM7 reconditionné garanti 24 mois, le Varoma XL Steam Set pour cuire un repas complet en une fournée, et la spatule officielle indispensable au quotidien.\n\nRegroupés, ces trois articles reviennent moins cher qu'achetés séparément. Livraison offerte, retour sous 14 jours.",
      features: [
        'Thermomix TM7 reconditionné, garanti 24 mois',
        'Varoma XL Steam Set : repas complet en une fournée',
        'Spatule Thermomix officielle incluse',
        'Économie immédiate par rapport à l’achat séparé',
      ],
    },
    de: {
      name: 'Paket TM7 Basis',
      tagline: 'Der generalüberholte TM7, das Varoma XL und der Originalspatel — die Grundausstattung.',
      description:
        'Das Paket, das die ersten sechs Monate abdeckt: ein generalüberholter Thermomix TM7 mit 24 Monaten Garantie, das Varoma XL Dampfgarset für eine komplette Mahlzeit in einem Durchgang und der im Alltag unverzichtbare Originalspatel.\n\nZusammen kosten die drei Artikel weniger als einzeln gekauft. Versandkostenfrei, Rückgabe innerhalb von 14 Tagen.',
      features: [
        'Generalüberholter Thermomix TM7, 24 Monate Garantie',
        'Varoma XL Dampfgarset: komplette Mahlzeit auf einmal',
        'Original-Thermomix-Spatel inklusive',
        'Sofortige Ersparnis gegenüber dem Einzelkauf',
      ],
    },
    it: {
      name: 'Pack TM7 Essenziale',
      tagline: 'Il TM7 ricondizionato, il Varoma XL e la spatola originale — l’attrezzatura di partenza.',
      description:
        "Il pack che copre i primi sei mesi: un Thermomix TM7 ricondizionato con garanzia 24 mesi, il Varoma XL Steam Set per cuocere un pasto completo in una sola volta e la spatola originale indispensabile ogni giorno.\n\nInsieme, questi tre articoli costano meno che acquistati separatamente. Spedizione gratuita, reso entro 14 giorni.",
      features: [
        'Thermomix TM7 ricondizionato, garanzia 24 mesi',
        'Varoma XL Steam Set: pasto completo in una volta',
        'Spatola Thermomix originale inclusa',
        'Risparmio immediato rispetto all’acquisto separato',
      ],
    },
    en: {
      name: 'TM7 Essential Bundle',
      tagline: 'The refurbished TM7, the Varoma XL and the official spatula — the starter set-up.',
      description:
        'The bundle that covers your first six months: a refurbished Thermomix TM7 with a 24-month warranty, the Varoma XL Steam Set for cooking a full meal in one run, and the official spatula you reach for every day.\n\nBought together, the three items cost less than separately. Free shipping, 14-day returns.',
      features: [
        'Refurbished Thermomix TM7, 24-month warranty',
        'Varoma XL Steam Set: a full meal in one run',
        'Official Thermomix spatula included',
        'Immediate saving versus buying separately',
      ],
    },
  },

  'pack-tm7-patisserie': {
    fr: {
      name: 'Pack TM7 Pâtisserie',
      tagline: 'Le TM7, le Kit Pâtisserie Pro et le livre Pâtisserie — pour pâtisser dès le premier jour.',
      description:
        "Pour qui achète un TM7 d'abord pour pâtisser : le robot reconditionné garanti 24 mois, le Kit Pâtisserie Pro (fouet renforcé, spatule silicone, moules, poche à douille) et le livre Pâtisserie TM7 qui reprend les bases françaises pas à pas.\n\nDe quoi réussir une crème pâtissière et une pâte feuilletée dès la première semaine.",
      features: [
        'Thermomix TM7 reconditionné, garanti 24 mois',
        'Kit Pâtisserie Pro : fouet, spatule, moules, poche',
        'Livre Pâtisserie TM7 inclus',
        'Économie immédiate par rapport à l’achat séparé',
      ],
    },
    de: {
      name: 'Paket TM7 Patisserie',
      tagline: 'Der TM7, das Backset Pro und das Patisserie-Buch — ab dem ersten Tag backen.',
      description:
        'Für alle, die den TM7 vor allem zum Backen kaufen: das generalüberholte Gerät mit 24 Monaten Garantie, das Backset Pro (verstärkter Schneebesen, Silikonspatel, Formen, Spritzbeutel) und das Buch Patisserie TM7 mit den französischen Grundlagen Schritt für Schritt.\n\nGenug, um schon in der ersten Woche Konditorcreme und Blätterteig zu meistern.',
      features: [
        'Generalüberholter Thermomix TM7, 24 Monate Garantie',
        'Backset Pro: Schneebesen, Spatel, Formen, Spritzbeutel',
        'Buch Patisserie TM7 inklusive',
        'Sofortige Ersparnis gegenüber dem Einzelkauf',
      ],
    },
    it: {
      name: 'Pack TM7 Pasticceria',
      tagline: 'Il TM7, il Kit Pasticceria Pro e il libro Pasticceria — per iniziare dal primo giorno.',
      description:
        "Per chi compra un TM7 soprattutto per fare pasticceria: il robot ricondizionato con garanzia 24 mesi, il Kit Pasticceria Pro (frusta rinforzata, spatola in silicone, stampi, sac à poche) e il libro Pasticceria TM7 che riprende le basi francesi passo dopo passo.\n\nQuanto basta per riuscire crema pasticcera e pasta sfoglia già dalla prima settimana.",
      features: [
        'Thermomix TM7 ricondizionato, garanzia 24 mesi',
        'Kit Pasticceria Pro: frusta, spatola, stampi, sac à poche',
        'Libro Pasticceria TM7 incluso',
        'Risparmio immediato rispetto all’acquisto separato',
      ],
    },
    en: {
      name: 'TM7 Pastry Bundle',
      tagline: 'The TM7, the Pro Baking Kit and the Pastry book — start baking on day one.',
      description:
        'For anyone buying a TM7 mainly to bake: the refurbished machine with a 24-month warranty, the Pro Baking Kit (reinforced whisk, silicone spatula, moulds, piping bag) and the TM7 Pastry book covering the French foundations step by step.\n\nEnough to nail a crème pâtissière and a puff pastry in your first week.',
      features: [
        'Refurbished Thermomix TM7, 24-month warranty',
        'Pro Baking Kit: whisk, spatula, moulds, piping bag',
        'TM7 Pastry book included',
        'Immediate saving versus buying separately',
      ],
    },
  },

  'pack-tm7-complet': {
    fr: {
      name: 'Pack TM7 Complet',
      tagline: 'Le TM7, le second bol, le Varoma XL, le kit pâtisserie et les livres — rien à racheter.',
      description:
        "La configuration complète : Thermomix TM7 reconditionné garanti 24 mois, second bol mixeur pour enchaîner sans laver, Varoma XL Steam Set, Kit Pâtisserie Pro, spatule officielle et la bibliothèque de recettes.\n\nC'est le pack des foyers qui cuisinent tous les jours et reçoivent souvent. L'écart de prix avec l'achat séparé dépasse deux cent cinquante euros.",
      features: [
        'Thermomix TM7 reconditionné, garanti 24 mois',
        'Second bol mixeur complet inclus',
        'Varoma XL, Kit Pâtisserie Pro et spatule officielle',
        'Bibliothèque de recettes TM7 incluse',
      ],
    },
    de: {
      name: 'Paket TM7 Komplett',
      tagline: 'TM7, zweiter Mixtopf, Varoma XL, Backset und Bücher — nichts muss nachgekauft werden.',
      description:
        'Die vollständige Ausstattung: generalüberholter Thermomix TM7 mit 24 Monaten Garantie, zweiter Mixtopf für das Arbeiten ohne Zwischenspülen, Varoma XL Dampfgarset, Backset Pro, Originalspatel und die Rezeptbibliothek.\n\nDas Paket für Haushalte, die täglich kochen und oft Gäste haben. Der Preisvorteil gegenüber dem Einzelkauf liegt über zweihundertfünfzig Euro.',
      features: [
        'Generalüberholter Thermomix TM7, 24 Monate Garantie',
        'Kompletter zweiter Mixtopf inklusive',
        'Varoma XL, Backset Pro und Originalspatel',
        'TM7-Rezeptbibliothek inklusive',
      ],
    },
    it: {
      name: 'Pack TM7 Completo',
      tagline: 'Il TM7, il secondo boccale, il Varoma XL, il kit pasticceria e i libri — nulla da ricomprare.',
      description:
        "La configurazione completa: Thermomix TM7 ricondizionato con garanzia 24 mesi, secondo boccale per lavorare senza lavare in mezzo, Varoma XL Steam Set, Kit Pasticceria Pro, spatola originale e la biblioteca di ricette.\n\nÈ il pack delle famiglie che cucinano tutti i giorni e ricevono spesso. Il divario di prezzo con l'acquisto separato supera i duecentocinquanta euro.",
      features: [
        'Thermomix TM7 ricondizionato, garanzia 24 mesi',
        'Secondo boccale completo incluso',
        'Varoma XL, Kit Pasticceria Pro e spatola originale',
        'Biblioteca di ricette TM7 inclusa',
      ],
    },
    en: {
      name: 'TM7 Complete Bundle',
      tagline: 'The TM7, second bowl, Varoma XL, baking kit and books — nothing left to buy.',
      description:
        'The full set-up: a refurbished Thermomix TM7 with a 24-month warranty, a second mixing bowl so you never stop to wash up, the Varoma XL Steam Set, the Pro Baking Kit, the official spatula and the recipe library.\n\nThis is the bundle for households that cook daily and entertain often. The saving against buying separately runs past two hundred and fifty euros.',
      features: [
        'Refurbished Thermomix TM7, 24-month warranty',
        'Complete second mixing bowl included',
        'Varoma XL, Pro Baking Kit and official spatula',
        'TM7 recipe library included',
      ],
    },
  },

  'samsung-family-hub': {
    fr: {
      name: 'Samsung Family Hub',
      tagline: 'Le réfrigérateur connecté à écran tactile qui gère vos courses et vos menus.',
      description:
        "Le Samsung Family Hub remplace la porte de frigo couverte de post-it par un écran tactile de 21 pouces. Trois caméras internes photographient les clayettes à chaque fermeture : depuis le supermarché, vous voyez ce qu'il reste réellement chez vous.\n\nL'écran affiche aussi les calendriers partagés, diffuse la musique et la télévision, et propose des recettes construites à partir des aliments détectés. Le froid ventilé Twin Cooling Plus maintient deux circuits indépendants pour éviter le transfert d'odeurs entre le réfrigérateur et le congélateur.",
      features: [
        'Écran tactile 21 pouces avec calendriers partagés',
        'Trois caméras internes consultables à distance',
        'Suggestions de recettes selon le contenu détecté',
        'Froid ventilé Twin Cooling Plus, deux circuits séparés',
      ],
    },
    de: {
      name: 'Samsung Family Hub',
      tagline: 'Der vernetzte Kühlschrank mit Touchdisplay, der Einkauf und Menüs organisiert.',
      description:
        'Der Samsung Family Hub ersetzt die mit Klebezetteln übersäte Kühlschranktür durch ein 21-Zoll-Touchdisplay. Drei Innenkameras fotografieren die Ablagen bei jedem Schließen: Vom Supermarkt aus sehen Sie, was tatsächlich noch zu Hause ist.\n\nDas Display zeigt außerdem gemeinsame Kalender, spielt Musik und Fernsehen ab und schlägt Rezepte auf Basis der erkannten Lebensmittel vor. Die Twin-Cooling-Plus-Umluftkühlung hält zwei getrennte Kreisläufe, damit keine Gerüche zwischen Kühl- und Gefrierteil übergehen.',
      features: [
        '21-Zoll-Touchdisplay mit gemeinsamen Kalendern',
        'Drei Innenkameras, aus der Ferne abrufbar',
        'Rezeptvorschläge nach erkanntem Inhalt',
        'Twin Cooling Plus: zwei getrennte Kühlkreisläufe',
      ],
    },
    it: {
      name: 'Samsung Family Hub',
      tagline: 'Il frigorifero connesso con display touch che gestisce spesa e menu.',
      description:
        "Il Samsung Family Hub sostituisce la porta del frigo tappezzata di post-it con un display touch da 21 pollici. Tre telecamere interne fotografano i ripiani a ogni chiusura: dal supermercato vedi che cosa è rimasto davvero a casa.\n\nLo schermo mostra anche i calendari condivisi, riproduce musica e televisione e propone ricette costruite sugli alimenti rilevati. Il raffreddamento ventilato Twin Cooling Plus mantiene due circuiti indipendenti per evitare il trasferimento di odori tra frigorifero e congelatore.",
      features: [
        'Display touch da 21 pollici con calendari condivisi',
        'Tre telecamere interne consultabili a distanza',
        'Suggerimenti di ricette secondo il contenuto rilevato',
        'Twin Cooling Plus: due circuiti di freddo separati',
      ],
    },
    en: {
      name: 'Samsung Family Hub',
      tagline: 'The connected fridge with a touchscreen that runs your shopping and your menus.',
      description:
        'The Samsung Family Hub replaces the sticky-note-covered fridge door with a 21-inch touchscreen. Three internal cameras photograph the shelves each time you close it: from the supermarket, you can see what is actually left at home.\n\nThe screen also shows shared calendars, plays music and television, and suggests recipes built from the food it detects. Twin Cooling Plus keeps two independent circuits so odours never transfer between the fridge and the freezer.',
      features: [
        '21-inch touchscreen with shared calendars',
        'Three internal cameras you can check remotely',
        'Recipe suggestions based on detected contents',
        'Twin Cooling Plus: two separate cooling circuits',
      ],
    },
  },

  'thermostat-nest': {
    fr: {
      name: 'Thermostat Nest',
      tagline: 'Le thermostat qui apprend vos habitudes et coupe le chauffage quand vous sortez.',
      description:
        "Le Thermostat Nest observe vos réglages pendant une semaine, puis construit seul un programme de chauffe. Ses capteurs de présence détectent une maison vide et abaissent la consigne sans que vous ayez à y penser.\n\nLe rapport mensuel détaille les heures de chauffe et ce qui les a déclenchées, ce qui rend l'économie mesurable plutôt que théorique. Pilotage à distance depuis le téléphone, compatible chaudière gaz, fioul, pompe à chaleur et chauffage électrique.",
      features: [
        'Apprentissage automatique du programme de chauffe',
        'Détection d’absence et abaissement automatique',
        'Rapport mensuel détaillant les heures de chauffe',
        'Compatible gaz, fioul, pompe à chaleur et électrique',
      ],
    },
    de: {
      name: 'Nest Thermostat',
      tagline: 'Das Thermostat, das Ihre Gewohnheiten lernt und beim Verlassen des Hauses abschaltet.',
      description:
        'Das Nest Thermostat beobachtet Ihre Einstellungen eine Woche lang und erstellt daraus selbstständig ein Heizprogramm. Die Anwesenheitssensoren erkennen ein leeres Haus und senken die Solltemperatur, ohne dass Sie daran denken müssen.\n\nDer Monatsbericht schlüsselt die Heizstunden und ihre Auslöser auf — die Ersparnis wird damit messbar statt theoretisch. Fernsteuerung per Telefon, kompatibel mit Gas- und Ölheizung, Wärmepumpe und Elektroheizung.',
      features: [
        'Lernt das Heizprogramm selbstständig',
        'Abwesenheitserkennung mit automatischer Absenkung',
        'Monatsbericht mit Aufschlüsselung der Heizstunden',
        'Kompatibel mit Gas, Öl, Wärmepumpe und Elektro',
      ],
    },
    it: {
      name: 'Termostato Nest',
      tagline: 'Il termostato che impara le tue abitudini e spegne il riscaldamento quando esci.',
      description:
        "Il Termostato Nest osserva le tue regolazioni per una settimana, poi costruisce da solo un programma di riscaldamento. I sensori di presenza rilevano la casa vuota e abbassano la temperatura impostata senza che tu debba pensarci.\n\nIl rapporto mensile dettaglia le ore di riscaldamento e che cosa le ha attivate, rendendo il risparmio misurabile anziché teorico. Controllo a distanza dal telefono, compatibile con caldaia a gas, a gasolio, pompa di calore e riscaldamento elettrico.",
      features: [
        'Apprendimento automatico del programma di riscaldamento',
        'Rilevamento di assenza e abbassamento automatico',
        'Rapporto mensile con il dettaglio delle ore di riscaldamento',
        'Compatibile con gas, gasolio, pompa di calore ed elettrico',
      ],
    },
    en: {
      name: 'Nest Thermostat',
      tagline: 'The thermostat that learns your routine and turns the heating down when you leave.',
      description:
        'The Nest Thermostat watches your adjustments for a week, then builds a heating schedule on its own. Its presence sensors detect an empty house and lower the target temperature without you having to think about it.\n\nThe monthly report breaks down the heating hours and what triggered them, which makes the saving measurable rather than theoretical. Remote control from your phone, compatible with gas and oil boilers, heat pumps and electric heating.',
      features: [
        'Learns your heating schedule automatically',
        'Away detection with automatic setback',
        'Monthly report breaking down heating hours',
        'Works with gas, oil, heat pump and electric systems',
      ],
    },
  },

  'dyson-hot-cool': {
    fr: {
      name: 'Dyson Hot+Cool',
      tagline: 'Chauffage l’hiver, ventilateur l’été, purification toute l’année — sans pales apparentes.',
      description:
        "Le Dyson Hot+Cool remplace trois appareils : le radiateur d'appoint, le ventilateur et le purificateur. La technologie Air Multiplier projette un flux continu sans pales exposées, ce qui le rend sûr avec des enfants et nettement plus simple à nettoyer qu'un ventilateur classique.\n\nLe filtre HEPA retient les particules fines, les pollens et les composés organiques volatils. L'appareil coupe seul le chauffage une fois la température de consigne atteinte, puis le relance si la pièce redescend.",
      features: [
        'Chauffage, ventilation et purification en un appareil',
        'Air Multiplier : aucun pale exposée, sûr avec des enfants',
        'Filtre HEPA : particules fines, pollens et COV',
        'Arrêt et relance automatiques sur température de consigne',
      ],
    },
    de: {
      name: 'Dyson Hot+Cool',
      tagline: 'Im Winter Heizung, im Sommer Ventilator, ganzjährig Luftreinigung — ohne sichtbare Rotorblätter.',
      description:
        'Der Dyson Hot+Cool ersetzt drei Geräte: Zusatzheizung, Ventilator und Luftreiniger. Die Air-Multiplier-Technologie erzeugt einen gleichmäßigen Luftstrom ohne freiliegende Rotorblätter — sicher mit Kindern und deutlich einfacher zu reinigen als ein klassischer Ventilator.\n\nDer HEPA-Filter hält Feinstaub, Pollen und flüchtige organische Verbindungen zurück. Das Gerät schaltet die Heizung bei Erreichen der Solltemperatur selbst ab und startet sie wieder, wenn der Raum abkühlt.',
      features: [
        'Heizen, Lüften und Reinigen in einem Gerät',
        'Air Multiplier: keine freiliegenden Rotorblätter',
        'HEPA-Filter: Feinstaub, Pollen und VOC',
        'Automatisches Abschalten und Wiederanlaufen',
      ],
    },
    it: {
      name: 'Dyson Hot+Cool',
      tagline: 'Riscaldamento d’inverno, ventilatore d’estate, purificazione tutto l’anno — senza pale a vista.',
      description:
        "Il Dyson Hot+Cool sostituisce tre apparecchi: la stufetta, il ventilatore e il purificatore. La tecnologia Air Multiplier proietta un flusso continuo senza pale esposte, il che lo rende sicuro con i bambini e molto più semplice da pulire di un ventilatore classico.\n\nIl filtro HEPA trattiene le particelle fini, i pollini e i composti organici volatili. L'apparecchio spegne da solo il riscaldamento una volta raggiunta la temperatura impostata, poi lo riavvia se la stanza si raffredda.",
      features: [
        'Riscaldamento, ventilazione e purificazione in un apparecchio',
        'Air Multiplier: nessuna pala esposta, sicuro con i bambini',
        'Filtro HEPA: particelle fini, pollini e COV',
        'Spegnimento e riavvio automatici sulla temperatura impostata',
      ],
    },
    en: {
      name: 'Dyson Hot+Cool',
      tagline: 'Heater in winter, fan in summer, purifier all year — with no exposed blades.',
      description:
        'The Dyson Hot+Cool replaces three appliances: the space heater, the fan and the purifier. Air Multiplier technology projects a steady stream with no exposed blades, which makes it safe around children and far easier to clean than a conventional fan.\n\nThe HEPA filter captures fine particles, pollen and volatile organic compounds. The unit switches the heat off once the target temperature is reached, then starts again if the room cools down.',
      features: [
        'Heating, cooling and purification in one appliance',
        'Air Multiplier: no exposed blades, safe around children',
        'HEPA filter: fine particles, pollen and VOCs',
        'Automatic cut-off and restart on target temperature',
      ],
    },
  },

  'ninja-creami': {
    fr: {
      name: 'Ninja Creami',
      tagline: 'La turbine qui transforme un bac congelé en glace onctueuse en trois minutes.',
      description:
        "Le Ninja Creami ne fonctionne pas comme une sorbetière : il rase un bloc congelé à très haute vitesse pour en faire une texture crémeuse, sans temps de turbinage. Vous préparez la base la veille, vous la congelez, et l'appareil s'occupe du reste au moment de servir.\n\nSept programmes couvrent glace, sorbet, gelato, milkshake et smoothie bowl. C'est aussi l'outil le plus simple pour maîtriser exactement le sucre : une base au yaourt et aux fruits donne un dessert honnête sans additifs.",
      features: [
        'Texture crémeuse en trois minutes depuis un bac congelé',
        'Sept programmes : glace, sorbet, gelato, milkshake, smoothie bowl',
        'Contrôle total du sucre et des ingrédients',
        'Bacs et couvercles compatibles lave-vaisselle',
      ],
    },
    de: {
      name: 'Ninja Creami',
      tagline: 'Die Maschine, die einen gefrorenen Becher in drei Minuten in cremiges Eis verwandelt.',
      description:
        'Der Ninja Creami arbeitet anders als eine Eismaschine: Er fräst einen gefrorenen Block mit sehr hoher Drehzahl zu einer cremigen Textur, ganz ohne Rührzeit. Sie bereiten die Basis am Vortag zu, frieren sie ein, und das Gerät übernimmt den Rest beim Servieren.\n\nSieben Programme decken Eis, Sorbet, Gelato, Milchshake und Smoothie Bowl ab. Es ist zugleich das einfachste Werkzeug, um den Zucker exakt zu steuern: Eine Basis aus Joghurt und Früchten ergibt ein ehrliches Dessert ohne Zusatzstoffe.',
      features: [
        'Cremige Textur in drei Minuten aus einem gefrorenen Becher',
        'Sieben Programme: Eis, Sorbet, Gelato, Milchshake, Smoothie Bowl',
        'Volle Kontrolle über Zucker und Zutaten',
        'Becher und Deckel spülmaschinenfest',
      ],
    },
    it: {
      name: 'Ninja Creami',
      tagline: 'La macchina che trasforma una vaschetta congelata in gelato cremoso in tre minuti.',
      description:
        "Il Ninja Creami non funziona come una gelatiera: fresa un blocco congelato ad altissima velocità per ottenere una texture cremosa, senza tempi di mantecazione. Prepari la base la sera prima, la congeli, e l'apparecchio pensa al resto al momento di servire.\n\nSette programmi coprono gelato, sorbetto, gelato all'italiana, milkshake e smoothie bowl. È anche lo strumento più semplice per controllare esattamente lo zucchero: una base allo yogurt e frutta dà un dessert onesto senza additivi.",
      features: [
        'Texture cremosa in tre minuti da una vaschetta congelata',
        'Sette programmi: gelato, sorbetto, milkshake, smoothie bowl',
        'Controllo totale su zucchero e ingredienti',
        'Vaschette e coperchi lavabili in lavastoviglie',
      ],
    },
    en: {
      name: 'Ninja Creami',
      tagline: 'The machine that turns a frozen pint into smooth ice cream in three minutes.',
      description:
        'The Ninja Creami does not work like a churner: it shaves a frozen block at very high speed into a creamy texture, with no churning time at all. You make the base the day before, freeze it, and the machine handles the rest at serving time.\n\nSeven programmes cover ice cream, sorbet, gelato, milkshake and smoothie bowl. It is also the simplest way to control sugar exactly: a yoghurt-and-fruit base gives you an honest dessert with no additives.',
      features: [
        'Creamy texture in three minutes from a frozen pint',
        'Seven programmes: ice cream, sorbet, gelato, milkshake, smoothie bowl',
        'Full control over sugar and ingredients',
        'Dishwasher-safe pints and lids',
      ],
    },
  },
};

/**
 * Contenu localisé d'un produit. Repli sur le français si une traduction
 * venait à manquer — la page reste servie plutôt que de planter.
 */
export function getProductContent(slug: string, locale: Locale): ProductContent {
  const entry = CONTENT[slug];
  if (!entry) {
    const p = PRODUCTS.find((x) => x.slug === slug);
    const name = p?.name ?? slug;
    return { name, tagline: name, description: name, features: ['', '', '', ''] };
  }
  return entry[locale] ?? entry.fr;
}

/** Vrai si chaque produit du catalogue dispose des 4 traductions. */
export function missingContent(): string[] {
  const missing: string[] = [];
  for (const p of PRODUCTS) {
    const e = CONTENT[p.slug];
    if (!e) { missing.push(p.slug); continue; }
    for (const l of locales) if (!e[l]) missing.push(`${p.slug}:${l}`);
  }
  return missing;
}
