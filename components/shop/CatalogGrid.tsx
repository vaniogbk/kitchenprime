import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ProductCard, type CardContent } from './ProductCard';
import { type Product, type Category } from '@/lib/products';
import { type Locale } from '@/lib/i18n';
import { Icon, type IconName } from '@/components/ui/Icon';

export type Filter = 'all' | Category;
export type CatalogItem = { product: Product; content: CardContent };

/**
 * Grille du catalogue — **composant serveur**.
 *
 * Le filtrage passe par l'URL (`?cat=`) plutôt que par un état React. Deux
 * bénéfices : la grille et ses vingt vignettes n'embarquent plus de
 * JavaScript, et chaque catégorie devient une adresse réelle que les moteurs
 * peuvent explorer. La canonique de la page reste `/catalogue` sans
 * paramètre, ce qui consolide le référencement sur une seule adresse au lieu
 * de créer des quasi-doublons.
 */
export async function CatalogGrid({
  items,
  locale,
  filter = 'all',
  query,
}: {
  items: CatalogItem[];
  locale: Locale;
  filter?: Filter;
  query?: string;
}) {
  const t = await getTranslations({ locale, namespace: 'catalog' });

  let filtered = filter === 'all' ? items : items.filter((i) => i.product.category === filter);
  if (query?.trim()) {
    // La recherche porte sur le nom traduit ET la référence catalogue.
    const q = query.trim().toLowerCase();
    filtered = filtered.filter(
      (i) => i.content.name.toLowerCase().includes(q) || i.product.ref.toLowerCase().includes(q),
    );
  }

  const count = (c: Category) => items.filter((i) => i.product.category === c).length;

  const chips: Array<{ key: Filter; label: string; icon: IconName }> = [
    { key: 'all',    label: `${t('filterAll')} (${items.length})`,       icon: 'border-all' },
    { key: 'robots', label: `${t('filterRobots')} (${count('robots')})`, icon: 'blender' },
    { key: 'acc',    label: `${t('filterAcc')} (${count('acc')})`,       icon: 'kitchen-set' },
    { key: 'livres', label: `${t('filterBooks')} (${count('livres')})`,  icon: 'book-open' },
    { key: 'packs',  label: `${t('filterPacks')} (${count('packs')})`,   icon: 'boxes-stacked' },
    { key: 'maison', label: `${t('filterHome')} (${count('maison')})`,   icon: 'house' },
  ];

  /** Conserve la recherche en cours lorsqu'on change de catégorie. */
  const chipHref = (key: Filter) => {
    const params = new URLSearchParams();
    if (key !== 'all') params.set('cat', key);
    if (query?.trim()) params.set('q', query.trim());
    const qs = params.toString();
    return `/${locale}/catalogue${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="section" style={{ paddingTop: 24 }}>
      <nav className="cat-bar" aria-label={t('filterLabel')}>
        {chips.map((c) => (
          <Link
            key={c.key}
            href={chipHref(c.key)}
            className={`cat-chip${filter === c.key ? '' : ' alt'}`}
            aria-current={filter === c.key ? 'page' : undefined}
          >
            <Icon name={c.icon} /> {c.label}
          </Link>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <div className="cart-empty">
          <Icon name="magnifying-glass" />
          <p>{t('noResults', { query: query ?? '' })}</p>
        </div>
      ) : (
        <>
          <p className="sr-only">{t('resultCount', { count: filtered.length })}</p>
          <div className="grid">
            {filtered.map((i, idx) => (
              <ProductCard
                key={i.product.slug}
                product={i.product}
                content={i.content}
                locale={locale}
                eager={idx < 3}
                headingLevel={2}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
