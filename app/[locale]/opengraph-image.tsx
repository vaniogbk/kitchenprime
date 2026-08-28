import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n';

/**
 * Image Open Graph par défaut, générée à la construction pour chaque locale.
 *
 * Elle évite le partage « sans vignette » sur les réseaux et la messagerie,
 * qui divise le taux de clic. Aucune police ni image distante n'est chargée :
 * la génération reste hors ligne et déterministe.
 */
// `next/og` s'appuie sur des binaires WASM chargés par URL de fichier :
// en runtime Node sous Windows, la conversion chemin → URL échoue. Le runtime
// edge, celui recommandé par Next pour ImageResponse, n'a pas ce problème.
export const runtime = 'edge';

export const alt = 'KitchenPrime';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #1A1F5E 0%, #2E3E9E 55%, #3D4DB8 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              background: '#B8622A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 900,
            }}
          >
            K
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.5 }}>
            Kitchen<span style={{ color: '#FFD88A' }}>Prime</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.08, letterSpacing: -1.5 }}>
            {t('homeTitle')}
          </div>
          <div style={{ fontSize: 27, color: '#C3C9EE', lineHeight: 1.45, maxWidth: 940 }}>
            {t('homeDesc')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {['FR', 'DE', 'IT', 'EN'].map((l) => (
            <div
              key={l}
              style={{
                display: 'flex',
                padding: '9px 20px',
                borderRadius: 9,
                background: 'rgba(255,255,255,.12)',
                fontSize: 21,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
