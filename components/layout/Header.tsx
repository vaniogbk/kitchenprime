'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type Locale } from '@/lib/i18n';

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const homePath = `/${locale}`;
  const catalogPath = `/${locale}/catalogue`;
  const checkoutPath = `/${locale}/checkout`;

  const isHome = pathname === homePath;
  const isCatalog = pathname.startsWith(catalogPath);

  return (
    <nav className="nav">
      <Link href={homePath} className="logo">
        Kitchen<span>Prime</span>
      </Link>
      <div className="nav-links">
        <Link href={homePath} className={`nlink${isHome ? ' on' : ''}`}>
          <i className="fa-solid fa-house" /> <span>{t('home')}</span>
        </Link>
        <Link href={catalogPath} className={`nlink${isCatalog ? ' on' : ''}`}>
          <i className="fa-solid fa-grid-2" /> <span>{t('catalog')}</span>
        </Link>
      </div>
      <div className="nav-right">
        <form
          className="search"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const q = String(data.get('q') || '').trim();
            if (q) window.location.href = `${catalogPath}?q=${encodeURIComponent(q)}`;
          }}
        >
          <i className="fa-solid fa-magnifying-glass" />
          <input type="text" name="q" placeholder={t('search')} aria-label={t('search')} />
        </form>
        <Link href={checkoutPath} className="cart-btn" aria-label={t('cart')}>
          <i className="fa-solid fa-bag-shopping" style={{ fontSize: 15 }} />
          <div className="cart-count">1</div>
        </Link>
      </div>
    </nav>
  );
}
