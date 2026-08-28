import type { LegalContent } from './types';

const MAIL = 'kitchenprime@outlook.com';
const ADDRESS = '539 route de Saint-Joseph CS 20811 — 44308 Nantes Cedex 3, Francia';
const SIRET = '622 028 777 02677';
const PHONE = '+33 7 56 97 65 02';

export const it: LegalContent = {
  cgv: {
    eyebrow: 'Contratto di vendita',
    title: 'Condizioni generali di vendita',
    subtitle: 'Ultimo aggiornamento: agosto 2026',
    back: 'Torna alla home',
    sections: [
      {
        h: 'Articolo 1 — Oggetto e ambito di applicazione',
        blocks: [
          {
            t: 'p',
            text: `Le presenti Condizioni Generali di Vendita (CGV) disciplinano tutte le vendite concluse tra **KitchenPrime** (${ADDRESS}, SIRET ${SIRET}) e qualsiasi acquirente, consumatore o professionista, tramite il sito kitchenprime.com o qualsiasi altro canale d’ordine.`,
          },
          {
            t: 'p',
            text: 'KitchenPrime commercializza robot da cucina **Thermomix® TM7 usati ricondizionati**, accessori e libri correlati, nonché elettrodomestici e dispositivi per la casa connessa nuovi. KitchenPrime non è un rivenditore ufficiale Vorwerk.',
          },
        ],
      },
      {
        h: 'Articolo 2 — Prezzi',
        blocks: [
          {
            t: 'p',
            text: 'I prezzi indicati sono espressi in euro (€) **IVA inclusa**, con applicazione dell’IVA francese. KitchenPrime si riserva il diritto di modificare i prezzi in qualsiasi momento; i prodotti sono fatturati al prezzo in vigore al momento della conferma dell’ordine.',
          },
          { t: 'p', text: 'Le spese di spedizione sono offerte per ogni ordine destinato all’Europa continentale.' },
        ],
      },
      {
        h: 'Articolo 3 — Ordini',
        blocks: [
          {
            t: 'p',
            text: 'L’ordine è confermato al ricevimento del pagamento integrale. KitchenPrime ne accusa ricevuta via e-mail entro 24 ore. Ogni ordine comporta l’accettazione delle presenti CGV.',
          },
          {
            t: 'p',
            text: 'KitchenPrime si riserva il diritto di annullare o rifiutare qualsiasi ordine per motivo legittimo (esaurimento scorte, anomalia di prezzo, sospetta frode), con rimborso integrale entro 14 giorni.',
          },
        ],
      },
      {
        h: 'Articolo 4 — Pagamento',
        blocks: [
          { t: 'p', text: 'Le modalità di pagamento accettate sono:' },
          {
            t: 'ul',
            items: [
              'Carta di credito (Visa, Mastercard)',
              'Bonifico bancario (SEPA e internazionale)',
              'Apple Pay',
            ],
          },
          { t: 'p', text: 'Il pagamento è protetto da cifratura SSL/TLS. KitchenPrime non conserva alcun dato bancario.' },
        ],
      },
      {
        h: 'Articolo 5 — Consegna',
        blocks: [
          {
            t: 'p',
            text: 'Gli ordini sono spediti in Francia e nell’Unione europea. I tempi stimati sono di **3-7 giorni lavorativi** dalla conferma del pagamento. In caso di ritardo superiore a 30 giorni, il cliente può annullare l’ordine e sarà interamente rimborsato.',
          },
          {
            t: 'p',
            text: 'KitchenPrime non può essere ritenuta responsabile di ritardi imputabili al vettore o a eventi di forza maggiore.',
          },
        ],
      },
      {
        h: 'Articolo 6 — Diritto di recesso',
        blocks: [
          {
            t: 'p',
            text: 'Ai sensi degli articoli L221-18 e seguenti del Codice del consumo francese, il consumatore dispone di un **termine di 14 giorni di calendario** dal ricevimento del prodotto per esercitare il diritto di recesso, senza obbligo di motivazione.',
          },
          {
            t: 'p',
            text: `Per esercitare tale diritto, contattaci via e-mail a [${MAIL}](mailto:${MAIL}) o tramite WhatsApp prima della scadenza del termine. Il rimborso integrale avviene entro **14 giorni** dal ricevimento del reso, con lo stesso mezzo di pagamento.`,
          },
          { t: 'p', text: 'Le spese di reso sono a carico del cliente, salvo prodotto difettoso o non conforme.' },
        ],
      },
      {
        h: 'Articolo 7 — Garanzie legali',
        blocks: [
          { t: 'p', text: 'I prodotti beneficiano di:' },
          {
            t: 'ul',
            items: [
              '**Garanzia legale di conformità** (art. L217-4 Cod. cons. fr.): 2 anni per i prodotti nuovi, 1 anno per i prodotti usati, per ogni difetto esistente al momento della consegna.',
              '**Garanzia legale per vizi occulti** (art. 1641 Cod. civ. fr.): 2 anni dalla scoperta del vizio.',
              '**Garanzia commerciale KitchenPrime**: 24 mesi su ricambi e manodopera per i robot ricondizionati.',
            ],
          },
          {
            t: 'p',
            text: 'In caso di prodotto non conforme, KitchenPrime si fa carico delle spese di reso e procede alla riparazione, alla sostituzione o al rimborso integrale, a scelta del cliente.',
          },
        ],
      },
      {
        h: 'Articolo 8 — Protezione dei dati',
        blocks: [
          {
            t: 'p',
            text: `I dati personali raccolti (nome, indirizzo, e-mail, telefono) sono utilizzati esclusivamente per l’esecuzione degli ordini. Ai sensi del GDPR, puoi esercitare i tuoi diritti scrivendo a [${MAIL}](mailto:${MAIL}).`,
          },
        ],
      },
      {
        h: 'Articolo 9 — Mediazione del consumo',
        blocks: [
          {
            t: 'p',
            text: 'In caso di controversia non risolta in via amichevole, il consumatore può ricorrere gratuitamente a un mediatore del consumo accreditato. La Commissione europea mette inoltre a disposizione una piattaforma di risoluzione online delle controversie: [ec.europa.eu/consumers/odr](https://ec.europa.eu/consumers/odr).',
          },
        ],
      },
      {
        h: 'Articolo 10 — Legge applicabile e foro competente',
        blocks: [
          {
            t: 'p',
            text: 'Le presenti CGV sono soggette al diritto francese. Ogni controversia è di competenza del Tribunale di commercio di Nantes, salvo diversa disposizione di legge applicabile ai consumatori.',
          },
        ],
      },
    ],
  },

  legal: {
    eyebrow: 'Informazioni legali',
    title: 'Note legali',
    back: 'Torna alla home',
    sections: [
      {
        h: '1. Editore del sito',
        blocks: [
          { t: 'p', text: 'Il presente sito è edito da:' },
          {
            t: 'ul',
            items: [
              '**Ragione sociale:** KitchenPrime',
              '**Forma giuridica:** società commerciale',
              `**Indirizzo:** ${ADDRESS}`,
              `**SIRET:** ${SIRET}`,
              `**E-mail:** [${MAIL}](mailto:${MAIL})`,
              '**Direttore della pubblicazione:** KitchenPrime',
            ],
          },
        ],
      },
      {
        h: '2. Hosting',
        blocks: [
          {
            t: 'ul',
            items: [
              '**Società:** Vercel Inc.',
              '**Indirizzo:** 340 Pine Street, Suite 701 — San Francisco, CA 94104, Stati Uniti',
              '**Sito web:** [vercel.com](https://vercel.com)',
            ],
          },
        ],
      },
      {
        h: '3. Proprietà intellettuale',
        blocks: [
          {
            t: 'p',
            text: 'L’insieme dei contenuti di questo sito (testi, immagini, grafica, logo, icone, software) è di proprietà esclusiva di KitchenPrime, fatta eccezione per i contenuti provenienti da partner o licenziatari. Ogni riproduzione, distribuzione o utilizzo senza previa autorizzazione scritta è vietato.',
          },
          {
            t: 'p',
            text: 'I marchi **Thermomix®** e **Vorwerk®** sono marchi registrati di Vorwerk & Co. KG. I marchi **Samsung®**, **Google Nest®**, **Dyson®** e **Ninja®** appartengono ai rispettivi titolari. KitchenPrime non è autorizzata da nessuno di questi marchi e opera in modo indipendente.',
          },
        ],
      },
      {
        h: '4. Dati personali',
        blocks: [
          {
            t: 'p',
            text: 'Le informazioni raccolte durante i tuoi ordini sono trattate in conformità al Regolamento generale sulla protezione dei dati (GDPR — UE 2016/679). Sono utilizzate esclusivamente per la gestione degli ordini e non sono cedute a terzi.',
          },
          {
            t: 'p',
            text: `Hai diritto di accesso, rettifica e cancellazione dei tuoi dati. Per esercitarlo, scrivi a [${MAIL}](mailto:${MAIL}).`,
          },
        ],
      },
      {
        h: '5. Cookie',
        blocks: [
          {
            t: 'p',
            text: 'Questo sito utilizza esclusivamente cookie tecnici strettamente necessari al funzionamento (sessione, carrello, preferenza di lingua). Non viene installato alcun cookie pubblicitario di terze parti.',
          },
        ],
      },
      {
        h: '6. Legge applicabile',
        blocks: [
          {
            t: 'p',
            text: 'Le presenti note legali sono soggette al diritto francese. Ogni controversia è di competenza esclusiva dei tribunali francesi.',
          },
        ],
      },
    ],
  },

  returns: {
    eyebrow: 'Resi e rimborsi',
    title: 'Politica di reso',
    subtitle: 'La tua soddisfazione è la nostra priorità',
    back: 'Torna alla home',
    highlight: {
      strong: '14 giorni per ripensarci',
      text: 'Restituisci il prodotto senza motivazione entro 14 giorni dal ricevimento.',
    },
    sections: [
      {
        h: 'Come avviare un reso?',
        blocks: [
          {
            t: 'ol',
            items: [
              `Contattaci via e-mail a [${MAIL}](mailto:${MAIL}) o tramite WhatsApp al **${PHONE}**`,
              'Indica il numero d’ordine e il motivo del reso',
              'Ti inviamo entro 24 ore le istruzioni di imballaggio e l’indirizzo di reso',
              'Spedisci il prodotto accuratamente imballato nel suo stato originale',
            ],
          },
        ],
      },
      {
        h: 'Condizioni di reso',
        blocks: [
          {
            t: 'ul',
            items: [
              'Il prodotto deve essere restituito **nel suo stato originale**, completo (accessori e manuali inclusi)',
              'Termine di reso: **14 giorni di calendario** dalla data di ricevimento',
              'Le spese di reso sono a carico del cliente, salvo prodotto difettoso o non conforme',
              'I prodotti danneggiati dal cliente non possono essere rimborsati',
            ],
          },
        ],
      },
      {
        h: 'Rimborso',
        blocks: [
          {
            t: 'p',
            text: 'Al ricevimento e alla verifica del reso, il rimborso è effettuato entro **massimo 14 giorni**, con lo stesso mezzo di pagamento utilizzato per l’acquisto.',
          },
          {
            t: 'ul',
            items: [
              '**Carta di credito:** 3-5 giorni lavorativi dopo la convalida',
              '**Bonifico bancario:** 1-3 giorni lavorativi',
            ],
          },
        ],
      },
      {
        h: 'Prodotto difettoso o non conforme',
        blocks: [
          {
            t: 'p',
            text: 'Se il prodotto presenta un difetto o non è conforme alla descrizione, KitchenPrime si fa carico **integralmente delle spese di reso** e ti propone:',
          },
          {
            t: 'ul',
            items: [
              'La sostituzione con un apparecchio equivalente',
              'Il rimborso integrale',
              'Una riparazione, secondo la natura del difetto',
            ],
          },
          {
            t: 'p',
            text: 'La garanzia legale di conformità copre i prodotti usati per **1 anno** e i prodotti nuovi per **2 anni** dalla data di acquisto.',
          },
        ],
      },
      {
        h: 'Contatti',
        blocks: [
          { t: 'p', text: 'Per qualsiasi domanda sul tuo reso:' },
          {
            t: 'ul',
            items: [
              `**E-mail:** [${MAIL}](mailto:${MAIL})`,
              `**WhatsApp:** ${PHONE} (risposta entro 2 ore nei giorni lavorativi)`,
              `**Indirizzo:** ${ADDRESS}`,
            ],
          },
        ],
      },
    ],
  },

  contact: {
    eyebrow: 'Assistenza clienti',
    title: 'Contattaci',
    subtitle: 'Risposta garantita entro 24 ore nei giorni lavorativi',
    back: 'Torna alla home',
    cards: {
      whatsapp: { title: 'WhatsApp', note: 'Risposta entro 2 ore · lun–sab 9-19' },
      email: { title: 'E-mail', note: 'Risposta entro 24 ore nei giorni lavorativi' },
      address: {
        title: 'Indirizzo',
        value: '539 route de Saint-Joseph',
        note: 'CS 20811 — 44308 Nantes Cedex 3, Francia',
      },
    },
    hours: {
      title: 'Orari di apertura',
      rows: [
        ['Lunedì – Venerdì', '9:00 – 18:30'],
        ['Sabato', '9:00 – 13:00'],
      ],
      closedLabel: 'Domenica e festivi',
      closedValue: 'Chiuso',
    },
    sections: [
      {
        h: 'Per richieste di reso o assistenza',
        blocks: [
          {
            t: 'p',
            text: 'Ti preghiamo di indicare nel messaggio il tuo **numero d’ordine** e la natura della richiesta. Consulta anche la nostra [politica di reso](/it/politique-retour) per le modalità complete.',
          },
        ],
      },
      {
        h: 'Informazioni societarie',
        blocks: [
          {
            t: 'ul',
            items: [
              '**Ragione sociale:** KitchenPrime',
              `**SIRET:** ${SIRET}`,
              `**Indirizzo:** ${ADDRESS}`,
            ],
          },
        ],
      },
    ],
  },
};
