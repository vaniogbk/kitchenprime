import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { RemoteImage } from '@/components/ui/RemoteImage';

/** Les avis restent dans leur langue d'origine — c'est ce qui les rend crédibles. */
const REVIEWS = [
  {
    key: 'r1',
    lang: 'fr',
    text: 'Le TM7 a transformé ma cuisine. Livraison 48 h, emballage impeccable. Service au top.',
    name: 'Marie Laurent',
    location: 'Paris, FR',
    avatar: 'photo-1580489944761-15a19d654956',
  },
  {
    key: 'r2',
    lang: 'de',
    text: 'Perfekte Qualität, blitzschnelle Lieferung. KitchenPrime ist mein bevorzugter Shop.',
    name: 'Hans Müller',
    location: 'München, DE',
    avatar: 'photo-1472099645785-5658abf4ff4e',
  },
  {
    key: 'r3',
    lang: 'it',
    text: 'Prodotto fantastico! Consegna rapidissima. Il servizio clienti è eccezionale.',
    name: 'Sofia Bianchi',
    location: 'Milano, IT',
    avatar: 'photo-1438761681033-6461ffad8d80',
  },
] as const;

export function Testimonials() {
  const t = useTranslations('home');
  const tCard = useTranslations('card');

  return (
    <section className="testi" aria-labelledby="reviews-title">
      <p className="sec-eyebrow">
        <Icon name="comments" /> {t('reviewsEyebrow')}
      </p>
      <h2 className="sec-title" id="reviews-title">{t('reviewsTitle')}</h2>
      <div className="testi-grid">
        {REVIEWS.map((r) => (
          <figure className="tc" key={r.key}>
            {/* `role="img"` : sans rôle explicite, aria-label est interdit sur un <p>. */}
            <p className="tc-stars" role="img" aria-label={tCard('fiveOutOfFive')}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon name="star" key={i} />
              ))}
            </p>
            <blockquote className="tc-text" lang={r.lang}>“{r.text}”</blockquote>
            <figcaption className="tc-author">
              <div className="tc-av">
                <RemoteImage imageId={r.avatar} alt="" sizes="36px" quality={60} />
              </div>
              <div>
                <div className="tc-name">{r.name}</div>
                <div className="tc-meta">
                  <Icon name="location-dot" /> {r.location}
                </div>
                <div className="tc-verif">
                  <Icon name="circle-check" /> {t('verified')}
                </div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
