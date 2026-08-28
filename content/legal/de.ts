import type { LegalContent } from './types';

const MAIL = 'kitchenprime@outlook.com';
const ADDRESS = '539 route de Saint-Joseph CS 20811 — 44308 Nantes Cedex 3, Frankreich';
const SIRET = '622 028 777 02677';
const PHONE = '+33 7 56 97 65 02';

export const de: LegalContent = {
  cgv: {
    eyebrow: 'Kaufvertrag',
    title: 'Allgemeine Geschäftsbedingungen',
    subtitle: 'Letzte Aktualisierung: August 2026',
    back: 'Zurück zur Startseite',
    sections: [
      {
        h: 'Artikel 1 — Gegenstand und Geltungsbereich',
        blocks: [
          {
            t: 'p',
            text: `Diese Allgemeinen Geschäftsbedingungen (AGB) regeln sämtliche Kaufverträge zwischen **KitchenPrime** (${ADDRESS}, SIRET ${SIRET}) und jedem Käufer — Verbraucher wie Unternehmer — über die Website kitchenprime.com oder einen anderen Bestellweg.`,
          },
          {
            t: 'p',
            text: 'KitchenPrime vertreibt **generalüberholte gebrauchte Küchenmaschinen Thermomix® TM7**, zugehöriges Zubehör und Bücher sowie neue Haushaltsgeräte und Smart-Home-Produkte. KitchenPrime ist kein offizieller Vorwerk-Händler.',
          },
        ],
      },
      {
        h: 'Artikel 2 — Preise',
        blocks: [
          {
            t: 'p',
            text: 'Alle Preise verstehen sich in Euro (€) **inklusive Mehrwertsteuer**, es gilt die französische Umsatzsteuer. KitchenPrime behält sich Preisänderungen jederzeit vor; maßgeblich ist der zum Zeitpunkt der Bestellbestätigung gültige Preis.',
          },
          { t: 'p', text: 'Der Versand ist bei jeder Bestellung innerhalb des europäischen Festlands kostenfrei.' },
        ],
      },
      {
        h: 'Artikel 3 — Bestellungen',
        blocks: [
          {
            t: 'p',
            text: 'Die Bestellung gilt mit vollständigem Zahlungseingang als angenommen. KitchenPrime bestätigt den Eingang innerhalb von 24 Stunden per E-Mail. Mit jeder Bestellung werden diese AGB anerkannt.',
          },
          {
            t: 'p',
            text: 'KitchenPrime behält sich vor, Bestellungen aus berechtigtem Grund abzulehnen oder zu stornieren (Lieferengpass, Preisfehler, Betrugsverdacht); die vollständige Erstattung erfolgt binnen 14 Tagen.',
          },
        ],
      },
      {
        h: 'Artikel 4 — Zahlung',
        blocks: [
          { t: 'p', text: 'Akzeptierte Zahlungsarten:' },
          {
            t: 'ul',
            items: [
              'Kreditkarte (Visa, Mastercard)',
              'Banküberweisung (SEPA und international)',
              'Apple Pay',
            ],
          },
          { t: 'p', text: 'Die Zahlung ist per SSL/TLS verschlüsselt. KitchenPrime speichert keinerlei Bankdaten.' },
        ],
      },
      {
        h: 'Artikel 5 — Lieferung',
        blocks: [
          {
            t: 'p',
            text: 'Wir versenden nach Frankreich und in die gesamte Europäische Union. Die voraussichtliche Lieferzeit beträgt **3 bis 7 Werktage** nach Zahlungsbestätigung. Bei einer Verzögerung von mehr als 30 Tagen kann der Kunde die Bestellung stornieren und erhält den vollen Betrag zurück.',
          },
          {
            t: 'p',
            text: 'Für Verzögerungen, die dem Transportunternehmen zuzurechnen sind, oder für Fälle höherer Gewalt haftet KitchenPrime nicht.',
          },
        ],
      },
      {
        h: 'Artikel 6 — Widerrufsrecht',
        blocks: [
          {
            t: 'p',
            text: 'Gemäß Artikel L221-18 ff. des französischen Verbrauchergesetzbuchs steht dem Verbraucher ab Erhalt der Ware eine **Frist von 14 Kalendertagen** zu, um ohne Angabe von Gründen zu widerrufen.',
          },
          {
            t: 'p',
            text: `Zur Ausübung dieses Rechts kontaktieren Sie uns vor Fristablauf per E-Mail an [${MAIL}](mailto:${MAIL}) oder über WhatsApp. Die vollständige Erstattung erfolgt innerhalb von **14 Tagen** nach Eingang der Rücksendung über dasselbe Zahlungsmittel.`,
          },
          { t: 'p', text: 'Die Rücksendekosten trägt der Kunde, es sei denn, die Ware ist mangelhaft oder entspricht nicht der Beschreibung.' },
        ],
      },
      {
        h: 'Artikel 7 — Gesetzliche Gewährleistung',
        blocks: [
          { t: 'p', text: 'Für die Produkte gelten:' },
          {
            t: 'ul',
            items: [
              '**Gesetzliche Konformitätsgarantie** (Art. L217-4 franz. Verbrauchergesetzbuch): 2 Jahre für Neuware, 1 Jahr für Gebrauchtware, für jeden bei Übergabe bestehenden Mangel.',
              '**Gesetzliche Haftung für versteckte Mängel** (Art. 1641 franz. ZGB): 2 Jahre ab Entdeckung des Mangels.',
              '**Handelsgarantie von KitchenPrime**: 24 Monate auf Teile und Arbeit für generalüberholte Geräte.',
            ],
          },
          {
            t: 'p',
            text: 'Bei nicht vertragsgemäßer Ware übernimmt KitchenPrime die Rücksendekosten und leistet nach Wahl des Kunden Nachbesserung, Ersatz oder vollständige Erstattung.',
          },
        ],
      },
      {
        h: 'Artikel 8 — Datenschutz',
        blocks: [
          {
            t: 'p',
            text: `Die erhobenen personenbezogenen Daten (Name, Anschrift, E-Mail, Telefon) werden ausschließlich zur Abwicklung der Bestellungen verwendet. Gemäß DSGVO können Sie Ihre Rechte unter [${MAIL}](mailto:${MAIL}) geltend machen.`,
          },
        ],
      },
      {
        h: 'Artikel 9 — Verbraucherschlichtung',
        blocks: [
          {
            t: 'p',
            text: 'Kann eine Streitigkeit nicht gütlich beigelegt werden, steht dem Verbraucher kostenfrei eine anerkannte Verbraucherschlichtungsstelle offen. Die Europäische Kommission stellt zudem eine Plattform zur Online-Streitbeilegung bereit: [ec.europa.eu/consumers/odr](https://ec.europa.eu/consumers/odr).',
          },
        ],
      },
      {
        h: 'Artikel 10 — Anwendbares Recht und Gerichtsstand',
        blocks: [
          {
            t: 'p',
            text: 'Diese AGB unterliegen französischem Recht. Zuständig ist das Handelsgericht Nantes, soweit keine zwingenden verbraucherschützenden Vorschriften etwas anderes bestimmen.',
          },
        ],
      },
    ],
  },

  legal: {
    eyebrow: 'Rechtliche Hinweise',
    title: 'Impressum',
    back: 'Zurück zur Startseite',
    sections: [
      {
        h: '1. Anbieter der Website',
        blocks: [
          { t: 'p', text: 'Diese Website wird betrieben von:' },
          {
            t: 'ul',
            items: [
              '**Firma:** KitchenPrime',
              '**Rechtsform:** Handelsgesellschaft',
              `**Anschrift:** ${ADDRESS}`,
              `**SIRET:** ${SIRET}`,
              `**E-Mail:** [${MAIL}](mailto:${MAIL})`,
              '**Verantwortlich für den Inhalt:** KitchenPrime',
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
              '**Unternehmen:** Vercel Inc.',
              '**Anschrift:** 340 Pine Street, Suite 701 — San Francisco, CA 94104, USA',
              '**Website:** [vercel.com](https://vercel.com)',
            ],
          },
        ],
      },
      {
        h: '3. Geistiges Eigentum',
        blocks: [
          {
            t: 'p',
            text: 'Sämtliche Inhalte dieser Website (Texte, Bilder, Grafiken, Logo, Icons, Software) sind ausschließliches Eigentum von KitchenPrime, mit Ausnahme von Inhalten aus Partner- oder Lizenzquellen. Jede Vervielfältigung, Verbreitung oder Nutzung ohne vorherige schriftliche Zustimmung ist untersagt.',
          },
          {
            t: 'p',
            text: 'Die Marken **Thermomix®** und **Vorwerk®** sind eingetragene Marken der Vorwerk & Co. KG. Die Marken **Samsung®**, **Google Nest®**, **Dyson®** und **Ninja®** gehören den jeweiligen Inhabern. KitchenPrime ist von keiner dieser Marken autorisiert und handelt unabhängig.',
          },
        ],
      },
      {
        h: '4. Personenbezogene Daten',
        blocks: [
          {
            t: 'p',
            text: 'Die bei Ihren Bestellungen erhobenen Daten werden gemäß der Datenschutz-Grundverordnung (DSGVO — EU 2016/679) verarbeitet. Sie dienen ausschließlich der Bestellabwicklung und werden nicht an Dritte weitergegeben.',
          },
          {
            t: 'p',
            text: `Sie haben ein Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten. Wenden Sie sich dazu an [${MAIL}](mailto:${MAIL}).`,
          },
        ],
      },
      {
        h: '5. Cookies',
        blocks: [
          {
            t: 'p',
            text: 'Diese Website verwendet ausschließlich technisch notwendige Cookies (Sitzung, Warenkorb, Sprachwahl). Es werden keine Werbe-Cookies Dritter gesetzt.',
          },
        ],
      },
      {
        h: '6. Anwendbares Recht',
        blocks: [
          {
            t: 'p',
            text: 'Dieses Impressum unterliegt französischem Recht. Für sämtliche Streitigkeiten sind ausschließlich die französischen Gerichte zuständig.',
          },
        ],
      },
    ],
  },

  returns: {
    eyebrow: 'Rückgabe & Erstattung',
    title: 'Rückgaberichtlinie',
    subtitle: 'Ihre Zufriedenheit hat Vorrang',
    back: 'Zurück zur Startseite',
    highlight: {
      strong: '14 Tage Bedenkzeit',
      text: 'Senden Sie Ihr Produkt innerhalb von 14 Tagen nach Erhalt ohne Angabe von Gründen zurück.',
    },
    sections: [
      {
        h: 'Wie leite ich eine Rücksendung ein?',
        blocks: [
          {
            t: 'ol',
            items: [
              `Kontaktieren Sie uns per E-Mail an [${MAIL}](mailto:${MAIL}) oder über WhatsApp unter **${PHONE}**`,
              'Nennen Sie Ihre Bestellnummer und den Grund der Rücksendung',
              'Wir senden Ihnen innerhalb von 24 Stunden die Verpackungshinweise und die Rücksendeadresse',
              'Versenden Sie das Produkt sorgfältig verpackt im Originalzustand',
            ],
          },
        ],
      },
      {
        h: 'Rücksendebedingungen',
        blocks: [
          {
            t: 'ul',
            items: [
              'Das Produkt muss **im Originalzustand** und vollständig zurückgesandt werden (Zubehör und Anleitungen inklusive)',
              'Rücksendefrist: **14 Kalendertage** ab Erhalt',
              'Die Rücksendekosten trägt der Kunde, außer bei mangelhafter oder nicht vertragsgemäßer Ware',
              'Vom Kunden beschädigte Produkte können nicht erstattet werden',
            ],
          },
        ],
      },
      {
        h: 'Erstattung',
        blocks: [
          {
            t: 'p',
            text: 'Nach Eingang und Prüfung der Rücksendung erfolgt die Erstattung innerhalb von **höchstens 14 Tagen** über dasselbe Zahlungsmittel wie beim Kauf.',
          },
          {
            t: 'ul',
            items: [
              '**Kreditkarte:** 3 bis 5 Werktage nach Freigabe',
              '**Banküberweisung:** 1 bis 3 Werktage',
            ],
          },
        ],
      },
      {
        h: 'Mangelhafte oder nicht vertragsgemäße Ware',
        blocks: [
          {
            t: 'p',
            text: 'Weist Ihr Produkt einen Mangel auf oder entspricht es nicht der Beschreibung, übernimmt KitchenPrime die **Rücksendekosten vollständig** und bietet Ihnen an:',
          },
          {
            t: 'ul',
            items: [
              'Ersatz durch ein gleichwertiges Gerät',
              'Vollständige Erstattung',
              'Reparatur, je nach Art des Mangels',
            ],
          },
          {
            t: 'p',
            text: 'Die gesetzliche Konformitätsgarantie gilt für Gebrauchtware **1 Jahr** und für Neuware **2 Jahre** ab Kaufdatum.',
          },
        ],
      },
      {
        h: 'Kontakt',
        blocks: [
          { t: 'p', text: 'Bei Fragen zu Ihrer Rücksendung:' },
          {
            t: 'ul',
            items: [
              `**E-Mail:** [${MAIL}](mailto:${MAIL})`,
              `**WhatsApp:** ${PHONE} (Antwort innerhalb von 2 Stunden an Werktagen)`,
              `**Anschrift:** ${ADDRESS}`,
            ],
          },
        ],
      },
    ],
  },

  contact: {
    eyebrow: 'Kundenservice',
    title: 'Kontakt aufnehmen',
    subtitle: 'Antwort garantiert innerhalb von 24 Stunden an Werktagen',
    back: 'Zurück zur Startseite',
    cards: {
      whatsapp: { title: 'WhatsApp', note: 'Antwort in 2 Std. · Mo–Sa 9–19 Uhr' },
      email: { title: 'E-Mail', note: 'Antwort innerhalb von 24 Std. an Werktagen' },
      address: {
        title: 'Anschrift',
        value: '539 route de Saint-Joseph',
        note: 'CS 20811 — 44308 Nantes Cedex 3, Frankreich',
      },
    },
    hours: {
      title: 'Öffnungszeiten',
      rows: [
        ['Montag – Freitag', '9:00 – 18:30 Uhr'],
        ['Samstag', '9:00 – 13:00 Uhr'],
      ],
      closedLabel: 'Sonn- und Feiertage',
      closedValue: 'Geschlossen',
    },
    sections: [
      {
        h: 'Für Rücksendungen und Kundendienst',
        blocks: [
          {
            t: 'p',
            text: 'Bitte geben Sie in Ihrer Nachricht Ihre **Bestellnummer** und den Grund Ihrer Anfrage an. Die vollständigen Modalitäten finden Sie in unserer [Rückgaberichtlinie](/de/politique-retour).',
          },
        ],
      },
      {
        h: 'Unternehmensangaben',
        blocks: [
          {
            t: 'ul',
            items: [
              '**Firma:** KitchenPrime',
              `**SIRET:** ${SIRET}`,
              `**Anschrift:** ${ADDRESS}`,
            ],
          },
        ],
      },
    ],
  },
};
