import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n';

export const metadata = { title: 'Contact | KitchenPrime' };

export default function ContactPage({ params: { locale } }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(locale);
  return (
    <div className="legal-page">
      <div className="legal-header">
        <div className="legal-eyebrow"><i className="fa-solid fa-headset" /> Assistance client</div>
        <h1 className="legal-title">Nous contacter</h1>
        <p className="legal-subtitle">Réponse garantie sous 24 h en jours ouvrés</p>
      </div>
      <div className="legal-body">

        <div className="contact-cards">
          <a href="https://wa.me/33756976502" target="_blank" rel="noopener noreferrer" className="contact-card contact-card--wa">
            <div className="contact-card-icon"><i className="fa-brands fa-whatsapp" /></div>
            <div className="contact-card-title">WhatsApp</div>
            <div className="contact-card-val">+33 7 56 97 65 02</div>
            <div className="contact-card-note">Réponse sous 2 h · lun–sam 9h–19h</div>
          </a>
          <a href="mailto:kitchenprime@outlook.com" className="contact-card contact-card--mail">
            <div className="contact-card-icon"><i className="fa-solid fa-envelope" /></div>
            <div className="contact-card-title">E-mail</div>
            <div className="contact-card-val">kitchenprime@outlook.com</div>
            <div className="contact-card-note">Réponse sous 24 h en jours ouvrés</div>
          </a>
          <div className="contact-card contact-card--addr">
            <div className="contact-card-icon"><i className="fa-solid fa-location-dot" /></div>
            <div className="contact-card-title">Adresse</div>
            <div className="contact-card-val">539 route de Saint-Joseph</div>
            <div className="contact-card-note">CS 20811 — 44308 Nantes Cedex 3, France</div>
          </div>
        </div>

        <section className="legal-section">
          <h2>Horaires d'ouverture</h2>
          <div className="contact-hours">
            <div className="ch-row"><span>Lundi – Vendredi</span><span>9 h 00 – 18 h 30</span></div>
            <div className="ch-row"><span>Samedi</span><span>9 h 00 – 13 h 00</span></div>
            <div className="ch-row ch-closed"><span>Dimanche & jours fériés</span><span>Fermé</span></div>
          </div>
        </section>

        <section className="legal-section">
          <h2>Pour vos demandes de retour ou SAV</h2>
          <p>
            Merci de préciser dans votre message votre <strong>numéro de commande</strong> ainsi que la nature
            de votre demande. Consultez également notre{' '}
            <Link href={`/${locale}/politique-retour`}>politique de retour</Link> pour les modalités complètes.
          </p>
        </section>

        <section className="legal-section">
          <h2>Informations société</h2>
          <ul>
            <li><strong>Raison sociale :</strong> KitchenPrime</li>
            <li><strong>SIRET :</strong> 622 028 777 02677</li>
            <li><strong>Adresse :</strong> 539 route de Saint-Joseph CS 20811 — 44308 Nantes Cedex 3, France</li>
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
