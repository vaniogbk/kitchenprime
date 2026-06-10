'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ProductCard } from './ProductCard';
import { type Product, type Category } from '@/lib/products';
import { type Locale } from '@/lib/i18n';

type Filter = 'all' | Category;

export function CatalogGrid({
  products,
  locale,
  initialFilter = 'all',
  query,
}: {
  products: Product[];
  locale: Locale;
  initialFilter?: Filter;
  query?: string;
}) {
  const t = useTranslations('catalog');
  const [filter, setFilter] = useState<Filter>(initialFilter);

  const filtered = useMemo(() => {
    let list = products;
    if (filter !== 'all') list = list.filter((p) => p.category === filter);
    if (query?.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, filter, query]);

  const counts = useMemo(() => {
    return {
      all: products.length,
      robots: products.filter((p) => p.category === 'robots').length,
      acc: products.filter((p) => p.category === 'acc').length,
      livres: products.filter((p) => p.category === 'livres').length,
      packs: products.filter((p) => p.category === 'packs').length,
    };
  }, [products]);

  const chips: Array<{ key: Filter; label: string; icon: string }> = [
    { key: 'all',    label: `${t('filterAll')} (${counts.all})`,        icon: 'fa-border-all' },
    { key: 'robots', label: `${t('filterRobots')} (${counts.robots})`, icon: 'fa-blender' },
    { key: 'acc',    label: `${t('filterAcc')} (${counts.acc})`,        icon: 'fa-kitchen-set' },
    { key: 'livres', label: `${t('filterBooks')} (${counts.livres})`,   icon: 'fa-book-open' },
    { key: 'packs',  label: `${t('filterPacks')} (${counts.packs})`,    icon: 'fa-boxes-stacked' },
  ];

  return (
    <div className="section" style={{ paddingTop: 24 }}>
      <div className="cat-bar">
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`cat-chip${filter === c.key ? '' : ' alt'}`}
            onClick={() => setFilter(c.key)}
          >
            <i className={`fa-solid ${c.icon}`} /> {c.label}
          </button>
        ))}
      </div>
      <div className="grid">
        {filtered.map((p) => (
          <ProductCard key={p.slug} product={p} locale={locale} />
        ))}
      </div>
    </div>
  );
}
