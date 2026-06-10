'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { waOrderUrl } from '@/lib/whatsapp';
import { type Locale } from '@/lib/i18n';

const HERO_IMAGES = [
  'photo-1556909114-f6e7ad7d3136',
  'photo-1585515320310-259814833e62',
  'photo-1591189863430-ab87e120f312',
  'photo-1565299624946-b28f40a0ae38',
];

export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations('hero');
  const tWa = useTranslations('wa');
  const [active, setActive] = useState(0);

  return (
    <div className="hero">
      <div>
        <div className="hero-eyebrow">
          <i className="fa-solid fa-crown" /> {t('eyebrow')}
        </div>
        <h1 className="hero-h1">
          {t('titlePre')}<br />
          {t('titleHighlightPre')}<span>{t('titleHighlight')}</span>
        </h1>
        <p className="hero-p">{t('desc')}</p>
        <div className="hero-btns">
          <Link href={`/${locale}/produit/thermomix-tm7`} className="btn-buy">
            <i className="fa-solid fa-bag-shopping" /> {t('cta1')}
          </Link>
          <a
            href={waOrderUrl('Thermomix TM7', tWa('msg'))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa"
          >
            <i className="fa-brands fa-whatsapp" style={{ fontSize: 15 }} /> {t('cta2')}
          </a>
        </div>
        <div className="hero-trust">
          <div className="htrust"><i className="fa-solid fa-shield-halved" /> {t('trust1')}</div>
          <div className="htrust"><i className="fa-solid fa-truck-fast" /> {t('trust2')}</div>
          <div className="htrust"><i className="fa-solid fa-rotate-left" /> {t('trust3')}</div>
        </div>
      </div>
      <div className="hero-gallery">
        <div className="hero-main">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://images.unsplash.com/${HERO_IMAGES[active]}?w=700&q=80`}
            alt="Thermomix TM7"
          />
          <div className="hero-badge">{t('badge')}</div>
        </div>
        <div className="hero-thumbs">
          {HERO_IMAGES.map((id, i) => (
            <button
              key={id}
              type="button"
              className={`hthumb${i === active ? ' on' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`View ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://images.unsplash.com/${id}?w=150&q=70`} alt="" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
