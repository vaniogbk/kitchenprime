import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n';

export const metadata = { title: 'Politique de retour | KitchenPrime' };

export default function PolitiqueRetourPage({ params: { locale } }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(locale);
  return (
    <div className="legal-page">
      <div className="legal-header">
        <div className="legal-eyebrow"><i className="fa-solid fa-rotate-left" /> Retours & remboursements</div>
        <h1 className="legal-title">Politique de retour</h1>
        <p className="legal-subtitle">Votre satisfaction est notre priorité</p>
      </div>
      <div className="legal-body">

        <div className="legal-highlight">
          <i className="fa-solid fa-shield-halved" />
          <div>
            <strong>14 jours pour changer d'avis</strong><br />
            Retournez votre produit sans justification dans les 14 jours suivant la réception.
          </div>
        </div>

        <section className="legal-section">
          <h2>Comment initier un retour ?</h2>
          <ol>
            <li>Contactez-nous par e-mail à <a href="mailto:kitchenprime@outlook.com">kitchenprime@outlook.com</a>
              {' '}ou via WhatsApp au <strong>+33 7 56 97 65 02</strong></li>
            <li>Indiquez votre numéro de commande et la raison du retour</li>
            <li>Nous vous envoyons les instructions d'emballage et l'adresse de retour sous 24 h</li>
            <li>Expédiez le produit soigneusement emballé dans son état d'origine</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>Conditions de retour</h2>
          <ul>
            <li>Le produit doit être retourné <strong>dans son état d'origine</strong>, complet (accessoires, manuels inclus)</li>
            <li>Délai de retour : <strong>14 jours calendaires</strong> à compter de la date de réception</li>
            <li>Les frais de retour sont à la charge du client, sauf produit défectueux ou non conforme</li>
            <li>Les produits endommagés par le client ne peuvent être remboursés</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Remboursement</h2>
          <p>
            Dès réception et contrôle du retour, le remboursement est effectué dans un délai de <strong>14 jours
            maximum</strong>, par le même moyen de paiement utilisé lors de l'achat.
          </p>
          <ul>
            <li><strong>Carte bancaire :</strong> 3 à 5 jours ouvrés après validation</li>
            <li><strong>Virement Wise :</strong> 1 à 3 jours ouvrés</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Produit défectueux ou non conforme</h2>
          <p>
            Si votre Thermomix TM7 reconditionné présente un défaut ou n'est pas conforme à la description,
            KitchenPrime prend en charge <strong>intégralement les frais de retour</strong> et vous propose :
          </p>
          <ul>
            <li>Un remplacement par un appareil équivalent</li>
            <li>Un remboursement intégral</li>
            <li>Une réparation (selon la nature du défaut)</li>
          </ul>
          <p>La garantie légale de conformité couvre les produits d'occasion pendant <strong>1 an</strong> à
          compter de la date d'achat.</p>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <p>Pour toute question concernant votre retour :</p>
          <ul>
            <li><strong>E-mail :</strong> <a href="mailto:kitchenprime@outlook.com">kitchenprime@outlook.com</a></li>
            <li><strong>WhatsApp :</strong> +33 7 56 97 65 02 (réponse sous 2 h en jours ouvrés)</li>
            <li><strong>Adresse :</strong> 539 route de Saint-Joseph CS 20811 — 44308 Nantes Cedex 3</li>
          </ul>
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
