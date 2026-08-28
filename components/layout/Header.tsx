'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type Locale } from '@/lib/i18n';
import { Icon } from '@/components/ui/Icon';
import { useCart } from '@/components/shop/CartProvider';

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const { count, ready } = useCart();

  const homePath = `/${locale}`;
  const catalogPath = `/${locale}/catalogue`;
  const cartPath = `/${locale}/panier`;

  const isHome = pathname === homePath;
  const isCatalog = pathname.startsWith(catalogPath);

  return (
    <nav className="nav" aria-label={t('primary')}>
      <Link href={homePath} className="logo">
        Kitchen<span>Prime</span>
      </Link>
      <div className="nav-links">
        <Link href={homePath} className={`nlink${isHome ? ' on' : ''}`} aria-current={isHome ? 'page' : undefined}>
          <Icon name="house" /> <span>{t('home')}</span>
        </Link>
        <Link
          href={catalogPath}
          className={`nlink${isCatalog ? ' on' : ''}`}
          aria-current={isCatalog ? 'page' : undefined}
        >
          <Icon name="table-cells-large" /> <span>{t('catalog')}</span>
        </Link>
      </div>
      <div className="nav-right">
        <form
          className="search"
          role="search"
          action={catalogPath}
          onSubmit={(e) => {
            e.preventDefault();
            const q = String(new FormData(e.currentTarget).get('q') || '').trim();
            // Navigation côté client : pas de rechargement complet de la page.
            router.push(q ? `${catalogPath}?q=${encodeURIComponent(q)}` : catalogPath);
          }}
        >
          <Icon name="magnifying-glass" />
          <input type="search" name="q" placeholder={t('search')} aria-label={t('search')} />
        </form>
        <Link href={cartPath} className="cart-btn" aria-label={t('cartWithCount', { count })}>
          <Icon name="bag-shopping" style={{ fontSize: 15 }} />
          {ready && count > 0 && <div className="cart-count">{count}</div>}
        </Link>
      </div>
    </nav>
  );
}
