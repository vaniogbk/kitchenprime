'use client';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';

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
        <i className="fa-solid fa-truck-fast" /> {t('trust')}
      </div>
      <div className="topbar-locs">
        {locales.map((l) => (
          <span
            key={l}
            className={`tloc${l === currentLocale ? ' on' : ''}`}
            onClick={() => switchTo(l)}
            role="button"
            tabIndex={0}
          >
            {l.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
