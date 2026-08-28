import type { LegalContent } from './types';

const MAIL = 'kitchenprime@outlook.com';
const ADDRESS = '539 route de Saint-Joseph CS 20811 — 44308 Nantes Cedex 3, France';
const SIRET = '622 028 777 02677';
const PHONE = '+33 7 56 97 65 02';

export const en: LegalContent = {
  cgv: {
    eyebrow: 'Sales contract',
    title: 'Terms and conditions of sale',
    subtitle: 'Last updated: August 2026',
    back: 'Back to home',
    sections: [
      {
        h: 'Article 1 — Purpose and scope',
        blocks: [
          {
            t: 'p',
            text: `These Terms and Conditions of Sale govern every sale concluded between **KitchenPrime** (${ADDRESS}, SIRET ${SIRET}) and any buyer, consumer or business, through kitchenprime.com or any other ordering channel.`,
          },
          {
            t: 'p',
            text: 'KitchenPrime sells **refurbished second-hand Thermomix® TM7 food processors**, related accessories and books, as well as new home appliances and smart home devices. KitchenPrime is not an official Vorwerk reseller.',
          },
        ],
      },
      {
        h: 'Article 2 — Pricing',
        blocks: [
          {
            t: 'p',
            text: 'All prices are shown in euros (€) **including all taxes**, with French VAT applied. KitchenPrime may change its prices at any time; products are invoiced at the price in force when the order is confirmed.',
          },
          { t: 'p', text: 'Shipping is free on every order delivered within continental Europe.' },
        ],
      },
      {
        h: 'Article 3 — Orders',
        blocks: [
          {
            t: 'p',
            text: 'An order is confirmed once payment is received in full. KitchenPrime acknowledges receipt by email within 24 hours. Placing an order constitutes acceptance of these terms.',
          },
          {
            t: 'p',
            text: 'KitchenPrime may cancel or refuse any order on legitimate grounds (out of stock, pricing error, suspected fraud), with a full refund within 14 days.',
          },
        ],
      },
      {
        h: 'Article 4 — Payment',
        blocks: [
          { t: 'p', text: 'Accepted payment methods:' },
          {
            t: 'ul',
            items: [
              'Bank transfer (SEPA and international)',
            ],
          },
          { t: 'p', text: 'The beneficiary’s bank details are shown at checkout and confirmed by email. Your order ships as soon as the transfer arrives. KitchenPrime neither holds nor stores any customer payment data.' },
        ],
      },
      {
        h: 'Article 5 — Delivery',
        blocks: [
          {
            t: 'p',
            text: 'Orders ship to France and across the European Union. Estimated delivery is **3 to 7 working days** after payment confirmation. If delivery is delayed by more than 30 days, you may cancel the order and will be refunded in full.',
          },
          {
            t: 'p',
            text: 'KitchenPrime cannot be held liable for delays attributable to the carrier or to events of force majeure.',
          },
        ],
      },
      {
        h: 'Article 6 — Right of withdrawal',
        blocks: [
          {
            t: 'p',
            text: 'Under articles L221-18 et seq. of the French Consumer Code, consumers have **14 calendar days** from receipt of the product to withdraw, without giving any reason.',
          },
          {
            t: 'p',
            text: `To exercise this right, contact us by email at [${MAIL}](mailto:${MAIL}) or via WhatsApp before the deadline. A full refund is issued within **14 days** of receiving the return, using the original payment method.`,
          },
          { t: 'p', text: 'Return shipping is at the customer’s expense, unless the product is faulty or not as described.' },
        ],
      },
      {
        h: 'Article 7 — Legal warranties',
        blocks: [
          { t: 'p', text: 'Products are covered by:' },
          {
            t: 'ul',
            items: [
              '**Legal warranty of conformity** (art. L217-4 French Consumer Code): 2 years for new products, 1 year for second-hand products, for any defect present at delivery.',
              '**Legal warranty against hidden defects** (art. 1641 French Civil Code): 2 years from discovery of the defect.',
              '**KitchenPrime commercial warranty**: 24 months on parts and labour for refurbished machines.',
            ],
          },
          {
            t: 'p',
            text: 'For a non-conforming product, KitchenPrime covers return shipping and provides repair, replacement or a full refund, at the customer’s choice.',
          },
        ],
      },
      {
        h: 'Article 8 — Data protection',
        blocks: [
          {
            t: 'p',
            text: `Personal data collected (name, address, email, phone) is used solely to fulfil orders. Under the GDPR, you may exercise your rights at [${MAIL}](mailto:${MAIL}).`,
          },
        ],
      },
      {
        h: 'Article 9 — Consumer mediation',
        blocks: [
          {
            t: 'p',
            text: 'If a dispute cannot be settled amicably, consumers may refer the matter free of charge to an approved consumer mediator. The European Commission also provides an online dispute resolution platform: [ec.europa.eu/consumers/odr](https://ec.europa.eu/consumers/odr).',
          },
        ],
      },
      {
        h: 'Article 10 — Governing law and jurisdiction',
        blocks: [
          {
            t: 'p',
            text: 'These terms are governed by French law. Any dispute falls under the jurisdiction of the Nantes Commercial Court, except where mandatory consumer protection rules provide otherwise.',
          },
        ],
      },
    ],
  },

  legal: {
    eyebrow: 'Legal information',
    title: 'Legal notice',
    back: 'Back to home',
    sections: [
      {
        h: '1. Site publisher',
        blocks: [
          { t: 'p', text: 'This site is published by:' },
          {
            t: 'ul',
            items: [
              '**Company name:** KitchenPrime',
              '**Legal form:** commercial company',
              `**Address:** ${ADDRESS}`,
              `**SIRET:** ${SIRET}`,
              `**Email:** [${MAIL}](mailto:${MAIL})`,
              '**Publication director:** KitchenPrime',
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
              '**Company:** Vercel Inc.',
              '**Address:** 340 Pine Street, Suite 701 — San Francisco, CA 94104, United States',
              '**Website:** [vercel.com](https://vercel.com)',
            ],
          },
        ],
      },
      {
        h: '3. Intellectual property',
        blocks: [
          {
            t: 'p',
            text: 'All content on this site (text, images, graphics, logo, icons, software) is the exclusive property of KitchenPrime, except for content sourced from partners or licensors. Any reproduction, distribution or use without prior written consent is prohibited.',
          },
          {
            t: 'p',
            text: 'The **Thermomix®** and **Vorwerk®** trademarks are registered trademarks of Vorwerk & Co. KG. The **Samsung®**, **Google Nest®**, **Dyson®** and **Ninja®** trademarks belong to their respective owners. KitchenPrime is not authorised by any of these brands and operates independently.',
          },
        ],
      },
      {
        h: '4. Personal data',
        blocks: [
          {
            t: 'p',
            text: 'Information collected when you order is processed in accordance with the General Data Protection Regulation (GDPR — EU 2016/679). It is used solely to process orders and is not passed to third parties.',
          },
          {
            t: 'p',
            text: `You have the right to access, correct and delete your data. To exercise it, contact us at [${MAIL}](mailto:${MAIL}).`,
          },
        ],
      },
      {
        h: '5. Cookies',
        blocks: [
          {
            t: 'p',
            text: 'This site uses only technical cookies strictly necessary for it to work (session, cart, language preference). No third-party advertising cookies are set.',
          },
        ],
      },
      {
        h: '6. Governing law',
        blocks: [
          {
            t: 'p',
            text: 'This legal notice is governed by French law. Any dispute falls under the exclusive jurisdiction of the French courts.',
          },
        ],
      },
    ],
  },

  returns: {
    eyebrow: 'Returns & refunds',
    title: 'Return policy',
    subtitle: 'Your satisfaction comes first',
    back: 'Back to home',
    highlight: {
      strong: '14 days to change your mind',
      text: 'Send your product back without giving a reason within 14 days of receipt.',
    },
    sections: [
      {
        h: 'How do I start a return?',
        blocks: [
          {
            t: 'ol',
            items: [
              `Contact us by email at [${MAIL}](mailto:${MAIL}) or via WhatsApp on **${PHONE}**`,
              'Give your order number and the reason for the return',
              'We send you packing instructions and the return address within 24 hours',
              'Ship the product carefully packed, in its original condition',
            ],
          },
        ],
      },
      {
        h: 'Return conditions',
        blocks: [
          {
            t: 'ul',
            items: [
              'The product must be returned **in its original condition**, complete (accessories and manuals included)',
              'Return window: **14 calendar days** from the date of receipt',
              'Return shipping is at the customer’s expense, unless the product is faulty or not as described',
              'Products damaged by the customer cannot be refunded',
            ],
          },
        ],
      },
      {
        h: 'Refunds',
        blocks: [
          {
            t: 'p',
            text: 'Once the return is received and checked, the refund is issued within **14 days at most**, using the same payment method as the purchase.',
          },
          {
            t: 'ul',
            items: [
              '**Payment card:** 3 to 5 working days after approval',
              '**Bank transfer:** 1 to 3 working days',
            ],
          },
        ],
      },
      {
        h: 'Faulty or non-conforming product',
        blocks: [
          {
            t: 'p',
            text: 'If your product is faulty or does not match its description, KitchenPrime covers **return shipping in full** and offers you:',
          },
          {
            t: 'ul',
            items: [
              'A replacement with an equivalent unit',
              'A full refund',
              'A repair, depending on the nature of the fault',
            ],
          },
          {
            t: 'p',
            text: 'The legal warranty of conformity covers second-hand products for **1 year** and new products for **2 years** from the date of purchase.',
          },
        ],
      },
      {
        h: 'Contact',
        blocks: [
          { t: 'p', text: 'For any question about your return:' },
          {
            t: 'ul',
            items: [
              `**Email:** [${MAIL}](mailto:${MAIL})`,
              `**WhatsApp:** ${PHONE} (reply within 2 hours on working days)`,
              `**Address:** ${ADDRESS}`,
            ],
          },
        ],
      },
    ],
  },

  contact: {
    eyebrow: 'Customer support',
    title: 'Contact us',
    subtitle: 'Guaranteed reply within 24 hours on working days',
    back: 'Back to home',
    cards: {
      whatsapp: { title: 'WhatsApp', note: 'Reply within 2 h · Mon–Sat 9am–7pm' },
      email: { title: 'Email', note: 'Reply within 24 h on working days' },
      address: {
        title: 'Address',
        value: '539 route de Saint-Joseph',
        note: 'CS 20811 — 44308 Nantes Cedex 3, France',
      },
    },
    hours: {
      title: 'Opening hours',
      rows: [
        ['Monday – Friday', '9:00am – 6:30pm'],
        ['Saturday', '9:00am – 1:00pm'],
      ],
      closedLabel: 'Sunday & public holidays',
      closedValue: 'Closed',
    },
    sections: [
      {
        h: 'Returns and after-sales requests',
        blocks: [
          {
            t: 'p',
            text: 'Please include your **order number** and the nature of your request in your message. See our [return policy](/en/politique-retour) for the full terms.',
          },
        ],
      },
      {
        h: 'Company information',
        blocks: [
          {
            t: 'ul',
            items: [
              '**Company name:** KitchenPrime',
              `**SIRET:** ${SIRET}`,
              `**Address:** ${ADDRESS}`,
            ],
          },
        ],
      },
    ],
  },
};
