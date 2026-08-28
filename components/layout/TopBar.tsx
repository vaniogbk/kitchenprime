'use client';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(loc: Locale) {
    if (loc === currentLocale) return;
    const segments = pathname.split('/');
    segments[1] = loc;
    router.push(segments.join('/') || `/${loc}`);
  }

  return (
    <div className="topbar">
      <div className="topbar-left">
        <Icon name="truck-fast" /> {t('trust')}
      </div>
      {/* De vrais <button> : le précédent <span role="button"> n'était pas
          activable au clavier, ce qui rendait le site monolingue au lecteur
          d'écran. */}
      <div className="topbar-locs" role="group" aria-label={t('language')}>
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            className={`tloc${l === currentLocale ? ' on' : ''}`}
            onClick={() => switchTo(l)}
            lang={l}
            aria-label={LANG_NAME[l]}
            aria-current={l === currentLocale ? 'true' : undefined}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
