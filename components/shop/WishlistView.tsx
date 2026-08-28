'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { type Locale } from '@/lib/i18n';
import { Icon, type IconName } from '@/components/ui/Icon';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { WishButton, readWishlist } from './WishButton';
import { AddToCartButton } from './AddToCartButton';

/**
 * Vue d'un produit en favori, entièrement préparée côté serveur.
 *
 * La page favoris est nécessairement cliente — la liste vit dans le
 * localStorage — donc elle ne peut pas rendre `ProductCard`, qui est devenu
 * un composant serveur. Elle reçoit à la place des libellés déjà traduits et
 * n'a plus qu'à les afficher.
 */
export type WishlistEntry = {
  slug: string;
  name: string;
  href: string;
  imageId: string;
  price: string;
  oldPrice: string | null;
  rating: string;
  reviewsCount: number;
  categoryLabel: string;
  categoryIcon: IconName;
  badgeLabel: string;
  badgeClass: string;
};

export function WishlistView({
  entries,
  locale,
}: {
  entries: WishlistEntry[];
  locale: Locale;
}) {
  const t = useTranslations('wishlist');
  const tCard = useTranslations('card');
  const tCatalog = useTranslations('catalog');
  const [slugs, setSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    setSlugs(readWishlist());
    // `WishButton` émet cet évènement en décochant : la liste doit se vider
    // en direct, sans rechargement.
    const refresh = () => setSlugs(readWishlist());
    window.addEventListener('kp:wishlist', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('kp:wishlist', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  if (slugs === null) {
    return (
      <div className="grid" aria-busy="true">
        <div className="kp-skeleton" style={{ height: 320 }} />
        <div className="kp-skeleton" style={{ height: 320 }} />
        <div className="kp-skeleton" style={{ height: 320 }} />
      </div>
    );
  }

  const kept = entries.filter((e) => slugs.includes(e.slug));

  if (kept.length === 0) {
    return (
      <div className="cart-empty">
        <Icon name="heart-regular" />
        <p>{t('empty')}</p>
        <Link href={`/${locale}/catalogue`} className="btn-buy">
          <Icon name="table-cells-large" /> {t('emptyCta')}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid">
      {kept.map((e) => (
        <article className="pcard" key={e.slug}>
          <div className="pcard-img">
            <RemoteImage
              imageId={e.imageId}
              alt={e.name}
              sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
            />
            {e.badgeLabel && <p className={`pbadge ${e.badgeClass}`}>{e.badgeLabel}</p>}
            <WishButton
              slug={e.slug}
              labelAdd={tCard('wish', { name: e.name })}
              labelRemove={tCard('unwish', { name: e.name })}
            />
          </div>
          <div className="pbody">
            <p className="pcat">
              <Icon name={e.categoryIcon} /> {e.categoryLabel}
            </p>
            <h2 className="pname">
              <Link href={e.href} className="pname-link">{e.name}</Link>
            </h2>
            <p className="pstars">
              <Icon name="star" />
              <span>
                {e.rating}
                <span className="sr-only"> {tCard('ratingOutOf5')} </span>({e.reviewsCount})
              </span>
            </p>
            <p className="pprice-row">
              <span className="pprice">{e.price}</span>
              {e.oldPrice && <span className="pold">{e.oldPrice}</span>}
            </p>
            <div className="pactions">
              <AddToCartButton
                slug={e.slug}
                label={tCatalog('add')}
                addedLabel={tCard('added')}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
