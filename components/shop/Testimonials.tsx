import { useTranslations } from 'next-intl';

const REVIEWS = [
  {
    text: '"Le TM7 a transformé ma cuisine. Livraison 48h, emballage impeccable. Service au top."',
    name: 'Marie Laurent',
    location: 'Paris, FR',
    avatar: 'photo-1494790108755-2616b612b789',
  },
  {
    text: '"Perfekte Qualität, blitzschnelle Lieferung. KitchenPrime ist mein bevorzugter Shop."',
    name: 'Hans Müller',
    location: 'München, DE',
    avatar: 'photo-1472099645785-5658abf4ff4e',
  },
  {
    text: '"Prodotto fantastico! Consegna rapidissima. Il servizio clienti è eccezionale."',
    name: 'Sofia Bianchi',
    location: 'Milano, IT',
    avatar: 'photo-1438761681033-6461ffad8d80',
  },
];

export function Testimonials() {
  const t = useTranslations('home');
  return (
    <div className="testi">
      <div className="sec-eyebrow">
        <i className="fa-solid fa-comments" /> {t('reviewsEyebrow')}
      </div>
      <div className="sec-title">{t('reviewsTitle')}</div>
      <div className="testi-grid">
        {REVIEWS.map((r) => (
          <div className="tc" key={r.name}>
            <div className="tc-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <i key={i} className="fa-solid fa-star" />
              ))}
            </div>
            <div className="tc-text">{r.text}</div>
            <div className="tc-author">
              <div className="tc-av">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://images.unsplash.com/${r.avatar}?w=80&q=80`} alt="" />
              </div>
              <div>
                <div className="tc-name">{r.name}</div>
                <div className="tc-meta">
                  <i className="fa-solid fa-location-dot" /> {r.location}
                </div>
                <div className="tc-verif">
                  <i className="fa-solid fa-circle-check" /> {t('verified')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
