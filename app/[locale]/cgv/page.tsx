import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n';

export const metadata = { title: 'Conditions Générales de Vente | KitchenPrime' };

export default function CGVPage({ params: { locale } }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(locale);
  return (
    <div className="legal-page">
      <div className="legal-header">
        <div className="legal-eyebrow"><i className="fa-solid fa-file-contract" /> Contrat de vente</div>
        <h1 className="legal-title">Conditions Générales de Vente</h1>
        <p className="legal-subtitle">Dernière mise à jour : juin 2026</p>
      </div>
      <div className="legal-body">

        <section className="legal-section">
          <h2>Article 1 — Objet et champ d'application</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des ventes conclues entre
            <strong> KitchenPrime</strong> (539 route de Saint-Joseph CS 20811 — 44308 Nantes Cedex 3, France,
            SIRET 622 028 777 02677) et tout acheteur consommateur ou professionnel, via le site
            kitchenprime.vercel.app ou tout autre support de commande.
          </p>
          <p>
            KitchenPrime commercialise des robots culinaires <strong>Thermomix® TM7 d'occasion reconditionnés</strong>,
            ainsi que des accessoires et livres associés. KitchenPrime n'est pas un revendeur officiel Vorwerk.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 2 — Prix</h2>
          <p>
            Les prix affichés sont indiqués en euros (€) <strong>toutes taxes comprises (TTC)</strong>, TVA
            française applicable. KitchenPrime se réserve le droit de modifier ses prix à tout moment ; les
            produits sont facturés au prix en vigueur au moment de la validation de la commande.
          </p>
          <p>Les frais de livraison sont offerts sur toute commande destinée à la France métropolitaine.</p>
        </section>

        <section className="legal-section">
          <h2>Article 3 — Commandes</h2>
          <p>
            La commande est validée à la réception du paiement intégral. KitchenPrime accuse réception par
            e-mail dans un délai de 24 h. Toute commande vaut acceptation des présentes CGV.
          </p>
          <p>
            KitchenPrime se réserve le droit d'annuler ou de refuser toute commande avec motif légitime
            (rupture de stock, anomalie de prix, suspicion de fraude), avec remboursement intégral dans les 14 jours.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 4 — Paiement</h2>
          <p>Les modes de paiement acceptés sont :</p>
          <ul>
            <li>Carte bancaire (Visa, Mastercard, via Mollie)</li>
            <li>Virement bancaire international (Wise)</li>
            <li>Apple Pay</li>
          </ul>
          <p>Le paiement est sécurisé par chiffrement SSL/TLS. KitchenPrime ne conserve aucune donnée bancaire.</p>
        </section>

        <section className="legal-section">
          <h2>Article 5 — Livraison</h2>
          <p>
            Les commandes sont expédiées en France et dans l'Union européenne. Les délais estimatifs sont de
            <strong> 3 à 7 jours ouvrés</strong> après confirmation du paiement. En cas de retard supérieur à
            30 jours, le client peut annuler la commande et sera intégralement remboursé.
          </p>
          <p>
            KitchenPrime ne peut être tenu responsable de retards imputables au transporteur ou à des événements
            de force majeure.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 6 — Droit de rétractation</h2>
          <p>
            Conformément aux articles L221-18 et suivants du Code de la consommation, le consommateur dispose
            d'un <strong>délai de 14 jours calendaires</strong> à compter de la réception du produit pour
            exercer son droit de rétractation, sans motif à fournir.
          </p>
          <p>Pour exercer ce droit, contactez-nous par e-mail à <a href="mailto:kitchenprime@outlook.com">kitchenprime@outlook.com</a> ou
          via WhatsApp avant l'expiration du délai. Le remboursement intégral (prix du produit) intervient dans
          les <strong>14 jours</strong> suivant la réception du retour, par le même moyen de paiement.</p>
          <p>Les frais de retour sont à la charge du client, sauf si le produit est défectueux ou non conforme.</p>
        </section>

        <section className="legal-section">
          <h2>Article 7 — Garanties légales</h2>
          <p>Les produits reconditionnés bénéficient de :</p>
          <ul>
            <li>
              <strong>Garantie légale de conformité</strong> (art. L217-4 C. conso) : 1 an pour les produits
              d'occasion, défaut existant au moment de la délivrance.
            </li>
            <li>
              <strong>Garantie légale des vices cachés</strong> (art. 1641 C. civ.) : 2 ans à compter de la
              découverte du vice.
            </li>
          </ul>
          <p>
            En cas de produit non conforme, KitchenPrime prend en charge les frais de retour et procède à la
            réparation, au remplacement ou au remboursement intégral, au choix du client.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 8 — Protection des données</h2>
          <p>
            Les données personnelles collectées (nom, adresse, e-mail, téléphone) sont utilisées exclusivement
            pour l'exécution des commandes. Conformément au RGPD, vous pouvez exercer vos droits à
            <a href="mailto:kitchenprime@outlook.com"> kitchenprime@outlook.com</a>.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 9 — Médiation de la consommation</h2>
          <p>
            En cas de litige non résolu à l'amiable, le consommateur peut recourir gratuitement à un médiateur
            de la consommation agréé. La Commission européenne met également à disposition une plateforme de
            règlement en ligne des litiges (RLL) : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 10 — Loi applicable et juridiction</h2>
          <p>
            Les présentes CGV sont soumises au droit français. Tout litige relève de la compétence des
            juridictions du ressort du Tribunal de Commerce de Nantes, sauf disposition légale contraire
            applicable aux consommateurs.
          </p>
        </section>

        <div className="legal-back">
          <Link href={`/${locale}`} className="btn-buy">
            <i className="fa-solid fa-arrow-left" /> Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
