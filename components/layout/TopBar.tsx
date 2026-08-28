'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { Icon } from '@/components/ui/Icon';

const LANG_NAME: Record<Locale, string> = {
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  en: 'English',
};

export function TopBar({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations('topbar');
  const pathname = usePathname();

  /** Même chemin, autre préfixe de locale. */
  function pathFor(loc: Locale) {
    const segments = pathname.split('/');
    segments[1] = loc;
    return segments.join('/') || `/${loc}`;
  }

  return (
    <div className="topbar">
      <div className="topbar-left">
        <Icon name="truck-fast" /> {t('trust')}
      </div>
      {/*
        Des liens, et non des boutons pilotés par `router.push` : l'adresse est
        présente dans le HTML servi, donc le changement de langue fonctionne
        avant même l'hydratation — un clic trop précoce ne se perdait plus dans
        le vide. Les moteurs y voient aussi des liens réels entre les versions
        linguistiques, ce qui renforce les hreflang, et l'ouverture dans un
        nouvel onglet redevient possible.
      */}
      <nav className="topbar-locs" aria-label={t('language')}>
        {locales.map((l) => (
          <Link
            key={l}
            href={pathFor(l)}
            className={`tloc${l === currentLocale ? ' on' : ''}`}
            hrefLang={l}
            lang={l}
            aria-label={LANG_NAME[l]}
            aria-current={l === currentLocale ? 'true' : undefined}
          >
            {l.toUpperCase()}
          </Link>
        ))}
      </nav>
    </div>
  );
}
