import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n';

export const metadata = { title: 'Mentions légales | KitchenPrime' };

export default function MentionsLegalesPage({ params: { locale } }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(locale);
  return (
    <div className="legal-page">
      <div className="legal-header">
        <div className="legal-eyebrow"><i className="fa-solid fa-scale-balanced" /> Informations légales</div>
        <h1 className="legal-title">Mentions légales</h1>
      </div>
      <div className="legal-body">

        <section className="legal-section">
          <h2>1. Éditeur du site</h2>
          <p>Le présent site est édité par :</p>
          <ul>
            <li><strong>Raison sociale :</strong> KitchenPrime</li>
            <li><strong>Forme juridique :</strong> Entreprise individuelle / Société commerciale</li>
            <li><strong>Adresse :</strong> 539 route de Saint-Joseph CS 20811 — 44308 Nantes Cedex 3, France</li>
            <li><strong>SIRET :</strong> 622 028 777 02677</li>
            <li><strong>E-mail :</strong> <a href="mailto:kitchenprime@outlook.com">kitchenprime@outlook.com</a></li>
            <li><strong>Directeur de la publication :</strong> KitchenPrime</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>2. Hébergeur</h2>
          <ul>
            <li><strong>Société :</strong> Vercel Inc.</li>
            <li><strong>Adresse :</strong> 340 Pine Street, Suite 701 — San Francisco, CA 94104, États-Unis</li>
            <li><strong>Site web :</strong> vercel.com</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, sons, logiciels…) est la
            propriété exclusive de KitchenPrime, à l'exception des contenus provenant de partenaires ou licenciés.
            Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est interdite.
          </p>
          <p>
            Les marques <strong>Thermomix®</strong> et <strong>Vorwerk®</strong> sont des marques déposées de
            Vorwerk & Co. KG. KitchenPrime n'est pas un revendeur agréé Vorwerk et agit de manière indépendante
            dans le cadre de la revente de produits d'occasion.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Données personnelles</h2>
          <p>
            Les informations collectées lors de vos commandes sont traitées conformément au Règlement Général sur
            la Protection des Données (RGPD — UE 2016/679). Elles sont utilisées exclusivement pour le traitement
            des commandes et ne sont pas cédées à des tiers.
          </p>
          <p>
            Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour l'exercer,
            contactez-nous à <a href="mailto:kitchenprime@outlook.com">kitchenprime@outlook.com</a>.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Cookies</h2>
          <p>
            Ce site utilise des cookies techniques strictement nécessaires à son fonctionnement (session, panier,
            préférences de langue). Aucun cookie publicitaire tiers n'est déposé sans votre consentement.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Loi applicable</h2>
          <p>
            Les présentes mentions légales sont soumises au droit français. Tout litige relève de la compétence
            exclusive des juridictions françaises.
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
